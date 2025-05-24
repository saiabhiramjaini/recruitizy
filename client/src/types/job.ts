export interface Job {
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

export interface Candidate {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  resume: string;
  coverLetter: string;
  experience: {
    company: string;
    duration: string;
    position: string;
    description: string;
  }[];
  education: {
    year: string;
    degree: string;
    institution: string;
    fieldOfStudy: string;
  }[];
  projects: {
    title: string;
    techStack: string[];
    githubLink: string;
    timePeriod: string;
    description: string;
    deployedLink: string;
  }[];
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