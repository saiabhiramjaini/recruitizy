"use client";

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import axios from '@/utils/axios';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { ArrowLeft, Mail, Phone, FileText, Github, Linkedin, Briefcase, GraduationCap } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { Separator } from '@/components/ui/separator';
import Markdown from 'react-markdown';

interface Job {
  id: string;
  title: string;
  description: string;
  role: string;
  responsibilities: string;
  technologies: string[];
  interviewRounds: number;
  interviewProcess: string;
  shortlistedCandidates: number | null;
  numberOfPositions: number | null;
  location: string;
  type: string;
  experience: string;
  education: string;
  status: string;
  skills: string[];
  perks: string[];
  remote: boolean;
  deadline: string | null;
  threshold: number | null;
  jdSummary: string;
  companyId: number;
  hrId: number;
  createdAt: string;
  updatedAt: string;
  company: {
    id: number;
    name: string;
    about: string;
    companySize: number;
    locations: string[];
    headquarters: string;
    foundedYear: number;
    coreTechnologies: string[];
    industry: string;
    website: string | null;
    linkedIn: string | null;
    twitter: string | null;
    facebook: string | null;
    instagram: string | null;
    contactEmail: string | null;
    contactPhone: string | null;
  };
  hr: {
    id: number;
    username: string;
    email: string;
  };
  candidates: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string | null;
    resume: string;
    coverLetter: string | null;
    experience: any[];
    education: any[];
    portfolio: string | null;
    linkedIn: string | null;
    github: string | null;
    status: string;
    note: string | null;
    skills: string[];
  }[];
}

