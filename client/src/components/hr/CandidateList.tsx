import { Candidate } from "@/types/job";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Button } from "../ui/button";
import { CheckCircle, XCircle, Mail } from "lucide-react";
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
import toast from "react-hot-toast"; // Assuming you're using sonner for toasts

interface CandidateListProps {
  candidates: Candidate[];
  onSelect: (candidate: Candidate) => void;
  onCandidateUpdate?: () => void; // Callback to refresh the candidate list
}

export function CandidateList({
  candidates,
  onSelect,
  onCandidateUpdate,
}: CandidateListProps) {
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(
    null
  );
  const [dialogOpen, setDialogOpen] = useState(false);
  const [reason, setReason] = useState("");
  const [actionType, setActionType] = useState<
    "shortlisted" | "rejected" | null
  >(null);
  const [isLoading, setIsLoading] = useState(false);

  const openDialog = (
    candidate: Candidate,
    action: "shortlisted" | "rejected"
  ) => {
    setSelectedCandidate(candidate);
    setActionType(action);
    setDialogOpen(true);
    setReason(""); // Reset reason when opening dialog
  };

  const handleDialogCancel = () => {
    setDialogOpen(false);
    setSelectedCandidate(null);
    setActionType(null);
    setReason("");
  };

  const handleConfirmShortlisted = async (candidate: Candidate) => {
    try {
      setIsLoading(true);
      await axiosInstance.post(`/api/v1/hr/confirm/${candidate.id}`);
      toast.success("Confirmation email sent to candidate successfully!");
      onCandidateUpdate?.(); // Refresh the list
    } catch (error) {
      console.error("Failed to confirm candidate:", error);
      toast.error("Failed to send confirmation email");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendAIEmail = async (
    candidate: Candidate,
    emailType: "acceptance" | "rejection"
  ) => {
    try {
      setIsLoading(true);
      const endpoint =
        emailType === "acceptance"
          ? `/api/v1/hr/send-email/acceptance/${candidate.id}`
          : `/api/v1/hr/send-email/reject/${candidate.id}`;

      await axiosInstance.post(endpoint);
      toast.success(
        `${
          emailType === "acceptance" ? "Acceptance" : "Rejection"
        } email sent successfully!`
      );
      onCandidateUpdate?.(); // Refresh the list
    } catch (error) {
      console.error(`Failed to send ${emailType} email:`, error);
      toast.error(`Failed to send ${emailType} email`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDialogDone = async () => {
    if (!selectedCandidate || !actionType || reason.trim() === "") return;

    try {
      setIsLoading(true);
      let endpoint = "";
      const id = selectedCandidate.id;

      if (
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
        toast.error("Invalid action for current candidate status");
        return;
      }

      await axiosInstance.post(endpoint, {
        hrReason: reason.trim(),
      });

      toast.success(`Candidate status updated and email sent successfully!`);
      handleDialogCancel();
      onCandidateUpdate?.(); // Refresh the list
    } catch (error) {
      console.error("Failed to submit HR decision:", error);
      toast.error("Failed to update candidate status");
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "rejected":
        return "bg-red-100 text-red-800";
      case "shortlisted":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
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
                <span className="text-sm text-gray-600">{candidate.phone}</span>

                <span
                  className={`px-2 py-1 rounded text-sm font-medium ${getStatusColor(
                    candidate.status
                  )}`}
                >
                  {candidate.status}
                </span>

                <div className="flex gap-2 flex-wrap">
                  {/* Accept/Shortlist Button */}
                  {candidate.status === "rejected" ? (
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-green-600 text-green-700 hover:bg-green-50 hover:text-green-800"
                      onClick={(e) => {
                        e.stopPropagation();
                        openDialog(candidate, "shortlisted");
                      }}
                      disabled={isLoading}
                    >
                      <CheckCircle className="w-4 h-4 mr-1" />
                      Override to Shortlist
                    </Button>
                  ) : candidate.status === "shortlisted" ? (
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-green-600 text-green-700 hover:bg-green-50 hover:text-green-800"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleConfirmShortlisted(candidate);
                      }}
                      disabled={isLoading}
                    >
                      <CheckCircle className="w-4 h-4 mr-1" />
                      Confirm & Send Email
                    </Button>
                  ) : null}

                  {/* Reject Button */}
                  {candidate.status === "shortlisted" && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-red-600 text-red-700 hover:bg-red-50 hover:text-red-800"
                      onClick={(e) => {
                        e.stopPropagation();
                        openDialog(candidate, "rejected");
                      }}
                      disabled={isLoading}
                    >
                      <XCircle className="w-4 h-4 mr-1" />
                      Override to Reject
                    </Button>
                  )}

                  {/* AI Email Buttons */}
                  {candidate.status === "shortlisted" && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-blue-600 text-blue-700 hover:bg-blue-50 hover:text-blue-800"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSendAIEmail(candidate, "acceptance");
                      }}
                      disabled={isLoading}
                    >
                      <Mail className="w-4 h-4 mr-1" />
                      Send AI Shortlist Email
                    </Button>
                  )}

                  {candidate.status === "rejected" && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-orange-600 text-orange-700 hover:bg-orange-50 hover:text-orange-800"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSendAIEmail(candidate, "rejection");
                      }}
                      disabled={isLoading}
                    >
                      <Mail className="w-4 h-4 mr-1" />
                      Send AI Rejection Email
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Dialog for Override Reason */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {actionType === "shortlisted"
                ? `Reason for Overriding ${selectedCandidate?.firstName} to Shortlisted`
                : `Reason for Overriding ${selectedCandidate?.firstName} to Rejected`}
            </DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <Textarea
              placeholder="Please provide a detailed reason for this override..."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="min-h-[100px]"
            />
          </div>
          <DialogFooter className="flex justify-end gap-2">
            <Button
              variant="ghost"
              onClick={handleDialogCancel}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              onClick={handleDialogDone}
              disabled={reason.trim() === "" || isLoading}
            >
              {isLoading ? "Processing..." : "Confirm Override"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
