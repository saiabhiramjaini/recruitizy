"use client";

import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { JobForm } from "@/components/hr/JobForm";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useEffect, useState } from "react";
import { JobCard } from "@/components/hr/JobCard";
import { JobDetails } from "@/components/hr/JobDetails";
import { CandidateDetails } from "@/components/hr/CandidateDetails";
import axios from "@/utils/axios";

interface Job {
  id: string;
  title: string;
  description: string;
  role: string;
  responsibilities: string;
  interviewRounds: number | null;
  interviewProcess: string | null;
  shortlistedCandidates: number | null;
  numberOfPositions: number | null;
  location: string;
  type: string;
  experience: string;
  education: string;
  status: string;
  skills: string[];
  remote: boolean;
  deadline: string | null;
  threshold: number;
  jdSummary: string | null;
  companyId: number;
  hrId: number;
  createdAt: string;
  updatedAt: string;
  candidates: Candidate[];
}

interface Candidate {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  resume: string;
  coverLetter: string;
  experience: any[];
  education: any[];
  projects: any[];
  certifications: string[];
  achievements: string[];
  portfolio: string;
  linkedIn: string;
  github: string;
  status: string;
  aiMailResponse: string | null;
  aiAnalysis: string | null;
  skills: string[];
  jobId: string;
  hrId: number | null;
  createdAt: string;
  updatedAt: string;
}

export default function JobsPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await axios.get("/api/v1/hr/all-jobs");
        setJobs(response.data.data);
      } catch (error) {
        console.error('Error fetching jobs:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  const fetchJobDetails = async (jobId: string) => {
    try {
      const response = await fetch(`http://localhost:8080/api/v1/job/${jobId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch job details');
      }
      const data = await response.json();
      setSelectedJob(data.data);
    } catch (error) {
      console.error('Error fetching job details:', error);
    }
  };

  const handleBackToList = () => {
    setSelectedJob(null);
    setSelectedCandidate(null);
  };

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      {!selectedJob ? (
        <>
          <div className="flex items-center justify-between">
            <h2 className="text-3xl font-bold tracking-tight">Jobs</h2>
            <Dialog>
              <DialogTrigger asChild>
                <Button className="bg-[#A9ED42] hover:bg-[#A9ED42]/90">
                  <Plus className="mr-2 h-4 w-4" />
                  Create Job
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Create New Job</DialogTitle>
                </DialogHeader>
                <JobForm />
              </DialogContent>
            </Dialog>
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {jobs.map((job) => (
              <JobCard 
                key={job.id} 
                job={job} 
                onClick={() => fetchJobDetails(job.id)}
              />
            ))}
          </div>
        </>
      ) : !selectedCandidate ? (
        <JobDetails 
          job={selectedJob} 
          onBack={handleBackToList}
          onCandidateSelect={setSelectedCandidate}
        />
      ) : (
        <Dialog open={true} onOpenChange={(open) => !open && setSelectedCandidate(null)}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Candidate Details</DialogTitle>
            </DialogHeader>
            <CandidateDetails 
              candidate={selectedCandidate} 
              onBack={() => setSelectedCandidate(null)}
            />
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}