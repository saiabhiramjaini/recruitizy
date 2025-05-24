import { Candidate } from "@/types/job";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";

interface CandidateListProps {
  candidates: Candidate[];
  onSelect: (candidate: Candidate) => void;
}

export function CandidateList({ candidates, onSelect }: CandidateListProps) {
  if (candidates.length === 0) {
    return <p>No candidates have applied yet.</p>;
  }

  return (
    <div className="space-y-4">
      {candidates.map(candidate => (
        <Card 
          key={candidate.id} 
          className="cursor-pointer hover:shadow-lg transition-shadow"
          onClick={() => onSelect(candidate)}
        >
          <CardHeader>
            <CardTitle>{`${candidate.firstName} ${candidate.lastName}`}</CardTitle>
            <CardDescription>{candidate.email}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between">
              <span>{candidate.phone}</span>
              <span className={`px-2 py-1 rounded ${
                candidate.status === 'Applied' ? 'bg-blue-100 text-blue-800' :
                candidate.status === 'Shortlisted' ? 'bg-green-100 text-green-800' :
                'bg-gray-100 text-gray-800'
              }`}>
                {candidate.status}
              </span>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}