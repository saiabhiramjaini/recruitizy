import { Response } from "express";
import { CoreTechnology, PrismaClient } from "@prisma/client";
import { AuthenticatedAdminRequest } from "../utils/types";
import bcrypt from "bcryptjs";
import { sendEmail } from "../utils/email";
import { createCompanySchema, createJobSchema, signupSchema } from "../schema"

export const prisma = new PrismaClient();

export const addCompany = async (
  req: AuthenticatedAdminRequest,
  res: Response
) => {
  try {
    const { admin } = req;
    if (!admin) {
      return res.status(401).json({ msg: "Unauthorized" });
    }

    // Check if admin already has a company
    if (admin.companyId) {
      return res
        .status(400)
        .json({ msg: "Admin already has a company associated" });
    }

    // Validate request body
    if (!req.body) {
      return res.status(400).json({ msg: "Request body is required" });
    }

    // Validate input with Zod
    const validationResult = createCompanySchema.safeParse(req.body);

    if (!validationResult.success) {
      return res.status(400).json({
        msg: "Validation failed",
        errors: validationResult.error.errors,
      });
    }

    const {
      name,
      about,
      companySize,
      locations,
      headquarters,
      foundedYear,
      coreTechnologies,
      industry,
      website,
      linkedIn,
      twitter,
      facebook,
      instagram,
      contactEmail,
      contactPhone,
    } = validationResult.data;

    // Check if company with this name already exists
    const existingCompany = await prisma.company.findUnique({
      where: { name },
    });

    if (existingCompany) {
      return res
        .status(400)
        .json({ msg: "Company with this name already exists" });
    }

    // Create new company and update admin
    const newCompany = await prisma.company.create({
      data: {
        name,
        about,
        companySize,
        locations,
        headquarters,
        foundedYear,
        coreTechnologies,
        industry,
        website,
        linkedIn: linkedIn || "",
        twitter: twitter || "",
        facebook: facebook || "",
        instagram: instagram || "",
        contactEmail,
        contactPhone,
        admin: {
          connect: { id: admin.id },
        },
      }
    });

    // Update the admin to connect with the new company
    await prisma.admin.update({
      where: { id: admin.id },
      data: {
        company: {
          connect: { id: newCompany.id },
        },
      },
    });

    return res.status(201).json({
      msg: "Company added successfully",
      company: {
        id: newCompany.id,
        name: newCompany.name,
        about: newCompany.about,
        companySize: newCompany.companySize,
        industry: newCompany.industry,
        website: newCompany.website,
        contactEmail: newCompany.contactEmail,
        // Not returning all fields for brevity
      },
    });
  } catch (error) {
    console.error("Error adding company:", error);
    return res.status(500).json({ msg: "Internal Server Error" });
  }
};

export const addHr = async (req: AuthenticatedAdminRequest, res: Response) => {
  try {
    const { admin } = req;
    if (!admin) {
      return res.status(401).json({ msg: "Unauthorized" });
    }

    // Check if admin has a company
    if (!admin.companyId) {
      return res
        .status(400)
        .json({ msg: "Admin must be associated with a company to add HR" });
    }

    // Validate request body
    if (!req.body) {
      return res.status(400).json({ msg: "Request body is required" });
    }

    // Validate input with Zod
    const validationResult = signupSchema.safeParse(req.body);

    if (!validationResult.success) {
      return res.status(400).json({
        msg: "Validation failed",
        errors: validationResult.error.errors,
      });
    }

    const { username, email, password } = validationResult.data;

    // Check if HR with email already exists
    const existingHr = await prisma.hr.findUnique({
      where: { email },
    });

    if (existingHr) {
      return res.status(400).json({ msg: "HR with this email already exists" });
    }

    // Check if HR with username already exists - FIXED: should check by username, not email
    const existingHrUsername = await prisma.hr.findUnique({
      where: { email }, // Changed from email to username
    });

    if (existingHrUsername) {
      return res.status(400).json({ msg: "HR with this username already exists" }); // Updated message
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new HR
    const newHr = await prisma.hr.create({
      data: {
        username,
        email,
        password: hashedPassword,
        admin: {
          connect: { id: admin.id },
        },
        company: {
          connect: { id: admin.companyId },
        },
      },
      select: {
        id: true,
        username: true,
        email: true,
        createdAt: true,
        // Don't return the password
      },
    });

    const emailSubject = "Welcome to Our Company - HR Account Created";
    const emailBody = `Hello ${username},
    Your HR account has been successfully created.
    Login Credentials:
    Email: ${email}
    Password: ${password}

    Please log in and change your password after your first login.

    Regards,
    Admin Team`;

    await sendEmail(email, emailSubject, emailBody);

    return res.status(201).json({
      msg: "HR added successfully",
      hr: newHr,
    });
  } catch (error) {
    console.error("Error adding HR:", error);
    return res.status(500).json({ msg: "Internal Server Error" });
  }
};

export const getCompanyDetails = async (
  req: AuthenticatedAdminRequest,
  res: Response
) => {
  try {
    const { admin } = req;
    if (!admin) {
      return res.status(401).json({ msg: "Unauthorized" });
    }

    // Check if admin has a company
    if (!admin.companyId) {
      return res
        .status(400)
        .json({ msg: "Admin must be associated with a company to get details" });
    }

    // Fetch company details
    const company = await prisma.company.findUnique({
      where: { id: admin.companyId },
      include: {
        hrs: true, // Use the correct relation name as defined in your Prisma schema
      },
    });

    if (!company) {
      return res.status(404).json({ msg: "Company not found" });
    }

    return res.status(200).json({
      msg: "Company details fetched successfully",
      company,
    });
  } catch (error) {
    console.error("Error fetching company details:", error);
    return res.status(500).json({ msg: "Internal Server Error" });
  }
}

export const getAllHrs = async (
  req: AuthenticatedAdminRequest,
  res: Response
) => {
  try {
    const { admin } = req;
    if (!admin) {
      return res.status(401).json({ msg: "Unauthorized" });
    }

    // Check if admin has a company
    if (!admin.companyId) {
      return res
        .status(400)
        .json({ msg: "Admin must be associated with a company to get HRs" });
    }

    // Fetch all HRs associated with the admin's company
    const hrs = await prisma.hr.findMany({
      where: { companyId: admin.companyId },
      select: {
        id: true,
        username: true,
        email: true,
        createdAt: true,
      },
    });

    return res.status(200).json({
      msg: "HRs fetched successfully",
      hrs,
    });
  } catch (error) {
    console.error("Error fetching HRs:", error);
    return res.status(500).json({ msg: "Internal Server Error" });
  }
};

export const getJobPostings = async (
  req: AuthenticatedAdminRequest,
  res: Response
) => {
  try {
    const { admin } = req;
    if (!admin) {
      return res.status(401).json({ msg: "Unauthorized" });
    }

    // Fetch all HRs associated with this admin
    const hrs = await prisma.hr.findMany({
      where: {
        adminId: admin.id
      },
      include: {
        Job: {
          include: {
            company: true,
            candidates: true
          },
          orderBy: {
            createdAt: 'desc'
          }
        }
      }
    });

    return res.status(200).json({
      msg: "Job postings fetched successfully",
      hrJobs: hrs
    });
  } catch (error) {
    console.error("Error fetching job postings:", error);
    return res.status(500).json({ msg: "Internal Server Error" });
  } finally {
    await prisma.$disconnect();
  }
};