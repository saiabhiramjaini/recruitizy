import { Request, Response } from 'express';
import { PrismaClient } from "@prisma/client";
import { z } from "zod";
import { sendEmail } from '../utils/email';
import { AuthenticatedHRRequest } from '../utils/types';

const prisma = new PrismaClient();

type AIMailResponse = {
    body: string;
    closing: string;
    subject: string;
    greeting: string;
};

// Zod schema for request validation
const hrIdSchema = z.string().min(1, "HR ID is required");

export const getAllHrJobs = async (req: AuthenticatedHRRequest, res: Response) => {
    try {
        const {hr} = req;

        // Validate HR ID
        if(!hr || !hr.id) {
            return res.status(400).json({
                success: false,
                message: "HR ID is required"
            });
        }
        const hrId = hr.id.toString();

        // Validate HR ID
        const validationResult = hrIdSchema.safeParse(hrId);
        if (!validationResult.success) {
            return res.status(400).json({
                success: false,
                message: "Validation error",
                errors: validationResult.error.errors
            });
        }

        // Check if HR exists
        const hrExists = await prisma.hr.findUnique({
            where: { id: parseInt(hrId) }
        });

        if (!hrExists) {
            return res.status(404).json({
                success: false,
                message: "HR not found"
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
                        admin: true,  // Include admin details
                        hrs: true     // Include all HRs in the company
                    }
                },
                hr: true,  // Include the HR who created the job
                candidates: {
                    orderBy: {
                        createdAt: 'desc'  // Newest candidates first
                    },
                    include: {
                        hr: true  // Include HR details for each candidate
                    }
                }
            },
            orderBy: {
                createdAt: 'desc'  // Newest jobs first
            }
        });

        return res.status(200).json({
            success: true,
            count: jobs.length,
            data: jobs
        });

    } catch (error) {
        console.error("Error fetching HR jobs:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error instanceof Error ? error.message : "Unknown error"
        });
    }
};

export const makeShortlistMembers = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { hrAccepted, hrReason } = req.body;

        const getCandidate = await prisma.candidate.findFirst({
            where: {
                id
            }
        })

        if (!getCandidate) {
            return res.status(404).json({
                message: "Candidate not found"
            })
        }

        if (!getCandidate.jobId) {
            return res.status(400).json({
                message: "Candidate is not associated with any job"
            });
        }

        const getJob = await prisma.job.findFirst({
            where: {
                id: getCandidate.jobId
            }
        })

        if (!getJob) {
            return res.status(404).json({
                message: "Job Not found"
            })
        }
        const getCompany = await prisma.company.findFirst({
            where: {
                id: getJob.companyId
            }
        })

        if (!getCompany) {
            return res.status(404).json({
                message: "Company Not found"
            })
        }

        // console.log(getCandidate.status);
        // console.log(hrAccepted);

        if (getCandidate.status == 'shortlisted' && hrAccepted == 'shortlisted') {
            const aiMailResponse = getCandidate.aiMailResponse as AIMailResponse;

            const emailSubject = aiMailResponse.subject;
            const emailBody = `${aiMailResponse.greeting}

            ${aiMailResponse.body}

            ${aiMailResponse.closing}`;

            await sendEmail(getCandidate.email, emailSubject, emailBody);

        }
        else if (getCandidate.status == 'rejected' && hrAccepted == 'rejected') {
            const aiMailResponse = getCandidate.aiMailResponse as AIMailResponse;

            const emailSubject = aiMailResponse.subject;
            const emailBody = `${aiMailResponse.greeting}

            ${aiMailResponse.body}

            ${aiMailResponse.closing}`;

            await sendEmail(getCandidate.email, emailSubject, emailBody);

        }

        else if (getCandidate.status === 'shortlisted' && hrAccepted === 'rejected') {
            if (!hrReason) {
                return res.status(400).json({ message: "HR reason required for rejection override" });
            }

            const aiMailResponse = getCandidate.aiMailResponse as AIMailResponse;

            const emailSubject = "Update on Your Application Status";
            const emailBody = `Hello ${getCandidate.firstName} ${getCandidate.lastName},

Thank you for applying for the position of ${getJob.title} at ${getCompany.name}.

Our AI-based evaluation system initially shortlisted your profile based on the following feedback:
"${aiMailResponse.body.trim()}"

However, after careful internal review, our HR team decided not to proceed further. The team felt that ${hrReason}.

We appreciate your time and effort, and we encourage you to apply for future opportunities with us that may be a better fit.

Warm regards,  
HR Team at ${getCompany.name}`;

            await sendEmail(getCandidate.email, emailSubject, emailBody);
        }

        else if (getCandidate.status === 'rejected' && hrAccepted === 'shortlisted') {
            if (!hrReason) {
                return res.status(400).json({ message: "HR reason required for acceptance override" });
            }

            const aiMailResponse = getCandidate.aiMailResponse as AIMailResponse;

            const emailSubject = "You've Been Shortlisted for the Next Step";
            const emailBody = `Hello ${getCandidate.firstName} ${getCandidate.lastName},

Thank you for applying for the position of ${getJob.title} at ${getCompany.name}.

While our AI-based evaluation system initially did not shortlist your profile, our HR team manually reviewed your application and felt that ${hrReason}. Based on this assessment, we’re happy to inform you that you’ve been shortlisted for the next step in the hiring process.

We'll be in touch shortly with further details.

Best regards,  
HR Team at ${getCompany.name}`;

            await sendEmail(getCandidate.email, emailSubject, emailBody);
        }
        return res.status(200).json({
            message: "Shortlisted successfully"
        })

    } catch (error) {
        console.error("Error fetching HR jobs:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error instanceof Error ? error.message : "Unknown error"
        });
    }
}


