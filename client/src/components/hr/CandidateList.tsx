import { Candidate } from "@/types/job";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Button } from "../ui/button";
import { CheckCircle, XCircle } from "lucide-react";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import axiosInstance from "@/utils/axios";

interface CandidateListProps {
  candidates: Candidate[];
  onSelect: (candidate: Candidate) => void;
}

export function CandidateList({ candidates, onSelect }: CandidateListProps) {
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(
    null
  );
  const [dialogOpen, setDialogOpen] = useState(false);
  const [reason, setReason] = useState("");
  const [actionType, setActionType] = useState<
    "shortlisted" | "rejected" | null
  >(null);

  const openDialog = (
    candidate: Candidate,
    action: "shortlisted" | "rejected"
  ) => {
    setSelectedCandidate(candidate);
    setActionType(action);
    setDialogOpen(true);
  };

  const handleDialogCancel = () => {
    setDialogOpen(false);
    setSelectedCandidate(null);
    setActionType(null);
    setReason("");
  };

  const handleDialogDone = async () => {
    if (!selectedCandidate || !actionType || reason.trim() === "") return;

    try {
      let endpoint = "";
      const id = selectedCandidate.id;

      if (
        selectedCandidate.status === "shortlisted" &&
        actionType === "shortlisted"
      ) {
        // Confirming a shortlisted candidate
        endpoint = `/api/v1/hr/confirm/${id}`;
      } else if (
        selectedCandidate.status === "shortlisted" &&
        actionType === "rejected"
      ) {
        // Overriding from shortlisted to rejected
        endpoint = `/api/v1/hr/override/reject/${id}`;
      } else if (
        selectedCandidate.status === "rejected" &&
        actionType === "shortlisted"
      ) {
        // Overriding from rejected to shortlisted
        endpoint = `/api/v1/hr/override/shortlist/${id}`;
      } else {
        alert("Invalid action. No endpoint to handle this transition.");
        return;
      }

      await axiosInstance.post(endpoint, {
        hrReason: reason.trim(),
      });

      // Reset state after successful submission
      handleDialogCancel();
    } catch (err) {
      console.error("Failed to submit HR decision", err);
    }
  };

  return (
    <>
      <div className="space-y-4">
        {candidates.map((candidate) => (
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
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between space-y-2 md:space-y-0 gap-4">
                <span>{candidate.phone}</span>
                <span
                  className={`px-2 py-1 rounded text-sm font-medium ${
                    candidate.status === "rejected"
                      ? "bg-red-100 text-red-800"
                      : candidate.status === "shortlisted"
                      ? "bg-green-100 text-green-800"
                      : "bg-gray-100 text-gray-800"
                  }`}
                >
                  {candidate.status}
                </span>

                <div className="flex gap-2">
                  {/* Accept Button - Active only if currently rejected */}
                  <Button
                    variant="outline"
                    className="border-green-600 text-green-700 hover:bg-green-50 hover:text-green-800"
                    onClick={(e) => {
                      e.stopPropagation();
                      if (candidate.status === "rejected") {
                        openDialog(candidate, "shortlisted");
                      } else if (candidate.status === "shortlisted") {
                        alert(
                          "Shortlisting mail is forwarded to the candidate."
                        );
                      } else {
                        alert("Only shortlisted candidates can be accepted.");
                      }
                    }}
                  >
                    <CheckCircle className="w-4 h-4 mr-1" />
                    Accept
                  </Button>

                  {/* Reject Button - Active only if currently shortlisted */}
                  <Button
                    variant="outline"
                    className="border-red-600 text-red-700 hover:bg-red-50 hover:text-red-800"
                    onClick={(e) => {
                      e.stopPropagation();
                      if (candidate.status === "shortlisted") {
                        openDialog(candidate, "rejected");
                      } else if (candidate.status === "rejected") {
                        alert("Candidate is already rejected.");
                      } else {
                        alert("Only shortlisted candidates can be rejected.");
                      }
                    }}
                  >
                    <XCircle className="w-4 h-4 mr-1" />
                    Reject
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Dialog for Accept/Reject Reason */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {actionType === "shortlisted"
                ? `Reason for Shortlisting ${selectedCandidate?.firstName}`
                : `Reason for Rejecting ${selectedCandidate?.firstName}`}
            </DialogTitle>
          </DialogHeader>
          <Textarea
            placeholder="Write your reason here..."
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            className="min-h-[100px]"
          />
          <DialogFooter className="mt-4 flex justify-end gap-2">
            <Button variant="ghost" onClick={handleDialogCancel}>
              Cancel
            </Button>
            <Button onClick={handleDialogDone} disabled={reason.trim() === ""}>
              Done
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
