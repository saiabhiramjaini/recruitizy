import { Request, Response } from 'express';
import { PrismaClient, Prisma } from '@prisma/client';
import { sendEmail } from '../utils/email';
import { applicationSchema } from '../schema';

const prisma = new PrismaClient();

export const applyJob = async (req: Request, res: Response) => {
  try {
    const { jobId } = req.params;
    const candidateData = req.body;

    // Validate UUID format
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(jobId)) {
      return res.status(400).json({ message: 'Invalid job ID format' });
    }

    // Check if job exists
    const job = await prisma.job.findUnique({
      where: { id: jobId }
    });

    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    // Get company information
    const company = await prisma.company.findUnique({
      where: { id: job.companyId }
    });

    if (!company) {
      return res.status(404).json({ message: 'Company not found' });
    }

    // Validate candidate data using Zod schema
    const validationResult = applicationSchema.safeParse(candidateData);
    if (!validationResult.success) {
      return res.status(400).json({
        message: 'Validation failed',
        errors: validationResult.error.flatten()
      });
    }

    const validatedData = validationResult.data;

    // Check if candidate has already applied for this job
    const existingApplication = await prisma.candidate.findFirst({
      where: {
        email: validatedData.email,
        jobId: jobId
      }
    });

    if (existingApplication) {
      return res.status(409).json({
        message: 'You have already applied for this job'
      });
    }

    // Prepare data for database insertion
    const candidateCreateData: any = {
      firstName: validatedData.firstName,
      lastName: validatedData.lastName,
      email: validatedData.email,
      phone: validatedData.phone || null,
      resume: validatedData.resume,
      coverLetter: validatedData.coverLetter || null,
      portfolio: validatedData.portfolio || null,
      linkedIn: validatedData.linkedIn || null,
      github: validatedData.github || null,
      skills: validatedData.skills,
      certifications: validatedData.certifications || [],
      achievements: validatedData.achievements || [],
      jobId,
      status: 'Applied'
    };

    // Handle experience array - convert to JSON if it exists
    if (validatedData.experience && validatedData.experience.length > 0) {
      candidateCreateData.experience = validatedData.experience;
    }

    // Handle education array - convert to JSON if it exists
    if (validatedData.education && validatedData.education.length > 0) {
      candidateCreateData.education = validatedData.education;
    }

    // Handle projects array - convert to JSON if it exists
    if (validatedData.projects && validatedData.projects.length > 0) {
      candidateCreateData.projects = validatedData.projects;
    }

    // Create candidate application
    const application = await prisma.candidate.create({
      data: candidateCreateData,
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        jobId: true,
        status: true,
        createdAt: true
      }
    });

    // Update job's application count (increment totalApplications or similar field)
    // Note: Assuming you have a totalApplications field, adjust as needed
    await prisma.job.update({
      where: { id: jobId },
      data: {
        // If you have a totalApplications field:
        // totalApplications: { increment: 1 }
        // Or if you're using shortlistedCandidates for total count:
        shortlistedCandidates: (job.shortlistedCandidates || 0) + 1
      }
    });

    // Send confirmation email to candidate
    const emailSubject = "Thank You for Applying - We've Received Your Application";
    const emailBody = `Hello ${validatedData.firstName} ${validatedData.lastName},

Thank you for applying for the position of ${job.title} at ${company.name}. 

We have successfully received your application and our recruitment team will review your profile. If your qualifications match our requirements, we will reach out to you for the next steps.

We appreciate your interest in joining our team and wish you the best of luck.

Best regards,  
${company.name} HR Team`;

    try {
      await sendEmail(validatedData.email, emailSubject, emailBody);
    } catch (emailError) {
      console.error('Failed to send confirmation email:', emailError);
      // Don't fail the application if email fails
    }

    return res.status(201).json({
      message: 'Application submitted successfully',
      application
    });

  } catch (error) {
    console.error('Error applying for job:', error);

    // Handle specific Prisma errors
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2002') {
        return res.status(409).json({
          message: 'Duplicate application detected'
        });
      }
      if (error.code === 'P2025') {
        return res.status(404).json({
          message: 'Related record not found'
        });
      }
    }

    return res.status(500).json({
      message: 'Internal server error',
    });
  }
};