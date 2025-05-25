"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import {
  CheckCircle,
  XCircle,
  Mail,
  Phone,
  Calendar,
  Clock,
  ExternalLink,
} from "lucide-react";
import { toast } from "react-hot-toast";

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

interface CandidateListProps {
  candidates: Candidate[];
  onSelect: (candidate: Candidate) => void;
  onCandidateUpdate?: () => void;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.3,
      ease: "easeOut",
    },
  },
  hover: {
    scale: 1.02,
    transition: {
      duration: 0.2,
      ease: "easeInOut",
    },
  },
};

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
    setReason("");
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
      // Mock API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      toast.success("Confirmation email sent to candidate successfully!");
      onCandidateUpdate?.();
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
      // Mock API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      toast.success(
        `${
          emailType === "acceptance" ? "Acceptance" : "Rejection"
        } email sent successfully!`
      );
      onCandidateUpdate?.();
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
      // Mock API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      toast.success(`Candidate status updated and email sent successfully!`);
      handleDialogCancel();
      onCandidateUpdate?.();
    } catch (error) {
      console.error("Failed to submit HR decision:", error);
      toast.error("Failed to update candidate status");
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusConfig = (status: string) => {
    switch (status) {
      case "rejected":
        return {
          color: "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400",
          icon: XCircle,
          iconColor: "text-red-600",
        };
      case "shortlisted":
        return {
          color:
            "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400",
          icon: CheckCircle,
          iconColor: "text-green-600",
        };
      case "interviewed":
        return {
          color:
            "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400",
          icon: Calendar,
          iconColor: "text-blue-600",
        };
      default:
        return {
          color:
            "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400",
          icon: Clock,
          iconColor: "text-gray-600",
        };
    }
  };

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <>
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-6"
      >
        {candidates.map((candidate) => {
          const statusConfig = getStatusConfig(candidate.status);
          const StatusIcon = statusConfig.icon;

          return (
            <motion.div
              key={candidate.id}
              variants={cardVariants}
              whileHover="hover"
              layout
            >
              <Card
                className="cursor-pointer border-0 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden"
                onClick={() => onSelect(candidate)}
              >
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    {/* Avatar */}
                    <Avatar className="h-16 w-16 border-2 border-primary/20">
                      <AvatarImage
                        src={`https://api.dicebear.com/7.x/initials/svg?seed=${candidate.firstName}${candidate.lastName}`}
                      />
                      <AvatarFallback className="bg-primary/10 text-primary font-semibold text-lg">
                        {getInitials(candidate.firstName, candidate.lastName)}
                      </AvatarFallback>
                    </Avatar>

                    {/* Main Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="text-xl font-semibold text-foreground mb-1">
                            {`${candidate.firstName} ${candidate.lastName}`}
                          </h3>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <Mail className="h-4 w-4" />
                              {candidate.email}
                            </div>
                            <div className="flex items-center gap-1">
                              <Phone className="h-4 w-4" />
                              {candidate.phone}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <Badge
                            className={`${statusConfig.color} border-0 font-medium`}
                          >
                            <StatusIcon
                              className={`h-3 w-3 mr-1 ${statusConfig.iconColor}`}
                            />
                            {candidate.status}
                          </Badge>
                          <div className="text-xs text-muted-foreground">
                            {formatDate(candidate.createdAt)}
                          </div>
                        </div>
                      </div>

                      {/* Skills */}
                      {candidate.skills && candidate.skills.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-4">
                          {candidate.skills.slice(0, 5).map((skill, index) => (
                            <Badge
                              key={index}
                              variant="secondary"
                              className="text-xs"
                            >
                              {skill.replace("_", " ")}
                            </Badge>
                          ))}
                          {candidate.skills.length > 5 && (
                            <Badge variant="outline" className="text-xs">
                              +{candidate.skills.length - 5} more
                            </Badge>
                          )}
                        </div>
                      )}

                      {/* Action Buttons */}
                      <div
                        className="flex flex-wrap gap-2"
                        onClick={(e) => e.stopPropagation()}
                      >
                        {/* Accept/Shortlist Button */}
                        {candidate.status === "rejected" ? (
                          <Button
                            variant="outline"
                            size="sm"
                            className="border-green-500 text-green-700 hover:bg-green-50 dark:hover:bg-green-900/20"
                            onClick={() => openDialog(candidate, "shortlisted")}
                            disabled={isLoading}
                          >
                            <CheckCircle className="w-4 h-4 mr-2" />
                            Override to Shortlist
                          </Button>
                        ) : candidate.status === "shortlisted" ? (
                          <Button
                            variant="outline"
                            size="sm"
                            className="border-green-500 text-green-700 hover:bg-green-50 dark:hover:bg-green-900/20"
                            onClick={() => handleConfirmShortlisted(candidate)}
                            disabled={isLoading}
                          >
                            <CheckCircle className="w-4 h-4 mr-2" />
                            Confirm & Send Email
                          </Button>
                        ) : null}

                        {/* Reject Button */}
                        {candidate.status === "shortlisted" && (
                          <Button
                            variant="outline"
                            size="sm"
                            className="border-red-500 text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                            onClick={() => openDialog(candidate, "rejected")}
                            disabled={isLoading}
                          >
                            <XCircle className="w-4 h-4 mr-2" />
                            Override to Reject
                          </Button>
                        )}

                        {/* AI Email Buttons */}
                        {candidate.status === "shortlisted" && (
                          <Button
                            variant="outline"
                            size="sm"
                            className="border-blue-500 text-blue-700 hover:bg-blue-50 dark:hover:bg-blue-900/20"
                            onClick={() =>
                              handleSendAIEmail(candidate, "acceptance")
                            }
                            disabled={isLoading}
                          >
                            <Mail className="w-4 h-4 mr-2" />
                            Send AI Shortlist Email
                          </Button>
                        )}

                        {candidate.status === "rejected" && (
                          <Button
                            variant="outline"
                            size="sm"
                            className="border-orange-500 text-orange-700 hover:bg-orange-50 dark:hover:bg-orange-900/20"
                            onClick={() =>
                              handleSendAIEmail(candidate, "rejection")
                            }
                            disabled={isLoading}
                          >
                            <Mail className="w-4 h-4 mr-2" />
                            Send AI Rejection Email
                          </Button>
                        )}

                        {/* View Resume */}
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-primary hover:bg-primary/10"
                          onClick={() =>
                            window.open(candidate.resume, "_blank")
                          }
                        >
                          <ExternalLink className="w-4 h-4 mr-2" />
                          View Resume
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Override Reason Dialog */}
      <AnimatePresence>
        {dialogOpen && (
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogContent className="sm:max-w-md">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2 }}
              >
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2">
                    {actionType === "shortlisted" ? (
                      <CheckCircle className="h-5 w-5 text-green-600" />
                    ) : (
                      <XCircle className="h-5 w-5 text-red-600" />
                    )}
                    {actionType === "shortlisted"
                      ? `Override ${selectedCandidate?.firstName} to Shortlisted`
                      : `Override ${selectedCandidate?.firstName} to Rejected`}
                  </DialogTitle>
                </DialogHeader>
                <div className="py-4">
                  <Textarea
                    placeholder="Please provide a detailed reason for this override decision..."
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    className="min-h-[120px] resize-none"
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
                    className={
                      actionType === "shortlisted"
                        ? "bg-green-600 hover:bg-green-700"
                        : "bg-red-600 hover:bg-red-700"
                    }
                  >
                    {isLoading ? (
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{
                          duration: 1,
                          repeat: Number.POSITIVE_INFINITY,
                          ease: "linear",
                        }}
                        className="w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2"
                      />
                    ) : null}
                    {isLoading ? "Processing..." : "Confirm Override"}
                  </Button>
                </DialogFooter>
              </motion.div>
            </DialogContent>
          </Dialog>
        )}
      </AnimatePresence>
    </>
  );
}
