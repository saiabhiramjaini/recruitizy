"use client";

import { useState } from "react";
import { useForm, Controller, type SubmitHandler, type FieldValues } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
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
import { CalendarIcon, X } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import toast from "react-hot-toast";
import axios from "@/utils/axios";

// Job Form Schema
const jobFormSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  role: z.string().min(3, "Role must be at least 3 characters"),
  responsibilities: z.string().min(10, "Responsibilities must be at least 10 characters"),
  requirements: z.string().min(10, "Requirements must be at least 10 characters"),
  technologies: z.array(z.string()).min(1, "At least one technology is required"),
  interviewRounds: z.coerce.number().int().min(1).max(10),
  interviewProcess: z.string().min(10, "Interview process must be at least 10 characters"),
  location: z.string().min(2, "Location must be at least 2 characters"),
  type: z.string().min(2, "Type must be at least 2 characters"),
  experience: z.string().min(2, "Experience must be at least 2 characters"),
  education: z.string().min(2, "Education must be at least 2 characters"),
  skills: z.array(z.string()).min(1, "At least one skill is required"),
  deadline: z.date().optional(),
  remote: z.boolean().default(false),
  numberOfPositions: z.coerce.number().int().min(1).optional(),
  perks: z.array(z.string()).optional(),
});

type JobFormValues = z.infer<typeof jobFormSchema>;

// Options for multi-select fields
const technologyOptions = [
  "JavaScript",
  "React",
  "Node.js",
  "TypeScript",
  "Python",
  "Java",
  "C#",
  "Vue.js",
  "Angular",
  "Express.js",
  "MongoDB",
  "PostgreSQL",
  "Docker",
  "AWS",
];

const skillOptions = [
  "Problem Solving",
  "Teamwork",
  "Communication",
  "Leadership",
  "Time Management",
  "Critical Thinking",
  "Adaptability",
  "Creativity",
];

const perkOptions = [
  "Health Insurance",
  "Flexible Hours",
  "Remote Work",
  "Stock Options",
  "Gym Membership",
  "Free Lunch",
  "Learning Budget",
  "Vacation Days",
];

// Simple MultiSelect Component
interface MultiSelectProps {
  options: string[];
  selected: string[];
  onChange: (selected: string[]) => void;
  placeholder: string;
}

