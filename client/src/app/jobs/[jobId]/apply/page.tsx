"use client"

import { useState, use } from 'react'
import { useRouter } from 'next/navigation'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { FileUpload } from '@/components/file-upload'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Loader2 } from 'lucide-react'
import { getSignedURL } from '@/utils/actions'
import axios from '@/utils/axios'
import { ApplicationInput, applicationSchema } from '@/utils/schema'

export default function JobApplicationPage({ params }: { params: Promise<{ jobId: string }> }) {
  const resolvedParams = use(params)
  const router = useRouter()
  const [resumeFile, setResumeFile] = useState<File | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)

  const formMethods = useForm<ApplicationInput>({
    resolver: zodResolver(applicationSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      coverLetter: "",
      experience: [],
      education: [],
      projects: [],
      certifications: [],
      achievements: [],
      portfolio: "",
      linkedIn: "",
      github: "",
      skills: []
    }
  })

  const onSubmit = async (data: ApplicationInput) => {
    if (!resumeFile) {
      toast.error("Please upload your resume");
      return;
    }

    setIsLoading(true);

    try {
      // 1. Get signed URL
      const signedURLResult = await getSignedURL(resumeFile.type);
      
      if (signedURLResult.failure) {
        throw new Error(signedURLResult.failure);
      }

      // Simulate upload progress (since we're not actually uploading)
      setUploadProgress(100);

      // 2. Submit application data to API with the generated URL
      const response = await axios.post(`/api/v1/candidate/apply/${resolvedParams.jobId}`, {
        ...data,
        resume: signedURLResult.success?.publicUrl ?? "",
        skills: Array.isArray(data.skills) ? data.skills : [data.skills].filter(Boolean)
      });

      if (response.status === 200) {
        toast.success("Application submitted successfully!");
        router.push(`/jobs/${resolvedParams.jobId}/apply/success`);
      }

    } catch (error) {
      console.error("Application error:", error);
      toast.error(error instanceof Error ? error.message : "Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
      setUploadProgress(0);
    }
  };

  const addExperience = () => {
    formMethods.setValue("experience", [
      ...(formMethods.getValues("experience") || []),
      { company: "", position: "", duration: "", description: "" }
    ]);
  };

  const removeExperience = (index: number) => {
    const experiences = formMethods.getValues("experience") || [];
    experiences.splice(index, 1);
    formMethods.setValue("experience", experiences);
  };

  const addEducation = () => {
    formMethods.setValue("education", [
      ...(formMethods.getValues("education") || []),
      { institution: "", degree: "", fieldOfStudy: "", year: "" }
    ]);
  };

  const removeEducation = (index: number) => {
    const education = formMethods.getValues("education") || [];
    education.splice(index, 1);
    formMethods.setValue("education", education);
  };

  const addProject = () => {
    formMethods.setValue("projects", [
      ...(formMethods.getValues("projects") || []),
      { title: "", description: "", techStack: [], githubLink: "", deployedLink: "", timePeriod: "" }
    ]);
  };

  const removeProject = (index: number) => {
    const projects = formMethods.getValues("projects") || [];
    projects.splice(index, 1);
    formMethods.setValue("projects", projects);
  };

  const addCertification = () => {
    formMethods.setValue("certifications", [
      ...(formMethods.getValues("certifications") || []),
      ""
    ]);
  };

  const removeCertification = (index: number) => {
    const certifications = formMethods.getValues("certifications") || [];
    certifications.splice(index, 1);
    formMethods.setValue("certifications", certifications);
  };

  const addAchievement = () => {
    formMethods.setValue("achievements", [
      ...(formMethods.getValues("achievements") || []),
      ""
    ]);
  };

  const removeAchievement = (index: number) => {
    const achievements = formMethods.getValues("achievements") || [];
    achievements.splice(index, 1);
    formMethods.setValue("achievements", achievements);
  };

  return (
    <div className="container mx-auto py-8 max-w-3xl">
      <h1 className="text-3xl font-bold mb-6">Job Application</h1>
      
      <Form {...formMethods}>
        <form onSubmit={formMethods.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={formMethods.control}
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
              control={formMethods.control}
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

          <FormField
            control={formMethods.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input type="email" placeholder="john@example.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={formMethods.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Phone Number (Optional)</FormLabel>
                <FormControl>
                  <Input type="tel" placeholder="+1 (555) 123-4567" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="space-y-2">
            <FormLabel>Resume (PDF only)</FormLabel>
            <FileUpload
              accept="application/pdf"
              onDrop={(acceptedFiles) => setResumeFile(acceptedFiles[0])}
              progress={uploadProgress}
            />
            {resumeFile && (
              <p className="text-sm text-muted-foreground">
                Selected file: {resumeFile.name}
              </p>
            )}
          </div>

          <FormField
            control={formMethods.control}
            name="skills"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Skills (comma separated)</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="JavaScript, React, Node.js" 
                    onChange={(e) => {
                      const skills = e.target.value.split(',').map(skill => skill.trim());
                      field.onChange(skills);
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={formMethods.control}
            name="coverLetter"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Cover Letter (Optional)</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Write a cover letter explaining why you're a good fit..."
                    rows={6}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Experience Section */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium">Work Experience</h3>
              <Button type="button" variant="outline" onClick={addExperience}>
                Add Experience
              </Button>
            </div>
            
            {formMethods.watch("experience")?.map((_, index) => (
              <div key={index} className="border p-4 rounded-lg space-y-4">
                <div className="flex justify-between items-center">
                  <h4 className="font-medium">Experience #{index + 1}</h4>
                  <Button 
                    type="button" 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => removeExperience(index)}
                  >
                    Remove
                  </Button>
                </div>
                
                <FormField
                  control={formMethods.control}
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
                  control={formMethods.control}
                  name={`experience.${index}.position`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Position</FormLabel>
                      <FormControl>
                        <Input placeholder="Your Position" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={formMethods.control}
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
                  control={formMethods.control}
                  name={`experience.${index}.description`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description (Optional)</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Describe your role and responsibilities"
                          rows={3}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            ))}
          </div>

          {/* Education Section */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium">Education</h3>
              <Button type="button" variant="outline" onClick={addEducation}>
                Add Education
              </Button>
            </div>
            
            {formMethods.watch("education")?.map((_, index) => (
              <div key={index} className="border p-4 rounded-lg space-y-4">
                <div className="flex justify-between items-center">
                  <h4 className="font-medium">Education #{index + 1}</h4>
                  <Button 
                    type="button" 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => removeEducation(index)}
                  >
                    Remove
                  </Button>
                </div>
                
                <FormField
                  control={formMethods.control}
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
                  control={formMethods.control}
                  name={`education.${index}.degree`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Degree</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Bachelor of Science" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={formMethods.control}
                  name={`education.${index}.fieldOfStudy`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Field of Study</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Computer Science" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={formMethods.control}
                  name={`education.${index}.year`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Year</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., 2020" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            ))}
          </div>

          {/* Projects Section */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium">Projects</h3>
              <Button type="button" variant="outline" onClick={addProject}>
                Add Project
              </Button>
            </div>
            
            {formMethods.watch("projects")?.map((_, index) => (
              <div key={index} className="border p-4 rounded-lg space-y-4">
                <div className="flex justify-between items-center">
                  <h4 className="font-medium">Project #{index + 1}</h4>
                  <Button 
                    type="button" 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => removeProject(index)}
                  >
                    Remove
                  </Button>
                </div>
                
                <FormField
                  control={formMethods.control}
                  name={`projects.${index}.title`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Project Title</FormLabel>
                      <FormControl>
                        <Input placeholder="Project Name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={formMethods.control}
                  name={`projects.${index}.description`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Describe the project and your contributions"
                          rows={3}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={formMethods.control}
                  name={`projects.${index}.techStack`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Technologies Used (comma separated)</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="React, Node.js, MongoDB" 
                          onChange={(e) => {
                            const techStack = e.target.value.split(',').map(tech => tech.trim());
                            field.onChange(techStack);
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={formMethods.control}
                  name={`projects.${index}.githubLink`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>GitHub Link (Optional)</FormLabel>
                      <FormControl>
                        <Input placeholder="https://github.com/yourusername/project" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={formMethods.control}
                  name={`projects.${index}.deployedLink`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Deployed Link (Optional)</FormLabel>
                      <FormControl>
                        <Input placeholder="https://yourproject.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={formMethods.control}
                  name={`projects.${index}.timePeriod`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Time Period</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., 2023" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            ))}
          </div>

          {/* Certifications Section */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium">Certifications</h3>
              <Button type="button" variant="outline" onClick={addCertification}>
                Add Certification
              </Button>
            </div>
            
            {formMethods.watch("certifications")?.map((_, index) => (
              <div key={index} className="flex items-center space-x-2">
                <FormField
                  control={formMethods.control}
                  name={`certifications.${index}`}
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormControl>
                        <Input placeholder="e.g., AWS Certified Developer" {...field} />
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
                  Remove
                </Button>
              </div>
            ))}
          </div>

          {/* Achievements Section */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium">Achievements</h3>
              <Button type="button" variant="outline" onClick={addAchievement}>
                Add Achievement
              </Button>
            </div>
            
            {formMethods.watch("achievements")?.map((_, index) => (
              <div key={index} className="flex items-center space-x-2">
                <FormField
                  control={formMethods.control}
                  name={`achievements.${index}`}
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormControl>
                        <Input placeholder="e.g., Won first prize in Hackathon 2023" {...field} />
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
                  Remove
                </Button>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={formMethods.control}
              name="portfolio"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Portfolio URL (Optional)</FormLabel>
                  <FormControl>
                    <Input placeholder="https://yourportfolio.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={formMethods.control}
              name="linkedIn"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>LinkedIn Profile (Optional)</FormLabel>
                  <FormControl>
                    <Input placeholder="https://linkedin.com/in/yourprofile" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={formMethods.control}
              name="github"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>GitHub Profile (Optional)</FormLabel>
                  <FormControl>
                    <Input placeholder="https://github.com/yourusername" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <Button type="submit" disabled={isLoading} className="w-full">
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Submit Application
          </Button>
        </form>
      </Form>
    </div>
  )
}