import { Job } from "@/types/job";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { CandidateList } from "@/components/hr/CandidateList";

interface JobDetailsProps {
  job: Job;
  onBack: () => void;
  onCandidateSelect: (candidate: any) => void;
}

export function JobDetails({ job, onBack, onCandidateSelect }: JobDetailsProps) {
  return (
    <div className="space-y-6">
      <Button variant="outline" onClick={onBack}>
        <ArrowLeft className="mr-2 h-4 w-4" /> Back to Jobs
      </Button>
      
      <div className="space-y-4">
        <h2 className="text-2xl font-bold">{job.title}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h3 className="font-semibold">Role</h3>
            <p>{job.role}</p>
          </div>
          <div>
            <h3 className="font-semibold">Location</h3>
            <p>{job.location} {job.remote && '(Remote)'}</p>
          </div>
          <div>
            <h3 className="font-semibold">Type</h3>
            <p>{job.type.replace('_', ' ')}</p>
          </div>
          <div>
            <h3 className="font-semibold">Experience</h3>
            <p>{job.experience}</p>
          </div>
          <div>
            <h3 className="font-semibold">Status</h3>
            <p>{job.status}</p>
          </div>
          <div>
            <h3 className="font-semibold">Positions</h3>
            <p>{job.numberOfPositions || 'Not specified'}</p>
          </div>
        </div>
        
        <div>
          <h3 className="font-semibold">Description</h3>
          <p>{job.description}</p>
        </div>
        
        <div>
          <h3 className="font-semibold">Responsibilities</h3>
          <p>{job.responsibilities}</p>
        </div>
        
        <div>
          <h3 className="font-semibold">Skills</h3>
          <div className="flex flex-wrap gap-2">
            {job.skills.map(skill => (
              <span key={skill} className="bg-gray-100 px-2 py-1 rounded">
                {skill.replace('_', ' ')}
              </span>
            ))}
          </div>
        </div>
        
        {job.interviewProcess && (
          <div>
            <h3 className="font-semibold">Interview Process</h3>
            <p>{job.interviewProcess}</p>
          </div>
        )}
      </div>
      
      <div className="mt-8">
        <h3 className="text-xl font-bold mb-4">Candidates ({job.candidates?.length || 0})</h3>
        <CandidateList 
          candidates={job.candidates || []} 
          onSelect={onCandidateSelect}
        />
      </div>
    </div>
  );
}