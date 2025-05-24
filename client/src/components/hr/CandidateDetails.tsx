import { Candidate } from "@/types/job";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

interface CandidateDetailsProps {
  candidate: Candidate;
  onBack: () => void;
}

export function CandidateDetails({ candidate, onBack }: CandidateDetailsProps) {
  return (
    <div className="space-y-6">
      <Button variant="outline" onClick={onBack}>
        <ArrowLeft className="mr-2 h-4 w-4" /> Back to Candidates
      </Button>
      
      <div className="space-y-4">
        <h2 className="text-2xl font-bold">{`${candidate.firstName} ${candidate.lastName}`}</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h3 className="font-semibold">Email</h3>
            <p>{candidate.email}</p>
          </div>
          <div>
            <h3 className="font-semibold">Phone</h3>
            <p>{candidate.phone}</p>
          </div>
          <div>
            <h3 className="font-semibold">Status</h3>
            <p>{candidate.status}</p>
          </div>
          <div>
            <h3 className="font-semibold">Resume</h3>
            <a href={candidate.resume} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
              View Resume
            </a>
          </div>
        </div>
        
        <div>
          <h3 className="font-semibold">Cover Letter</h3>
          <p className="whitespace-pre-line">{candidate.coverLetter}</p>
        </div>
        
        {candidate.experience?.length > 0 && (
          <div>
            <h3 className="font-semibold">Experience</h3>
            <div className="space-y-4">
              {candidate.experience.map((exp, index) => (
                <div key={index} className="border-l-4 border-gray-200 pl-4">
                  <h4 className="font-medium">{exp.position} at {exp.company}</h4>
                  <p className="text-sm text-gray-600">{exp.duration}</p>
                  <p className="mt-1">{exp.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {candidate.education?.length > 0 && (
          <div>
            <h3 className="font-semibold">Education</h3>
            <div className="space-y-4">
              {candidate.education.map((edu, index) => (
                <div key={index} className="border-l-4 border-gray-200 pl-4">
                  <h4 className="font-medium">{edu.degree} in {edu.fieldOfStudy}</h4>
                  <p className="text-sm text-gray-600">{edu.institution}, {edu.year}</p>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {candidate.skills?.length > 0 && (
          <div>
            <h3 className="font-semibold">Skills</h3>
            <div className="flex flex-wrap gap-2">
              {candidate.skills.map(skill => (
                <span key={skill} className="bg-gray-100 px-2 py-1 rounded">
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}
        
        <div className="flex gap-4">
          {candidate.linkedIn && (
            <a href={candidate.linkedIn} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
              LinkedIn
            </a>
          )}
          {candidate.github && (
            <a href={candidate.github} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
              GitHub
            </a>
          )}
          {candidate.portfolio && (
            <a href={candidate.portfolio} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
              Portfolio
            </a>
          )}
        </div>
      </div>
    </div>
  );
}