function MultiSelect({ options, selected, onChange, placeholder }: MultiSelectProps) {
  const [inputValue, setInputValue] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const filteredOptions = options.filter(
    (option) =>
      option.toLowerCase().includes(inputValue.toLowerCase()) &&
      !selected.includes(option)
  );

  const addItem = (item: string) => {
    if (!selected.includes(item)) {
      onChange([...selected, item]);
    }
    setInputValue("");
    setIsOpen(false);
  };

  const removeItem = (item: string) => {
    onChange(selected.filter((i) => i !== item));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && inputValue.trim()) {
      e.preventDefault();
      if (filteredOptions.length > 0) {
        addItem(filteredOptions[0]);
      } else if (inputValue.trim() && !selected.includes(inputValue.trim())) {
        addItem(inputValue.trim());
      }
    }
  };

  return (
    <div className="w-full">
      <div className="flex flex-wrap gap-2 mb-2">
        {selected.map((item) => (
          <Badge key={item} variant="secondary" className="flex items-center gap-1">
            {item}
            <X
              className="h-3 w-3 cursor-pointer"
              onClick={() => removeItem(item)}
            />
          </Badge>
        ))}
      </div>
      <div className="relative">
        <Input
          placeholder={placeholder}
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onFocus={() => setIsOpen(true)}
          onBlur={() => setTimeout(() => setIsOpen(false), 200)}
          onKeyDown={handleKeyDown}
        />
        {isOpen && filteredOptions.length > 0 && (
          <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
            {filteredOptions.map((option) => (
              <div
                key={option}
                className="px-3 py-2 cursor-pointer hover:bg-gray-100"
                onMouseDown={() => addItem(option)}
              >
                {option}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export function JobForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<JobFormValues>({
    resolver: zodResolver(jobFormSchema) as any,
    defaultValues: {
      title: "",
      description: "",
      role: "",
      responsibilities: "",
      requirements: "",
      technologies: [],
      interviewRounds: 3,
      interviewProcess: "",
      location: "",
      type: "Full-time",
      experience: "",
      education: "",
      skills: [],
      remote: false,
      perks: [],
    },
  });

  const onSubmit: SubmitHandler<JobFormValues> = async (values) => {
    setIsSubmitting(true);
    try {
      // Transform the data to match the API expectations
      const apiData = {
        ...values,
        deadline: values.deadline ? values.deadline.toISOString() : undefined,
      };

      const response = await axios.post("/api/v1/job", apiData);

      if (response.status === 201) {
        toast.success(response.data.message || "Job created successfully!");
        form.reset();
      } else {
        toast.error(response.data.message || "Failed to create job");
      }
    } catch (error: any) {
      if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else if (error.response?.data?.errors) {
        // Handle validation errors from server
        const errors = error.response.data.errors;
        Object.keys(errors).forEach((key) => {
          toast.error(errors[key]);
        });
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
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit as any)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Basic Information */}
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem className="md:col-span-2">
                <FormLabel>Job Title</FormLabel>
                <FormControl>
                  <Input placeholder="Senior Developer" {...field} />
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
                <FormLabel>Job Description</FormLabel>
                <FormControl>
                  <Textarea placeholder="Detailed job description..." {...field} rows={4} />
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
                <FormLabel>Role</FormLabel>
                <FormControl>
                  <Input placeholder="Developer" {...field} />
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
                <FormLabel>Job Type</FormLabel>
                <FormControl>
                  <Input placeholder="Full-time" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Requirements */}
          <FormField
            control={form.control}
            name="requirements"
            render={({ field }) => (
              <FormItem className="md:col-span-2">
                <FormLabel>Requirements</FormLabel>
                <FormControl>
                  <Textarea placeholder="Job requirements..." {...field} rows={4} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="responsibilities"
            render={({ field }) => (
              <FormItem className="md:col-span-2">
                <FormLabel>Responsibilities</FormLabel>
                <FormControl>
                  <Textarea placeholder="Job responsibilities..." {...field} rows={4} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Skills and Technologies */}
          <Controller
            control={form.control}
            name="technologies"
            render={({ field, fieldState }) => (
              <FormItem>
                <FormLabel>Technologies</FormLabel>
                <FormControl>
                  <MultiSelect
                    options={technologyOptions}
                    selected={field.value}
                    onChange={field.onChange}
                    placeholder="Select or type technologies..."
                  />
                </FormControl>
                {fieldState.error && (
                  <FormMessage>{fieldState.error.message}</FormMessage>
                )}
              </FormItem>
            )}
          />

          <Controller
            control={form.control}
            name="skills"
            render={({ field, fieldState }) => (
              <FormItem>
                <FormLabel>Required Skills</FormLabel>
                <FormControl>
                  <MultiSelect
                    options={skillOptions}
                    selected={field.value}
                    onChange={field.onChange}
                    placeholder="Select or type skills..."
                  />
                </FormControl>
                {fieldState.error && (
                  <FormMessage>{fieldState.error.message}</FormMessage>
                )}
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
                  <Input type="number" min={1} max={10} {...field} />
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
                  <Textarea placeholder="Describe the interview process..." {...field} rows={3} />
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
                <FormLabel>Location</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., Remote, New York, etc." {...field} />
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
                <FormLabel>Experience Required</FormLabel>
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
                <FormLabel>Education Required</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., Bachelor's Degree" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Perks */}
          <Controller
            control={form.control}
            name="perks"
            render={({ field, fieldState }) => (
              <FormItem className="md:col-span-2">
                <FormLabel>Perks & Benefits</FormLabel>
                <FormControl>
                  <MultiSelect
                    options={perkOptions}
                    selected={field.value || []}
                    onChange={field.onChange}
                    placeholder="Select or type perks..."
                  />
                </FormControl>
                {fieldState.error && (
                  <FormMessage>{fieldState.error.message}</FormMessage>
                )}
              </FormItem>
            )}
          />

          {/* Deadline */}
          <FormField
            control={form.control}
            name="deadline"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Application Deadline</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-[240px] pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value ? (
                          format(field.value, "PPP")
                        ) : (
                          <span>Pick a date</span>
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
                      disabled={(date) =>
                        date < new Date() || date < new Date("1900-01-01")
                      }
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Number of Positions */}
          <FormField
            control={form.control}
            name="numberOfPositions"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Number of Positions</FormLabel>
                <FormControl>
                  <Input type="number" min={1} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <Button
          type="submit"
          className="w-full"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Creating Job..." : "Create Job"}
        </Button>
      </form>
    </Form>
  );
}