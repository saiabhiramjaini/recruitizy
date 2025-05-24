import { Job } from "@/types/job";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";

interface JobCardProps {
  job: Job;
  onClick: () => void;
}

export function JobCard({ job, onClick }: JobCardProps) {
  return (
    <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={onClick}>
      <CardHeader>
        <CardTitle>{job.title}</CardTitle>
        <CardDescription>{job.role}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between">
          <span>{job.location}</span>
          <span>{job.type.replace('_', ' ')}</span>
        </div>
        <div className="mt-2">
          <span className="text-sm text-gray-600">
            {job.candidates?.length || 0} candidates
          </span>
        </div>
      </CardContent>
    </Card>
  );
}