export default function JobDetailsPage() {
  const router = useRouter();
  const { jobId } = useParams();
  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchJobDetails = async () => {
      try {
        const response = await axios.get(`/api/v1/job/${jobId}`);
        setJob(response.data.data);
      } catch (err) {
        setError('Failed to fetch job details');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchJobDetails();
  }, [jobId]);

  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case 'open':
        return <Badge className="bg-green-500 hover:bg-green-600">Open</Badge>;
      case 'closed':
        return <Badge className="bg-red-500 hover:bg-red-600">Closed</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  if (loading) {
    return (
      <div>
        <div className="container mx-auto px-4 py-8">
          <div className="space-y-4">
            <Skeleton className="h-10 w-1/3" />
            <Skeleton className="h-6 w-1/2" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <Skeleton className="h-8 w-full" />
                <Skeleton className="h-32 w-full" />
                <Skeleton className="h-8 w-full" />
                <Skeleton className="h-32 w-full" />
              </div>
              <div className="space-y-4">
                <Skeleton className="h-8 w-full" />
                <Skeleton className="h-32 w-full" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-12">
            <p className="text-red-500 text-xl">{error}</p>
            <Button className="mt-4" onClick={() => router.back()}>
              Go Back
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (!job) {
    return (
      <div>
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-12">
            <p className="text-gray-500 text-xl">Job not found</p>
            <Button className="mt-4" onClick={() => router.back()}>
              Go Back
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="container mx-auto px-4 py-8">
        <Button
          variant="outline"
          className="mb-6"
          onClick={() => router.back()}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Jobs
        </Button>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h1 className="text-3xl font-bold">{job.title}</h1>
              <p className="text-lg text-gray-600">{job.company.name}</p>
            </div>
            <div className="flex items-center gap-2">
              {getStatusBadge(job.status)}
              <Badge variant="outline">
                {job.type}
              </Badge>
              {job.remote && <Badge variant="outline">Remote</Badge>}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="space-y-2">
              <h3 className="font-semibold">Location</h3>
              <p>{job.location}</p>
            </div>
            <div className="space-y-2">
              <h3 className="font-semibold">Experience</h3>
              <p>{job.experience}</p>
            </div>
            <div className="space-y-2">
              <h3 className="font-semibold">Education</h3>
              <p>{job.education}</p>
            </div>
            <div className="space-y-2">
              <h3 className="font-semibold">Posted On</h3>
              <p>{format(new Date(job.createdAt), 'MMM dd, yyyy')}</p>
            </div>
            <div className="space-y-2">
              <h3 className="font-semibold">Deadline</h3>
              <p>{job.deadline ? format(new Date(job.deadline), 'MMM dd, yyyy') : 'No deadline'}</p>
            </div>
            <div className="space-y-2">
              <h3 className="font-semibold">HR Contact</h3>
              <p>{job.hr.username} ({job.hr.email})</p>
            </div>
          </div>

          <Separator className="my-6" />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <div>
              <h2 className="text-xl font-semibold mb-4">Job Description</h2>
              <div className="prose max-w-none">
                <Markdown>{job.jdSummary || job.description}</Markdown>
              </div>
            </div>

            <div>
              <h2 className="text-xl font-semibold mb-4">Details</h2>
              <div className="space-y-6">
                <div>
                  <h3 className="font-medium mb-2">Role</h3>
                  <p>{job.role}</p>
                </div>
                <div>
                  <h3 className="font-medium mb-2">Responsibilities</h3>
                  <p>{job.responsibilities}</p>
                </div>
                <div>
                  <h3 className="font-medium mb-2">Technologies</h3>
                  <div className="flex flex-wrap gap-2">
                    {job.technologies.map((tech, index) => (
                      <Badge key={index} variant="outline">
                        {tech}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div>
                  <h3 className="font-medium mb-2">Skills</h3>
                  <div className="flex flex-wrap gap-2">
                    {job.skills.map((skill, index) => (
                      <Badge key={index} variant="outline">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>
                {job.perks.length > 0 && (
                  <div>
                    <h3 className="font-medium mb-2">Perks</h3>
                    <ul className="list-disc pl-5">
                      {job.perks.map((perk, index) => (
                        <li key={index}>{perk}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </div>

          <Separator className="my-6" />

          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Interview Process</h2>
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="bg-gray-100 rounded-full p-2">
                  <Briefcase className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-medium">Rounds: {job.interviewRounds}</h3>
                  <p className="text-gray-600">{job.interviewProcess}</p>
                </div>
              </div>
            </div>
          </div>

          <Separator className="my-6" />

          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Candidates ({job.candidates.length})</h2>
            </div>

            {job.candidates.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500">No candidates have applied yet</p>
              </div>
            ) : (
              <div className="space-y-4">
                {job.candidates.map((candidate) => (
                  <div key={candidate.id} className="border rounded-lg p-4 hover:bg-gray-50">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium">{candidate.firstName} {candidate.lastName}</h3>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="outline">
                            {candidate.status}
                          </Badge>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm" asChild>
                          <a href={`mailto:${candidate.email}`}>
                            <Mail className="h-4 w-4 mr-2" />
                            Email
                          </a>
                        </Button>
                      </div>
                    </div>

                    <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Mail className="h-4 w-4 text-gray-500" />
                          <a href={`mailto:${candidate.email}`} className="text-blue-600 hover:underline">
                            {candidate.email}
                          </a>
                        </div>
                        {candidate.phone && (
                          <div className="flex items-center gap-2">
                            <Phone className="h-4 w-4 text-gray-500" />
                            <a href={`tel:${candidate.phone}`} className="text-blue-600 hover:underline">
                              {candidate.phone}
                            </a>
                          </div>
                        )}
                        <div className="flex items-center gap-2">
                          <FileText className="h-4 w-4 text-gray-500" />
                          <a href={candidate.resume} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                            View Resume
                          </a>
                        </div>
                        {candidate.github && (
                          <div className="flex items-center gap-2">
                            <Github className="h-4 w-4 text-gray-500" />
                            <a href={candidate.github} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                              GitHub
                            </a>
                          </div>
                        )}
                        {candidate.linkedIn && (
                          <div className="flex items-center gap-2">
                            <Linkedin className="h-4 w-4 text-gray-500" />
                            <a href={candidate.linkedIn} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                              LinkedIn
                            </a>
                          </div>
                        )}
                      </div>

                      <div className="space-y-4">
                        {candidate.experience.length > 0 && (
                          <div>
                            <h4 className="font-medium flex items-center gap-2">
                              <Briefcase className="h-4 w-4" />
                              Experience
                            </h4>
                            <div className="mt-2 space-y-2">
                              {candidate.experience.map((exp: any, index: number) => (
                                <div key={index} className="pl-6">
                                  <p className="font-medium">{exp.position} at {exp.company}</p>
                                  <p className="text-sm text-gray-600">{exp.duration}</p>
                                  <p className="text-sm mt-1">{exp.description}</p>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {candidate.education.length > 0 && (
                          <div>
                            <h4 className="font-medium flex items-center gap-2">
                              <GraduationCap className="h-4 w-4" />
                              Education
                            </h4>
                            <div className="mt-2 space-y-2">
                              {candidate.education.map((edu: any, index: number) => (
                                <div key={index} className="pl-6">
                                  <p className="font-medium">{edu.degree} in {edu.fieldOfStudy}</p>
                                  <p className="text-sm text-gray-600">{edu.institution}, {edu.year}</p>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {candidate.skills.length > 0 && (
                      <div className="mt-4">
                        <h4 className="font-medium mb-2">Skills</h4>
                        <div className="flex flex-wrap gap-2">
                          {candidate.skills.map((skill, index) => (
                            <Badge key={index} variant="outline">
                              {skill}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}