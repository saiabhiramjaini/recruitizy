"use client";

import type React from "react";

import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Briefcase, MapPin, Target, Sparkles, CheckCircle } from "lucide-react";
import { toast } from "react-hot-toast";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut",
    },
  },
};

export default function CreateJobForm() {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    role: "",
    responsibilities: "",
    location: "",
    type: "Full_time",
    experience: "",
    education: "Bachelors_Degree",
    skills: [] as string[],
    threshold: 70,
    remote: false,
    numberOfPositions: 1,
    deadline: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);

  const skillOptions = [
    "JavaScript_TypeScript",
    "ReactJS",
    "NodeJS",
    "Python",
    "Java",
    "SQL",
    "AWS",
    "Docker",
    "UI_UX",
    "GraphQL",
    "MongoDB",
    "PostgreSQL",
    "Redis",
    "Kubernetes",
    "Machine_Learning",
    "Data_Science",
    "DevOps",
    "Cybersecurity",
  ];

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSkillChange = (skill: string, checked: boolean) => {
    setFormData((prev) => {
      if (checked) {
        return {
          ...prev,
          skills: [...prev.skills, skill],
        };
      } else {
        return {
          ...prev,
          skills: prev.skills.filter((s) => s !== skill),
        };
      }
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Mock API call
      await new Promise((resolve) => setTimeout(resolve, 2000));
      toast.success("Job posting created successfully!");

      // Reset form
      setFormData({
        title: "",
        description: "",
        role: "",
        responsibilities: "",
        location: "",
        type: "Full_time",
        experience: "",
        education: "Bachelors_Degree",
        skills: [],
        threshold: 70,
        remote: false,
        numberOfPositions: 1,
        deadline: "",
      });
      setCurrentStep(1);
    } catch (error) {
      toast.error("Failed to create job posting. Please try again.");
      console.error("Error creating job:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const nextStep = () => {
    if (currentStep < 3) setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const isStepValid = (step: number) => {
    switch (step) {
      case 1:
        return (
          formData.title &&
          formData.description &&
          formData.role &&
          formData.responsibilities
        );
      case 2:
        return (
          formData.location &&
          formData.type &&
          formData.experience &&
          formData.education
        );
      case 3:
        return formData.skills.length > 0;
      default:
        return false;
    }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="max-w-4xl mx-auto space-y-8"
    >
      {/* Header */}
      <motion.div variants={itemVariants} className="text-center space-y-4">
        <div className="flex items-center justify-center gap-2 mb-4">
          <Sparkles className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            Create New Job Posting
          </h1>
        </div>
        <p className="text-muted-foreground text-lg">
          Let AI help you create the perfect job posting to attract top talent
        </p>
      </motion.div>

      {/* Progress Steps */}
      <motion.div variants={itemVariants}>
        <div className="flex items-center justify-center space-x-8 mb-8">
          {[1, 2, 3].map((step) => (
            <div key={step} className="flex items-center">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all duration-300 ${
                  currentStep >= step
                    ? "bg-primary text-primary-foreground shadow-lg"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                {currentStep > step ? (
                  <CheckCircle className="h-5 w-5" />
                ) : (
                  step
                )}
              </div>
              {step < 3 && (
                <div
                  className={`w-16 h-1 mx-4 transition-all duration-300 ${
                    currentStep > step ? "bg-primary" : "bg-muted"
                  }`}
                />
              )}
            </div>
          ))}
        </div>
      </motion.div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Step 1: Basic Information */}
        {currentStep === 1 && (
          <motion.div
            key="step1"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Briefcase className="h-5 w-5 text-primary" />
                  Basic Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="title" className="text-sm font-medium">
                      Job Title *
                    </Label>
                    <Input
                      id="title"
                      name="title"
                      value={formData.title}
                      onChange={handleChange}
                      placeholder="e.g., Senior Frontend Developer"
                      className="h-11"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="role" className="text-sm font-medium">
                      Role *
                    </Label>
                    <Input
                      id="role"
                      name="role"
                      value={formData.role}
                      onChange={handleChange}
                      placeholder="e.g., Frontend Developer"
                      className="h-11"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description" className="text-sm font-medium">
                    Job Description URL *
                  </Label>
                  <Input
                    id="description"
                    name="description"
                    type="url"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="https://example.com/job-description"
                    className="h-11"
                    required
                  />
                  <p className="text-xs text-muted-foreground">
                    Link to detailed job description on your website or job
                    board
                  </p>
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="responsibilities"
                    className="text-sm font-medium"
                  >
                    Key Responsibilities *
                  </Label>
                  <Textarea
                    id="responsibilities"
                    name="responsibilities"
                    value={formData.responsibilities}
                    onChange={handleChange}
                    placeholder="Describe the main responsibilities and duties for this role..."
                    className="min-h-[120px] resize-none"
                    required
                  />
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Step 2: Job Details */}
        {currentStep === 2 && (
          <motion.div
            key="step2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-primary" />
                  Job Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="location" className="text-sm font-medium">
                      Location *
                    </Label>
                    <Input
                      id="location"
                      name="location"
                      value={formData.location}
                      onChange={handleChange}
                      placeholder="e.g., San Francisco, CA"
                      className="h-11"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="type" className="text-sm font-medium">
                      Job Type *
                    </Label>
                    <Select
                      value={formData.type}
                      onValueChange={(value) =>
                        handleSelectChange("type", value)
                      }
                    >
                      <SelectTrigger className="h-11">
                        <SelectValue placeholder="Select job type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Full_time">Full Time</SelectItem>
                        <SelectItem value="Part_time">Part Time</SelectItem>
                        <SelectItem value="Contract">Contract</SelectItem>
                        <SelectItem value="Internship">Internship</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="experience" className="text-sm font-medium">
                      Experience Required *
                    </Label>
                    <Input
                      id="experience"
                      name="experience"
                      value={formData.experience}
                      onChange={handleChange}
                      placeholder="e.g., 3-5 years"
                      className="h-11"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="education" className="text-sm font-medium">
                      Education Level *
                    </Label>
                    <Select
                      value={formData.education}
                      onValueChange={(value) =>
                        handleSelectChange("education", value)
                      }
                    >
                      <SelectTrigger className="h-11">
                        <SelectValue placeholder="Select education level" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Bachelors_Degree">
                          Bachelor's Degree
                        </SelectItem>
                        <SelectItem value="Masters_Degree">
                          Master's Degree
                        </SelectItem>
                        <SelectItem value="PhD">PhD</SelectItem>
                        <SelectItem value="Diploma">Diploma</SelectItem>
                        <SelectItem value="No_degree">
                          No Degree Required
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="numberOfPositions"
                      className="text-sm font-medium"
                    >
                      Number of Positions
                    </Label>
                    <Input
                      id="numberOfPositions"
                      name="numberOfPositions"
                      type="number"
                      min="1"
                      value={formData.numberOfPositions}
                      onChange={handleChange}
                      className="h-11"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="deadline" className="text-sm font-medium">
                      Application Deadline
                    </Label>
                    <Input
                      id="deadline"
                      name="deadline"
                      type="date"
                      value={formData.deadline}
                      onChange={handleChange}
                      className="h-11"
                    />
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="remote"
                    checked={formData.remote}
                    onCheckedChange={(checked) =>
                      setFormData((prev) => ({
                        ...prev,
                        remote: checked as boolean,
                      }))
                    }
                  />
                  <Label htmlFor="remote" className="text-sm font-medium">
                    Remote work available
                  </Label>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Step 3: Requirements */}
        {currentStep === 3 && (
          <motion.div
            key="step3"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-primary" />
                  Skills & Requirements
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label className="text-sm font-medium">
                      Required Skills *
                    </Label>
                    <Badge variant="secondary" className="text-xs">
                      {formData.skills.length} selected
                    </Badge>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                    {skillOptions.map((skill) => (
                      <div key={skill} className="flex items-center space-x-2">
                        <Checkbox
                          id={`skill-${skill}`}
                          checked={formData.skills.includes(skill)}
                          onCheckedChange={(checked) =>
                            handleSkillChange(skill, checked as boolean)
                          }
                        />
                        <Label
                          htmlFor={`skill-${skill}`}
                          className="text-sm cursor-pointer hover:text-primary transition-colors"
                        >
                          {skill.replace("_", " ")}
                        </Label>
                      </div>
                    ))}
                  </div>

                  {formData.skills.length > 0 && (
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">
                        Selected Skills:
                      </Label>
                      <div className="flex flex-wrap gap-2">
                        {formData.skills.map((skill) => (
                          <Badge
                            key={skill}
                            variant="default"
                            className="text-xs"
                          >
                            {skill.replace("_", " ")}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="threshold" className="text-sm font-medium">
                    AI Screening Threshold Score
                  </Label>
                  <div className="space-y-3">
                    <Input
                      id="threshold"
                      name="threshold"
                      type="number"
                      min="0"
                      max="100"
                      value={formData.threshold}
                      onChange={handleChange}
                      className="h-11"
                    />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>Lenient (50-60)</span>
                      <span>Balanced (70-80)</span>
                      <span>Strict (85-95)</span>
                    </div>
                    <div className="w-full bg-secondary rounded-full h-2">
                      <div
                        className="bg-primary h-2 rounded-full transition-all duration-300"
                        style={{ width: `${formData.threshold}%` }}
                      />
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Higher scores mean stricter AI filtering. Recommended: 70-80
                    for balanced results.
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Navigation Buttons */}
        <motion.div variants={itemVariants}>
          <div className="flex justify-between items-center pt-6">
            <Button
              type="button"
              variant="outline"
              onClick={prevStep}
              disabled={currentStep === 1}
              className="px-8"
            >
              Previous
            </Button>

            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              Step {currentStep} of 3
            </div>

            {currentStep < 3 ? (
              <Button
                type="button"
                onClick={nextStep}
                disabled={!isStepValid(currentStep)}
                className="px-8"
              >
                Next
              </Button>
            ) : (
              <Button
                type="submit"
                disabled={isSubmitting || !isStepValid(currentStep)}
                className="px-8 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70"
              >
                {isSubmitting ? (
                  <>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{
                        duration: 1,
                        repeat: Number.POSITIVE_INFINITY,
                        ease: "linear",
                      }}
                      className="w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2"
                    />
                    Creating Job...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 mr-2" />
                    Create Job Posting
                  </>
                )}
              </Button>
            )}
          </div>
        </motion.div>
      </form>
    </motion.div>
  );
}
