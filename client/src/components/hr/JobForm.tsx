"use client";

import { useState } from "react";
import { useForm, Controller, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
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
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Switch } from "@/components/ui/switch";
import toast from "react-hot-toast";
import axios from "@/utils/axios";
import { MultiSelect } from "@/components/ui/multi-select";
import { createJobSchema, JobCreateInput } from "@/utils/schema";
import { educationLevelOptions, jobTypeOptions, skillOptions } from "@/utils/options";



export function JobForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);

// Replace your current form initialization with this:
const form = useForm<JobCreateInput>({
  resolver: zodResolver(createJobSchema),
  defaultValues: {
    title: "",
    description: "",
    role: "",
    responsibilities: "",
    interviewRounds: undefined,
    interviewProcess: "",
    shortlistedCandidates: undefined,
    numberOfPositions: undefined,
    location: "",
    type: "Full_time",
    experience: "",
    education: "Bachelors_Degree",
    status: "Open",
    skills: [],
    remote: false,
    deadline: undefined,
    threshold: 50,
  },
});

  const onSubmit: SubmitHandler<JobCreateInput> = async (values) => {
    setIsSubmitting(true);
    try {
      // Prepare the payload exactly matching your backend expectations
      const payload = {
        ...values,
        deadline: values.deadline ? values.deadline.toISOString() : undefined,
        // Ensure numeric fields are properly typed
        interviewRounds: Number(values.interviewRounds),
        threshold: Number(values.threshold),
        shortlistedCandidates: values.shortlistedCandidates ? Number(values.shortlistedCandidates) : undefined,
        numberOfPositions: values.numberOfPositions ? Number(values.numberOfPositions) : undefined,
      };

      console.log("Submitting payload:", payload);

      const response = await axios.post("/api/v1/job", payload);

      if (response.status === 201) {
        toast.success(response.data.message || "Job created successfully!");
        form.reset();
      } else {
        toast.error(response.data.message || "Failed to create job");
      }
    } catch (error: any) {
      console.error("Error creating job:", error);
      
      // Handle different error scenarios
      if (error.response?.status === 400) {
        // Validation errors
        if (error.response.data.errors) {
          const errors = error.response.data.errors;
          // Handle flattened zod errors
          if (errors.fieldErrors) {
            Object.entries(errors.fieldErrors).forEach(([field, messages]: [string, any]) => {
              if (Array.isArray(messages)) {
                messages.forEach((msg: string) => toast.error(`${field}: ${msg}`));
              }
            });
          } else {
            Object.entries(errors).forEach(([field, messages]: [string, any]) => {
              if (Array.isArray(messages)) {
                messages.forEach((msg: string) => toast.error(`${field}: ${msg}`));
              } else {
                toast.error(`${field}: ${messages}`);
              }
            });
          }
        } else {
          toast.error(error.response.data.message || "Validation failed");
        }
      } else if (error.response?.status === 401) {
        toast.error("Unauthorized. Please log in again.");
      } else if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else if (error.message) {
        toast.error(error.message);
      } else {
        toast.error("An unexpected error occurred");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Create New Job</h1>
        <p className="text-muted-foreground">
          Fill out the form below to create a new job posting.
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Basic Information */}
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem className="md:col-span-2">
                  <FormLabel>Job Title *</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Senior Full Stack Developer" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem className="md:col-span-2">
                  <FormLabel>Job Description URL *</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="https://company.com/jobs/job-description" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Role *</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Senior Software Engineer" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Job Type *</FormLabel>
                  <FormControl>
                    <select
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      {...field}
                    >
                      {jobTypeOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Responsibilities */}
            <FormField
              control={form.control}
              name="responsibilities"
              render={({ field }) => (
                <FormItem className="md:col-span-2">
                  <FormLabel>Responsibilities *</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Describe the key responsibilities and duties for this role..." 
                      {...field} 
                      rows={4} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Interview Details */}
            <FormField
              control={form.control}
              name="interviewRounds"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Interview Rounds</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      min={1} 
                      max={10} 
                      {...field} 
                      onChange={(e) => field.onChange(Number(e.target.value) || 3)}
                      value={field.value || 3}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="interviewProcess"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Interview Process</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Describe the interview process and stages..." 
                      {...field} 
                      rows={3} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Location and Remote */}
            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Location *</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., San Francisco, CA" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="remote"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel>Remote Position</FormLabel>
                    <p className="text-sm text-muted-foreground">
                      Is this a remote-friendly position?
                    </p>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            {/* Experience and Education */}
            <FormField
              control={form.control}
              name="experience"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Experience Required *</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., 5+ years" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="education"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Education Required *</FormLabel>
                  <FormControl>
                    <select
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      {...field}
                    >
                      {educationLevelOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Skills */}
            <Controller
              control={form.control}
              name="skills"
              render={({ field, fieldState }) => (
                <FormItem className="md:col-span-2">
                  <FormLabel>Required Skills *</FormLabel>
                  <FormControl>
                    <MultiSelect
                      options={skillOptions}
                      selected={field.value}
                      onChange={field.onChange}
                      placeholder="Select required skills..."
                    />
                  </FormControl>
                  {fieldState.error && (
                    <FormMessage>{fieldState.error.message}</FormMessage>
                  )}
                </FormItem>
              )}
            />

            {/* Status and Threshold */}
            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status</FormLabel>
                  <FormControl>
                    <select
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      {...field}
                    >
                      {statusOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="threshold"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Threshold Score (%) *</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      min={1} 
                      max={100} 
                      {...field} 
                      onChange={(e) => field.onChange(Number(e.target.value) || 50)}
                      value={field.value || 50}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Optional Fields */}
            <FormField
              control={form.control}
              name="numberOfPositions"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Number of Positions</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      min={1} 
                      {...field} 
                      onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : undefined)}
                      value={field.value || ""}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="shortlistedCandidates"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Shortlisted Candidates</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      min={0} 
                      {...field} 
                      onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : undefined)}
                      value={field.value || ""}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Deadline */}
            <FormField
              control={form.control}
              name="deadline"
              render={({ field }) => (
                <FormItem className="md:col-span-2">
                  <FormLabel>Application Deadline</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? (
                            format(field.value, "PPP")
                          ) : (
                            <span>Pick a date (optional)</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) => date < new Date()}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={isSubmitting}
            size="lg"
          >
            {isSubmitting ? "Creating Job..." : "Create Job"}
          </Button>
        </form>
      </Form>
    </div>
  );
}