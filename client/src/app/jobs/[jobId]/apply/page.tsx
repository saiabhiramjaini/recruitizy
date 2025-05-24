// client/src/app/jobs/[jobId]/apply/page.tsx

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

// Form schema matching your backend
const applicationSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email"),
  phone: z.string().min(10, "Phone number must be at least 10 digits").optional(),
  coverLetter: z.string().optional(),
  skills: z.string().min(1, "Please list at least one skill"),
  experience: z.array(z.object({
    company: z.string(),
    position: z.string(),
    duration: z.string(),
    description: z.string().optional()
  })).optional(),
  education: z.array(z.object({
    institution: z.string(),
    degree: z.string(),
    fieldOfStudy: z.string(),
    year: z.string()
  })).optional(),
  portfolio: z.string().url().or(z.string().length(0)).optional(),
  linkedIn: z.string().url().or(z.string().length(0)).optional(),
  github: z.string().url().or(z.string().length(0)).optional()
})

type ApplicationFormValues = z.infer<typeof applicationSchema>

export default function JobApplicationPage({ params }: { params: Promise<{ jobId: string }> }) {
  // Unwrap the params Promise using React.use()
  const resolvedParams = use(params)
  const router = useRouter()
  const [resumeFile, setResumeFile] = useState<File | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)

  const formMethods = useForm<ApplicationFormValues>({
    resolver: zodResolver(applicationSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      coverLetter: "",
      skills: "",
      experience: [],
      education: [],
      portfolio: "",
      linkedIn: "",
      github: ""
    }
  })

  const onSubmit = async (data: ApplicationFormValues) => {
  if (!resumeFile) {
    toast.error("Please upload your resume");
    return;
  }

  setIsLoading(true);

  try {
    // 1. Get signed URL (this generates the URL but we won't actually upload)
    const signedURLResult = await getSignedURL(resumeFile.type);
    
    if (signedURLResult.failure) {
      throw new Error(signedURLResult.failure);
    }

    // Simulate upload progress (since we're not actually uploading)
    setUploadProgress(100);

    // 2. Submit application data to API with the generated URL
    const response = await axios.post(`/api/v1/candidate/apply/${resolvedParams.jobId}`, {
      ...data,
      resume: signedURLResult.success?.publicUrl ?? "", // Use the public URL from signedURLResult if available
      skills: data.skills.split(',').map(skill => skill.trim()),
      experience: data.experience || [],
      education: data.education || []
    });

    if (response.status === 200) {
      toast.success("Application submitted successfully!");
      router.push(`/jobs/${resolvedParams.jobId}/apply/success`);
    }

    // 3. Handle the response from the server
   
    if (response.data.error) {
      toast.error(response.data.error);
    }

  } catch (error) {
    console.error("Application error:", error);
    toast.error(error instanceof Error ? error.message : "Something went wrong. Please try again.");
  } finally {
    setIsLoading(false);
    setUploadProgress(0);
  }
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
              render={({ field }: any) => (
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
              render={({ field }: any) => (
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
            render={({ field }: any) => (
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
            render={({ field }: any) => (
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
            render={({ field }: any) => (
              <FormItem>
                <FormLabel>Skills (comma separated)</FormLabel>
                <FormControl>
                  <Input placeholder="JavaScript, React, Node.js" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={formMethods.control}
            name="coverLetter"
            render={({ field }: any) => (
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={formMethods.control}
              name="portfolio"
              render={({ field }: any) => (
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
              render={({ field }: any) => (
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
              render={({ field }: any) => (
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