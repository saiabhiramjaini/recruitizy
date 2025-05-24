import { Request, Response } from "express";
import { AuthenticatedHRRequest } from "../utils/types";
import { PrismaClient } from "@prisma/client";
import { z } from "zod";
import { createJobSchema } from "../schema";

const prisma = new PrismaClient();

// Zod validation schema

export const createJob = async (req: AuthenticatedHRRequest, res: Response) => {
  try {
    const hr = req.hr;
    if (!hr) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    // Validate request body
    const validationResult = createJobSchema.safeParse(req.body);
    if (!validationResult.success) {
      return res.status(400).json({
        message: "Validation failed",
        errors: validationResult.error.flatten(),
      });
    }

    const jobData = validationResult.data;

    // Create the job
    const job = await prisma.job.create({
      data: {
        ...jobData,
        companyId: hr.companyId,
        hrId: hr.id,
        deadline: jobData.deadline || null,
        status: jobData.status || "Open",
      },
    });

    res.status(201).json({
      message: "Job created successfully",
      job,
    });
  } catch (error) {
    console.error("Error creating job:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getAllJobs = async (req: Request, res: Response) => {
  try {
    const jobs = await prisma.job.findMany({
      include: {
        company: {
          include: {
            admin: true,
            hrs: true
          }
        },
        hr: true,
        candidates: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    res.status(200).json({
      success: true,
      count: jobs.length,
      data: jobs
    });
  } catch (error) {
    console.error("Error fetching jobs:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error instanceof Error ? error.message : "Unknown error"
    });
  }
};

export const getJobById = async (req: Request, res: Response) => {
  const { id } = req.params;
  // Validate ID format (since your Job model uses uuid)
  if (typeof id !== 'string' || !/^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/.test(id)) {
    return res.status(400).json({
      success: false,
      message: "Invalid job ID format"
    });
  }

  try {
    const job = await prisma.job.findUnique({
      where: { id },
      include: {
        company: {
          include: {
            admin: true,
            hrs: true
          }
        },
        hr: true,
        candidates: {
          orderBy: {
            createdAt: 'desc'  // Optional: order candidates by newest first
          },
          include: {
            hr: true  // Include HR details for each candidate if available
          }
        }
      }
    });

    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found"
      });
    }

    res.status(200).json({
      success: true,
      data: job
    });
  } catch (error) {
    console.error("Error fetching job:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error instanceof Error ? error.message : "Unknown error"
    });
  }
};