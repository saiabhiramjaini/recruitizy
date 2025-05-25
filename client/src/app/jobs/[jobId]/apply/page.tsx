"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { FileUpload } from "@/components/file-upload";
import { useState } from "react";
import { getSignedURL } from "@/utils/actions";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import toast from "react-hot-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Trash, Loader2 } from "lucide-react";
import { applicationSchema } from "@/utils/schema";
import axios from "@/utils/axios";
import { config } from "@/utils/config";
import { useRouter } from "next/navigation";

type ExperienceItem = NonNullable<
  z.infer<typeof applicationSchema>["experience"]
>[number];
type EducationItem = NonNullable<
  z.infer<typeof applicationSchema>["education"]
>[number];
type ProjectItem = NonNullable<
  z.infer<typeof applicationSchema>["projects"]
>[number];

export default function JobApplicationPage({
  params,
}: {
  params: { jobId: string };
}) {
  const router = useRouter();
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [isParsing, setIsParsing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof applicationSchema>>({
    resolver: zodResolver(applicationSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      resume: "",
      coverLetter: "",
      experience: [],
      education: [],
      projects: [],
      certifications: [],
      achievements: [],
      portfolio: "",
      linkedIn: "",
      github: "",
      skills: [],
    },
  });

  const handleFileDrop = async (acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) return;

    const file = acceptedFiles[0];
    console.log("Selected file:", file.name);

    setIsUploading(true);
    setUploadProgress(0);

    try {
      // Get signed URL from server
      const signedURLResult = await getSignedURL(file.type, "resumes");

      if (!signedURLResult?.success?.url) {
        throw new Error(signedURLResult?.failure || "Failed to get upload URL");
      }

      const { url, key, publicUrl } = signedURLResult.success;
      console.log("Generated signed URL:", url);

      setUploadProgress(30);

      // Upload file to S3
      const uploadResponse = await fetch(url, {
        method: "PUT",
        body: file,
        headers: {
          "Content-Type": file.type,
        },
      });

      if (!uploadResponse.ok) {
        throw new Error(`Upload failed with status ${uploadResponse.status}`);
      }

      setUploadProgress(100);

      const fileUrl =
        publicUrl ||
        `https://${process.env.NEXT_PUBLIC_AWS_BUCKET_NAME}.s3.${
          process.env.NEXT_PUBLIC_AWS_BUCKET_REGION || "ap-south-1"
        }.amazonaws.com/${key}`;

      console.log("Resume uploaded successfully!");
      console.log("Public URL:", fileUrl);

      // Set resume URL in form
      form.setValue("resume", fileUrl);

      // Parse the resume
      await parseResume(fileUrl);
    } catch (error) {
      console.error("Upload error:", error);
      setUploadProgress(0);
      toast.error(
        error instanceof Error
          ? `Failed to upload resume: ${error.message}`
          : "Failed to upload resume"
      );
    } finally {
      setIsUploading(false);
    }
  };

  const parseResume = async (resumeUrl: string) => {
    setIsParsing(true);
    try {
      const response = await axios.post(`${config.FLASK_URL}/parse_cv`, {
        cv_file: resumeUrl,
      });

      if (response.status !== 200) {
        throw new Error(`Failed to parse resume: ${response.statusText}`);
      }

      const parsedData = response.data;
      console.log("Parsed resume data:", parsedData);

      // Update form with parsed data
      form.reset({
        firstName: parsedData.firstName || "",
        lastName: parsedData.lastName || "",
        email: parsedData.email || "",
        phone: parsedData.phone || "",
        resume: resumeUrl,
        coverLetter: form.getValues("coverLetter") || "",
        experience:
          parsedData.experience?.map((exp: any) => ({
            company: exp.company || "",
            position: exp.position || "",
            duration: exp.duration || "",
            description: exp.description || "",
          })) || [],
        education:
          parsedData.education?.map((edu: any) => ({
            institution: edu.institution || "",
            degree: edu.degree || "",
            fieldOfStudy: edu.fieldOfStudy || "",
            year: edu.year || "",
          })) || [],
        projects:
          parsedData.projects?.map((proj: any) => ({
            title: proj.title || "",
            description: proj.description || "",
            techStack: proj.techStack || [],
            githubLink: proj.githubLink || "",
            deployedLink: proj.deployedLink || "",
            timePeriod: proj.timePeriod || "",
          })) || [],
        certifications: parsedData.certifications || [],
        achievements: parsedData.achievements || [],
        portfolio: parsedData.portfolio || "",
        linkedIn: parsedData.linkedIn || "",
        github: parsedData.github || "",
        skills: parsedData.skills || [],
      });

      toast.success("Resume parsed successfully. Please review the information.");
    } catch (error) {
      console.error("Parsing error:", error);
      toast.error(
        error instanceof Error
          ? `Failed to parse resume: ${error.message}`
          : "Failed to parse resume"
      );
    } finally {
      setIsParsing(false);
    }
  };

  const onSubmit = async (values: z.infer<typeof applicationSchema>) => {
    setIsSubmitting(true);
    try {
      // First submit the application
      const applicationResponse = await axios.post(
        `/api/v1/candidate/apply/${params.jobId}`,
        values
      );

      if (applicationResponse.status !== 201) {
        throw new Error(
          applicationResponse.data?.message || "Failed to submit application"
        );
      }

      toast.success("Application submitted successfully!");

      // Then trigger AI screening
      const aiResponse = await axios.post(
        `${config.FLASK_URL}/candidate_screening`,
        { email: values.email }
      );

      console.log("AI screening response:", aiResponse.data);

      // Reset form and redirect or show success message
      form.reset();
      router.push("/applications/success");
    } catch (error) {
      console.error("Submission error:", error);
      toast.error(
        error instanceof Error
          ? `Failed to submit application: ${error.message}`
          : "Failed to submit application"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const addExperience = () => {
    const currentExperiences = form.getValues("experience") || [];
    form.setValue("experience", [
      ...currentExperiences,
      {
        company: "",
        position: "",
        duration: "",
        description: "",
      },
    ]);
  };

  const removeExperience = (index: number) => {
    const currentExperiences = form.getValues("experience") || [];
    form.setValue(
      "experience",
      currentExperiences.filter((_: any, i: number) => i !== index)
    );
  };

  const addEducation = () => {
    const currentEducations = form.getValues("education") || [];
    form.setValue("education", [
      ...currentEducations,
      {
        institution: "",
        degree: "",
        fieldOfStudy: "",
        year: "",
      },
    ]);
  };

  const removeEducation = (index: number) => {
    const currentEducations = form.getValues("education") || [];
    form.setValue(
      "education",
      currentEducations.filter((_: any, i: number) => i !== index)
    );
  };

  const addProject = () => {
    const currentProjects = form.getValues("projects") || [];
    form.setValue("projects", [
      ...currentProjects,
      {
        title: "",
        description: "",
        techStack: [],
        githubLink: "",
        deployedLink: "",
        timePeriod: "",
      },
    ]);
  };

  const removeProject = (index: number) => {
    const currentProjects = form.getValues("projects") || [];
    form.setValue(
      "projects",
      currentProjects.filter((_: any, i: number) => i !== index)
    );
  };

  const addSkill = () => {
    const currentSkills = form.getValues("skills") || [];
    form.setValue("skills", [...currentSkills, ""]);
  };

  const removeSkill = (index: number) => {
    const currentSkills = form.getValues("skills") || [];
    form.setValue(
      "skills",
      currentSkills.filter((_: any, i: number) => i !== index)
    );
  };

  const addCertification = () => {
    const currentCertifications = form.getValues("certifications") || [];
    form.setValue("certifications", [...currentCertifications, ""]);
  };

  const removeCertification = (index: number) => {
    const currentCertifications = form.getValues("certifications") || [];
    form.setValue(
      "certifications",
      currentCertifications.filter((_: any, i: number) => i !== index)
    );
  };

  const addAchievement = () => {
    const currentAchievements = form.getValues("achievements") || [];
    form.setValue("achievements", [...currentAchievements, ""]);
  };

  const removeAchievement = (index: number) => {
    const currentAchievements = form.getValues("achievements") || [];
    form.setValue(
      "achievements",
      currentAchievements.filter((_: any, i: number) => i !== index)
    );
  };

  return (
    <div className="container mx-auto py-8 px-4 max-w-4xl">
      <h1 className="text-2xl font-bold mb-6">Job Application</h1>

      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Upload Your Resume</h2>
        <FileUpload
          accept="application/pdf"
          onDrop={handleFileDrop}
          progress={uploadProgress}
        />
        <p className="text-sm text-muted-foreground mt-2">
          {isUploading
            ? "Uploading your resume..."
            : isParsing
            ? "Parsing your resume..."
            : "Drag & drop your resume here, or click to select. Only PDF files are accepted."}
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="firstName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>First Name</FormLabel>
                      <FormControl>
                        <Input placeholder="John" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="lastName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Last Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Doe" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input placeholder="john.doe@example.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone</FormLabel>
                      <FormControl>
                        <Input placeholder="+1234567890" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="resume"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Resume URL</FormLabel>
                    <FormControl>
                      <Input {...field} readOnly />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="coverLetter"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Cover Letter</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Tell us why you're a good fit for this position..."
                        className="min-h-[120px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Experience</CardTitle>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addExperience}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Experience
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {form.watch("experience")?.map((_: any, index: any) => (
                <div key={index} className="space-y-4 border p-4 rounded-lg">
                  <div className="flex justify-between items-center">
                    <h3 className="font-medium">Experience #{index + 1}</h3>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeExperience(index)}
                    >
                      <Trash className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                  <FormField
                    control={form.control}
                    name={`experience.${index}.company`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Company</FormLabel>
                        <FormControl>
                          <Input placeholder="Company Name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`experience.${index}.position`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Position</FormLabel>
                        <FormControl>
                          <Input placeholder="Job Title" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`experience.${index}.duration`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Duration</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., 2020-2022" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`experience.${index}.description`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Describe your responsibilities and achievements..."
                            className="min-h-[80px]"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              ))}
              {(!form.watch("experience") ||
                form.watch("experience")?.length === 0) && (
                <p className="text-sm text-muted-foreground text-center py-4">
                  No experience added yet.
                </p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Education</CardTitle>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addEducation}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Education
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {form.watch("education")?.map((_: any, index: any) => (
                <div key={index} className="space-y-4 border p-4 rounded-lg">
                  <div className="flex justify-between items-center">
                    <h3 className="font-medium">Education #{index + 1}</h3>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeEducation(index)}
                    >
                      <Trash className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                  <FormField
                    control={form.control}
                    name={`education.${index}.institution`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Institution</FormLabel>
                        <FormControl>
                          <Input placeholder="University Name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`education.${index}.degree`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Degree</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="e.g., Bachelor of Science"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`education.${index}.fieldOfStudy`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Field of Study</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="e.g., Computer Science"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`education.${index}.year`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Year</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., 2016-2020" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              ))}
              {(!form.watch("education") ||
                form.watch("education")?.length === 0) && (
                <p className="text-sm text-muted-foreground text-center py-4">
                  No education added yet.
                </p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Projects</CardTitle>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addProject}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Project
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {form.watch("projects")?.map((_: any, index: any) => (
                <div key={index} className="space-y-4 border p-4 rounded-lg">
                  <div className="flex justify-between items-center">
                    <h3 className="font-medium">Project #{index + 1}</h3>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeProject(index)}
                    >
                      <Trash className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                  <FormField
                    control={form.control}
                    name={`projects.${index}.title`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Title</FormLabel>
                        <FormControl>
                          <Input placeholder="Project Name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`projects.${index}.description`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Describe the project and your contributions..."
                            className="min-h-[80px]"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`projects.${index}.techStack`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Technologies Used</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="e.g., React, Node.js, MongoDB"
                            {...field}
                            value={field.value?.join(", ") || ""}
                            onChange={(e) => {
                              const value = e.target.value;
                              form.setValue(
                                `projects.${index}.techStack`,
                                value.split(",").map((tech) => tech.trim())
                              );
                            }}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name={`projects.${index}.githubLink`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>GitHub Link</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="https://github.com/..."
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name={`projects.${index}.deployedLink`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Deployed Link</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="https://example.com"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <FormField
                    control={form.control}
                    name={`projects.${index}.timePeriod`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Time Period</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., 2022" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              ))}
              {(!form.watch("projects") ||
                form.watch("projects")?.length === 0) && (
                <p className="text-sm text-muted-foreground text-center py-4">
                  No projects added yet.
                </p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Skills</CardTitle>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addSkill}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Skill
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {form.watch("skills")?.map((_: any, index: any) => (
                <div key={index} className="flex items-center gap-2">
                  <FormField
                    control={form.control}
                    name={`skills.${index}`}
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormControl>
                          <Input placeholder="e.g., JavaScript" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeSkill(index)}
                  >
                    <Trash className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              ))}
              {(!form.watch("skills") ||
                form.watch("skills")?.length === 0) && (
                <p className="text-sm text-muted-foreground text-center py-4">
                  No skills added yet.
                </p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Certifications</CardTitle>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addCertification}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Certification
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {form.watch("certifications")?.map((_: any, index: any) => (
                <div key={index} className="flex items-center gap-2">
                  <FormField
                    control={form.control}
                    name={`certifications.${index}`}
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormControl>
                          <Input
                            placeholder="e.g., AWS Certified Developer"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeCertification(index)}
                  >
                    <Trash className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              ))}
              {(!form.watch("certifications") ||
                form.watch("certifications")?.length === 0) && (
                <p className="text-sm text-muted-foreground text-center py-4">
                  No certifications added yet.
                </p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Achievements</CardTitle>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addAchievement}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Achievement
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {form.watch("achievements")?.map((_: any, index: any) => (
                <div key={index} className="space-y-2">
                  <div className="flex items-center gap-2">
                    <FormField
                      control={form.control}
                      name={`achievements.${index}`}
                      render={({ field }) => (
                        <FormItem className="flex-1">
                          <FormControl>
                            <Textarea
                              placeholder="e.g., Won first prize in Hackathon 2021"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeAchievement(index)}
                    >
                      <Trash className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </div>
              ))}
              {(!form.watch("achievements") ||
                form.watch("achievements")?.length === 0) && (
                <p className="text-sm text-muted-foreground text-center py-4">
                  No achievements added yet.
                </p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Links</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="portfolio"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Portfolio</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="https://yourportfolio.com"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="linkedIn"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>LinkedIn</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="https://linkedin.com/in/yourprofile"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="github"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>GitHub</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="https://github.com/yourusername"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          <div className="flex justify-end">
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Submit Application
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
