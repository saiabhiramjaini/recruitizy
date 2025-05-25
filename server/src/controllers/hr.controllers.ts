import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { z } from "zod";
import { sendEmail } from "../utils/email";
import { AuthenticatedHRRequest } from "../utils/types";

const prisma = new PrismaClient();

type AIMailResponse = {
  to: string;
  body: string;
  subject: string;
  companyName?: string; // Optional, can be set dynamically
};

type AISelectionSchema = {};

// Zod schema for request validation
const hrIdSchema = z.string().min(1, "HR ID is required");

export const getAllHrJobs = async (
  req: AuthenticatedHRRequest,
  res: Response
) => {
  try {
    const { hr } = req;

    // Validate HR ID
    if (!hr || !hr.id) {
      return res.status(400).json({
        success: false,
        message: "HR ID is required",
      });
    }
    const hrId = hr.id.toString();

    // Validate HR ID
    const validationResult = hrIdSchema.safeParse(hrId);
    if (!validationResult.success) {
      return res.status(400).json({
        success: false,
        message: "Validation error",
        errors: validationResult.error.errors,
      });
    }

    // Check if HR exists
    const hrExists = await prisma.hr.findUnique({
      where: { id: parseInt(hrId) },
    });

    if (!hrExists) {
      return res.status(404).json({
        success: false,
        message: "HR not found",
      });
    }

    // Fetch all jobs for the HR with comprehensive data
    const jobs = await prisma.job.findMany({
      where: {
        hrId: parseInt(hrId),
      },
      include: {
        company: {
          include: {
            admin: true, // Include admin details
            hrs: true, // Include all HRs in the company
          },
        },
        hr: true, // Include the HR who created the job
        candidates: {
          orderBy: {
            createdAt: "desc", // Newest candidates first
          },
          include: {
            hr: true, // Include HR details for each candidate
          },
        },
      },
      orderBy: {
        createdAt: "desc", // Newest jobs first
      },
    });

    return res.status(200).json({
      success: true,
      count: jobs.length,
      data: jobs,
    });
  } catch (error) {
    console.error("Error fetching HR jobs:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

export const confirmCandidateDecision = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const candidate = await prisma.candidate.findFirst({ where: { id } });
    if (!candidate) {
      return res.status(404).json({ message: "Candidate not found" });
    }

    const aiMail = candidate.aiMailResponse as AIMailResponse;

    const fullName = `${candidate.firstName} ${candidate.lastName}`;
    const emailSubject = aiMail.subject;
    const emailTo = aiMail.to || candidate.email;
    const companyName = aiMail.companyName; // You can make this dynamic if needed

    const emailBody = `Dear ${fullName},

We're pleased to inform you that you've been selected to move forward in the hiring process for the position at ${companyName}. Congratulations!

Below is a summary of the feedback generated from our AI-based screening system:

${aiMail.body.trim()}

Our HR team will reach out to you shortly with details regarding the next steps.

Thank you once again for your interest in joining ${companyName}. We look forward to connecting with you soon.

Best regards,  
Recruitment Team  
${companyName}`;

    await sendEmail(emailTo, emailSubject, emailBody);

    return res
      .status(200)
      .json({ message: "Confirmation email sent successfully." });
  } catch (error) {
    console.error("Error confirming candidate decision:", error);
    return res
      .status(500)
      .json({ error: "Server error while confirming decision." });
  }
};

export const overrideShortlistToReject = async (
  req: Request,
  res: Response
) => {
  try {
    const { id } = req.params;
    const { hrReason } = req.body;

    if (!hrReason)
      return res.status(400).json({ message: "hrReason is required." });

    const candidate = await prisma.candidate.findFirst({ where: { id } });
    if (!candidate || candidate.status !== "shortlisted")
      return res
        .status(400)
        .json({ message: "Candidate not eligible for rejection override." });

    const job = await prisma.job.findFirst({ where: { id: candidate.jobId! } });
    const company = await prisma.company.findFirst({
      where: { id: job!.companyId },
    });

    const aiMail = candidate.aiMailResponse as AIMailResponse;
    const fullName = `${candidate.firstName} ${candidate.lastName}`;

    const emailBody = `Hello ${fullName},

Thank you for applying for the position of ${job!.title} at ${company!.name}.

Our AI-based system initially shortlisted your profile:
"${aiMail.body.trim()}"

However, after internal review, our HR team decided not to proceed because ${hrReason}.

We appreciate your interest and invite you to apply for future roles.

Warm regards,  
HR Team at ${company!.name}`;

    await prisma.candidate.update({
      where: { id },
      data: { status: "rejected" },
    });
    await sendEmail(
      candidate.email,
      "Update on Your Application Status",
      emailBody
    );

    return res.status(200).json({
      message: "Candidate status updated to rejected and email sent.",
    });
  } catch (error) {
    return res
      .status(500)
      .json({ error: "Server error while overriding shortlist to reject." });
  }
};

export const overrideRejectToShortlist = async (
  req: Request,
  res: Response
) => {
  try {
    const { id } = req.params;
    const { hrReason } = req.body;

    if (!hrReason)
      return res.status(400).json({ message: "hrReason is required." });

    const candidate = await prisma.candidate.findFirst({ where: { id } });
    if (!candidate || candidate.status !== "rejected")
      return res
        .status(400)
        .json({ message: "Candidate not eligible for shortlist override." });

    const job = await prisma.job.findFirst({ where: { id: candidate.jobId! } });
    const company = await prisma.company.findFirst({
      where: { id: job!.companyId },
    });

    const fullName = `${candidate.firstName} ${candidate.lastName}`;

    const emailBody = `Hello ${fullName},

Thank you for applying for the position of ${job!.title} at ${company!.name}.

While our AI system initially rejected your profile, our HR team reviewed your application and felt that ${hrReason}.

Based on this, you've been shortlisted for the next step.

Best regards,  
HR Team at ${company!.name}`;

    await prisma.candidate.update({
      where: { id },
      data: { status: "shortlisted" },
    });
    await sendEmail(candidate.email, "You've Been Shortlisted!", emailBody);

    return res.status(200).json({
      message: "Candidate status updated to shortlisted and email sent.",
    });
  } catch (error) {
    return res
      .status(500)
      .json({ error: "Server error while overriding reject to shortlist." });
  }
};

export const getStats = async (req: AuthenticatedHRRequest, res: Response) => {
  try {
    const { hr } = req;

    // Validate HR ID
    if (!hr || !hr.id) {
      return res.status(400).json({
        success: false,
        message: "HR ID is required",
      });
    }
    const hrId = hr.id.toString();

    // Fetch stats for the HR
    const stats = await prisma.job.aggregate({
      where: {
        hrId: parseInt(hrId),
      },
      _count: {
        id: true,
      },
      _avg: {
        threshold: true,
      },
      _sum: {
        numberOfPositions: true,
      },
    });

    return res.status(200).json({
      success: true,
      data: stats,
    });
  } catch (error) {
    console.error("Error fetching HR stats:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

export const getJobStatusDistribution = async (
  req: AuthenticatedHRRequest,
  res: Response
) => {
  try {
    const { hr } = req;

    if (!hr || !hr.id) {
      return res.status(400).json({
        success: false,
        message: "HR ID is required",
      });
    }
    const hrId = hr.id.toString();

    const statusDistribution = await prisma.job.groupBy({
      by: ["status"],
      where: {
        hrId: parseInt(hrId),
      },
      _count: {
        id: true,
      },
    });

    const formattedData = statusDistribution.map((item) => ({
      status: item.status,
      count: item._count.id,
    }));

    return res.status(200).json({
      success: true,
      data: formattedData,
    });
  } catch (error) {
    console.error("Error fetching job status distribution:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

export const getCandidateStatusDistribution = async (
  req: AuthenticatedHRRequest,
  res: Response
) => {
  try {
    const { hr } = req;

    if (!hr || !hr.id) {
      return res.status(400).json({
        success: false,
        message: "HR ID is required",
      });
    }
    const hrId = hr.id.toString();

    const statusDistribution = await prisma.candidate.groupBy({
      by: ["status"],
      where: {
        hrId: parseInt(hrId),
      },
      _count: {
        id: true,
      },
    });

    const formattedData = statusDistribution.map((item) => ({
      status: item.status,
      count: item._count.id,
    }));

    return res.status(200).json({
      success: true,
      data: formattedData,
    });
  } catch (error) {
    console.error("Error fetching candidate status distribution:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

export const sendAiAcceptanceEmailController = async (
  req: Request,
  res: Response
) => {
  try {
    console.log("Sending AI acceptance email...");
    const id = req.params.id;

    const getCandidate = await prisma.candidate.findFirst({
      where: { id },
    });

    if (!getCandidate) {
      return res.status(404).json({
        success: false,
        message: "Candidate not found",
      });
    }

    const job = await prisma.job.findFirst({
      where: { id: getCandidate.jobId! },
    });

    const company = await prisma.company.findFirst({
      where: { id: job!.companyId },
    });

    // ✅ Safely cast aiAnalysis
    const aiAnalysis = getCandidate.aiAnalysis as {
      ai_selection_email?: string;
    };

    const aiResponse = aiAnalysis.ai_selection_email;

    const fullName = `${getCandidate.firstName} ${getCandidate.lastName}`;

    const emailBody = `Hello ${fullName},

I am an AI assistant representing the hiring team at ${
      company!.name
    }. Thank you for applying for the position of ${job!.title} at our company.

I am pleased to inform you that you have been shortlisted in our initial AI-powered resume screening process. You were selected because ${aiResponse}.

Your application details, along with your CV, have been shared with the HR and technical team at ${
      company!.name
    }. They will carefully review your profile and reach out to you with further steps or interview details shortly.

Wishing you all the best!

Warm regards,  
AI Assistant,  
Hiring Team at ${company!.name}`;

    await sendEmail(
      getCandidate.email,
      `AI Reesume Shortlisting for ${job!.title} at ${company!.name}`,
      emailBody
    );

    return res.status(200).json({
      success: true,
      message: "Shortlisting email sent to the candidate.",
    });
  } catch (error) {
    console.error("Error sending email:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};
export const sendAiRejectionEmailController = async (
  req: Request,
  res: Response
) => {
  try {
    const id = req.params.id;

    const getCandidate = await prisma.candidate.findFirst({
      where: { id },
    });

    if (!getCandidate) {
      return res.status(404).json({
        success: false,
        message: "Candidate not found",
      });
    }

    const job = await prisma.job.findFirst({
      where: { id: getCandidate.jobId! },
    });

    const company = await prisma.company.findFirst({
      where: { id: job!.companyId },
    });

    // ✅ Safely cast aiAnalysis
    const aiAnalysis = getCandidate.aiAnalysis as {
      ai_rejection_email?: string;
    };

    const aiResponse = aiAnalysis.ai_rejection_email;

    const fullName = `${getCandidate.firstName} ${getCandidate.lastName}`;

    const emailBody = `Hello ${fullName},

I am an AI assistant representing the hiring team at ${
      company!.name
    }. Thank you for applying for the position of ${job!.title} at our company.

I am pleased to inform you that you have been rejected in our initial AI-powered resume screening process. You were rejected because ${aiResponse}.

Your application details, along with your CV, have been shared with the HR and technical team at ${
      company!.name
    }. They may carefully review your profile and reach out to you with further steps or interview details shortly. Don't lose hope it's HR final decision.

Wishing you all the best!

Warm regards,  
AI Assistant,  
Hiring Team at ${company!.name}`;

    await sendEmail(
      getCandidate.email,
      `AI Resume Screening Rejection for ${job!.title} at ${company!.name}`,
      emailBody
    );

    return res.status(200).json({
      success: true,
      message: "Rejection email sent to the candidate.",
    });
  } catch (error) {
    console.error("Error sending email:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};
