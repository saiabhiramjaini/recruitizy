"use client";

import { useState, useEffect } from 'react';
import axios from '@/utils/axios';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { format } from 'date-fns';

interface JobPosting {
  id: string;
  title: string;
  description: string;
  location: string;
  type: string;
  status: string;
  postedBy: string;
  hrEmail: string;
  company: string;
  candidatesCount: number;
  createdAt: string;
  deadline: string | null;
}

export default function AdminDashboardPage() {
  const [jobPostings, setJobPostings] = useState<JobPosting[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchJobPostings = async () => {
      try {
        const response = await axios.get('/api/v1/admin/job-postings');
        setJobPostings(response.data.data);
      } catch (err) {
        setError('Failed to fetch job postings');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchJobPostings();
  }, []);

  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case 'open':
        return <Badge>Open</Badge>;
      case 'closed':
        return <Badge variant="destructive">Closed</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p>Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <>
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Job Postings Dashboard</h1>  
        </div>
        <div className='bg-white rounded-lg shadow p-4'>
        <Table>
          <TableCaption>A list of all job postings from your HRs.</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Company</TableHead>
              <TableHead>Posted By</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Candidates</TableHead>
              <TableHead>Posted On</TableHead>
              <TableHead>Deadline</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {jobPostings.map((job) => (
              <TableRow key={job.id} className="cursor-pointer hover:bg-gray-50" onClick={() => router.push(`/admin/jobs/${job.id}`)}>
                <TableCell className="font-medium">{job.title}</TableCell>
                <TableCell>{job.company}</TableCell>
                <TableCell>
                  <div>
                    <p>{job.postedBy}</p>
                    <p className="text-sm text-gray-500">{job.hrEmail}</p>
                  </div>
                </TableCell>
                <TableCell>{job.location}</TableCell>
                <TableCell>{job.type}</TableCell>
                <TableCell>{getStatusBadge(job.status)}</TableCell>
                <TableCell>{job.candidatesCount}</TableCell>
                <TableCell>{format(new Date(job.createdAt), 'MMM dd, yyyy')}</TableCell>
                <TableCell>
                  {job.deadline ? format(new Date(job.deadline), 'MMM dd, yyyy') : 'N/A'}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {jobPostings.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No job postings found.</p>
            <p className="text-gray-400 mt-2">Your HRs haven't posted any jobs yet.</p>
          </div>
        )}
        </div>
      </div>
    </>
  );
}