export const getStats = async (req: AuthenticatedHRRequest, res: Response) => {
    try {
        const { hr } = req;

        // Validate HR ID
        if (!hr || !hr.id) {
            return res.status(400).json({
                success: false,
                message: "HR ID is required"
            });
        }
        const hrId = hr.id.toString();

        // Fetch stats for the HR
        const stats = await prisma.job.aggregate({
            where: {
                hrId: parseInt(hrId),
            },
            _count: {
                id: true
            },
            _avg: {
                threshold: true,
            },
            _sum: {
                numberOfPositions: true,
            }
        });

        return res.status(200).json({
            success: true,
            data: stats
        });

    } catch (error) {
        console.error("Error fetching HR stats:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error instanceof Error ? error.message : "Unknown error"
        });
    }
}

export const getJobStatusDistribution = async (req: AuthenticatedHRRequest, res: Response) => {
    try {
        const { hr } = req;

        if (!hr || !hr.id) {
            return res.status(400).json({
                success: false,
                message: "HR ID is required"
            });
        }
        const hrId = hr.id.toString();

        const statusDistribution = await prisma.job.groupBy({
            by: ['status'],
            where: {
                hrId: parseInt(hrId),
            },
            _count: {
                id: true,
            },
        });

        const formattedData = statusDistribution.map(item => ({
            status: item.status,
            count: item._count.id,
        }));

        return res.status(200).json({
            success: true,
            data: formattedData
        });

    } catch (error) {
        console.error("Error fetching job status distribution:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error instanceof Error ? error.message : "Unknown error"
        });
    }
}

export const getCandidateStatusDistribution = async (req: AuthenticatedHRRequest, res: Response) => {
    try {
        const { hr } = req;

        if (!hr || !hr.id) {
            return res.status(400).json({
                success: false,
                message: "HR ID is required"
            });
        }
        const hrId = hr.id.toString();

        const statusDistribution = await prisma.candidate.groupBy({
            by: ['status'],
            where: {
                hrId: parseInt(hrId),
            },
            _count: {
                id: true,
            },
        });

        const formattedData = statusDistribution.map(item => ({
            status: item.status,
            count: item._count.id,
        }));

        return res.status(200).json({
            success: true,
            data: formattedData
        });

    } catch (error) {
        console.error("Error fetching candidate status distribution:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error instanceof Error ? error.message : "Unknown error"
        });
    }
}