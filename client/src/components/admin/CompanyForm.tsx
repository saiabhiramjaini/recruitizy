"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
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
import { useState } from "react";
import toast from "react-hot-toast";
import axios from "@/utils/axios";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MultiSelect } from "@/components/ui/multi-select";
import { z } from "zod";

// Define the Industry enum values to match backend
const IndustryValues = [
  "Technology",
  "Finance_Banking",
  "Healthcare_Biotech",
  "Manufacturing_Automotive",
  "Retail_Consumer_Goods",
  "Energy_Utilities",
  "Media_Entertainment",
  "Telecommunications",
  "Transportation_Logistics",
  "Real_Estate_Construction",
  "Education",
  "Government_Public_Sector",
  "Non_Profit_Social_Impact",
  "Other"
] as const;

// Define the CoreTechnology enum values to match backend
const CoreTechnologyValues = [
  "Artificial_Intelligence",
  "Machine_Learning",
  "Blockchain",
  "Cloud_Computing",
  "Cybersecurity",
  "Data_Science",
  "Internet_of_Things_IoT",
  "Augmented_Reality_AR",
  "Virtual_Reality_VR",
  "Mobile_Development",
  "Web_Development",
  "DevOps",
  "Software_Development",
  "Testing_Quality_Assurance"
] as const;

// Create the schema to match your backend exactly
export const createCompanySchema = z.object({
  name: z.string()
    .min(3, { message: "Company name must be at least 3 characters" })
    .max(100, { message: "Company name cannot exceed 100 characters" }),

  about: z.string()
    .min(10, { message: "About section must be at least 10 characters" })
    .max(2000, { message: "About section cannot exceed 2000 characters" }),

  companySize: z.number()
    .int({ message: "Company size must be an integer" })
    .positive({ message: "Company size must be a positive number" })
    .min(1, { message: "Company size must be at least 1" })
    .max(1000000, { message: "Company size cannot exceed 1,000,000" }),

  locations: z.array(z.string()
    .min(2, { message: "Each location must be at least 2 characters" })
    .max(100, { message: "Each location cannot exceed 100 characters" })
  ).min(1, { message: "At least one location is required" }),

  headquarters: z.string()
    .min(2, { message: "Headquarters must be at least 2 characters" })
    .max(100, { message: "Headquarters cannot exceed 100 characters" }),

  foundedYear: z.number()
    .int({ message: "Founded year must be an integer" })
    .min(1800, { message: "Founded year cannot be before 1800" })
    .max(new Date().getFullYear(), { message: "Founded year cannot be in the future" }),

  coreTechnologies: z.array(z.enum(CoreTechnologyValues, {
    errorMap: () => ({ message: "Please select valid core technologies" })
  }))
    .min(1, { message: "At least one core technology is required" })
    .max(20, { message: "Cannot select more than 20 core technologies" }),

  industry: z.enum(IndustryValues, {
    errorMap: () => ({ message: "Please select a valid industry" })
  }),

  website: z.string()
    .url({ message: "Website must be a valid URL" })
    .max(200, { message: "Website URL cannot exceed 200 characters" })
    .optional()
    .or(z.literal("")),

  linkedIn: z.string()
    .url({ message: "LinkedIn must be a valid URL" })
    .max(200, { message: "LinkedIn URL cannot exceed 200 characters" })
    .optional()
    .or(z.literal("")),

  twitter: z.string()
    .url({ message: "Twitter must be a valid URL" })
    .max(200, { message: "Twitter URL cannot exceed 200 characters" })
    .optional()
    .or(z.literal("")),

  facebook: z.string()
    .url({ message: "Facebook must be a valid URL" })
    .max(200, { message: "Facebook URL cannot exceed 200 characters" })
    .optional()
    .or(z.literal("")),

  instagram: z.string()
    .url({ message: "Instagram must be a valid URL" })
    .max(200, { message: "Instagram URL cannot exceed 200 characters" })
    .optional()
    .or(z.literal("")),

  contactEmail: z.string()
    .email({ message: "Contact email must be valid" })
    .max(100, { message: "Contact email cannot exceed 100 characters" })
    .optional()
    .or(z.literal("")),

  contactPhone: z.string()
    .min(6, { message: "Contact phone must be at least 6 characters" })
    .max(20, { message: "Contact phone cannot exceed 20 characters" })
    .regex(/^[+\d][\d\s-]+$/, { message: "Contact phone must be a valid phone number" })
    .optional()
    .or(z.literal("")),
});

export type CompanyCreateInput = z.infer<typeof createCompanySchema>;

// Define options for selects with correct mapping
const industryOptions = [
  { value: "Technology", label: "Technology" },
  { value: "Finance_Banking", label: "Finance & Banking" },
  { value: "Healthcare_Biotech", label: "Healthcare & Biotech" },
  { value: "Manufacturing_Automotive", label: "Manufacturing & Automotive" },
  { value: "Retail_Consumer_Goods", label: "Retail & Consumer Goods" },
  { value: "Energy_Utilities", label: "Energy & Utilities" },
  { value: "Media_Entertainment", label: "Media & Entertainment" },
  { value: "Telecommunications", label: "Telecommunications" },
  { value: "Transportation_Logistics", label: "Transportation & Logistics" },
  { value: "Real_Estate_Construction", label: "Real Estate & Construction" },
  { value: "Education", label: "Education" },
  { value: "Government_Public_Sector", label: "Government & Public Sector" },
  { value: "Non_Profit_Social_Impact", label: "Non-Profit & Social Impact" },
  { value: "Other", label: "Other" }
];

const coreTechOptions = [
  { value: "Artificial_Intelligence", label: "Artificial Intelligence" },
  { value: "Machine_Learning", label: "Machine Learning" },
  { value: "Blockchain", label: "Blockchain" },
  { value: "Cloud_Computing", label: "Cloud Computing" },
  { value: "Cybersecurity", label: "Cybersecurity" },
  { value: "Data_Science", label: "Data Science" },
  { value: "Internet_of_Things_IoT", label: "Internet of Things (IoT)" },
  { value: "Augmented_Reality_AR", label: "Augmented Reality (AR)" },
  { value: "Virtual_Reality_VR", label: "Virtual Reality (VR)" },
  { value: "Mobile_Development", label: "Mobile Development" },
  { value: "Web_Development", label: "Web Development" },
  { value: "DevOps", label: "DevOps" },
  { value: "Software_Development", label: "Software Development" },
  { value: "Testing_Quality_Assurance", label: "Testing & Quality Assurance" }
];

export function CompanyForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<CompanyCreateInput>({
    resolver: zodResolver(createCompanySchema),
    defaultValues: {
      name: "",
      about: "",
      companySize: undefined,
      locations: [],
      headquarters: "",
      foundedYear: undefined,
      coreTechnologies: [],
      industry: undefined,
      website: "",
      linkedIn: "",
      twitter: "",
      facebook: "",
      instagram: "",
      contactEmail: "",
      contactPhone: "",
    },
  });

  const onSubmit = async (values: CompanyCreateInput) => {
    setIsSubmitting(true);
    try {
      // Send data exactly as expected by backend - no conversion needed
      const response = await axios.post<{ msg: string; company: any }>(
        `/api/v1/admin/company`,
        values
      );

      if (response.status === 201) {
        toast.success(response.data.msg || "Company created successfully!");
        form.reset();
      } else {
        toast.error(response.data.msg || "Failed to create company");
      }
    } catch (error: any) {
      console.error("Error creating company:", error);
      
      if (error.response?.data?.errors) {
        // Handle Zod validation errors from backend
        error.response.data.errors.forEach((err: any) => {
          const fieldName = err.path?.[0];
          if (fieldName) {
            form.setError(fieldName as keyof CompanyCreateInput, {
              type: "manual",
              message: err.message,
            });
          }
        });
        toast.error("Please fix the validation errors");
      } else if (error.response?.data?.msg) {
        toast.error(error.response.data.msg);
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
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Company Name */}
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Company Name *</FormLabel>
                <FormControl>
                  <Input placeholder="Enter company name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Industry */}
          <FormField
            control={form.control}
            name="industry"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Industry *</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select industry" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {industryOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* About */}
          <FormField
            control={form.control}
            name="about"
            render={({ field }) => (
              <FormItem className="md:col-span-2">
                <FormLabel>About Company *</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Tell us about your company... (minimum 10 characters)"
                    className="min-h-[120px]"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Company Size */}
          <FormField
            control={form.control}
            name="companySize"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Company Size *</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="Number of employees"
                    {...field}
                    value={field.value || ""}
                    onChange={(e) => {
                      const value = e.target.value;
                      field.onChange(value ? parseInt(value, 10) : undefined);
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Founded Year */}
          <FormField
            control={form.control}
            name="foundedYear"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Founded Year *</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="Year founded"
                    {...field}
                    value={field.value || ""}
                    onChange={(e) => {
                      const value = e.target.value;
                      field.onChange(value ? parseInt(value, 10) : undefined);
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Headquarters */}
          <FormField
            control={form.control}
            name="headquarters"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Headquarters *</FormLabel>
                <FormControl>
                  <Input placeholder="Main office location" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Locations */}
          <FormField
            control={form.control}
            name="locations"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Office Locations *</FormLabel>
                <FormControl>
                  <MultiSelect
                    selected={field.value || []}
                    options={[]}
                    placeholder="Add locations (you can type and press enter)"
                    className="sm:w-[510px]"
                    onChange={(values) => field.onChange(values)}
                    creatable
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Core Technologies */}
          <FormField
            control={form.control}
            name="coreTechnologies"
            render={({ field }) => (
              <FormItem className="md:col-span-2">
                <FormLabel>Core Technologies *</FormLabel>
                <FormControl>
                  <MultiSelect
                    selected={field.value || []}
                    options={coreTechOptions}
                    placeholder="Select core technologies"
                    className="w-full"
                    onChange={(values) => field.onChange(values)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Website */}
          <FormField
            control={form.control}
            name="website"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Website</FormLabel>
                <FormControl>
                  <Input placeholder="https://example.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Contact Email */}
          <FormField
            control={form.control}
            name="contactEmail"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Contact Email</FormLabel>
                <FormControl>
                  <Input type="email" placeholder="contact@example.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Contact Phone */}
          <FormField
            control={form.control}
            name="contactPhone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Contact Phone</FormLabel>
                <FormControl>
                  <Input placeholder="+1-555-123-4567" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* LinkedIn */}
          <FormField
            control={form.control}
            name="linkedIn"
            render={({ field }) => (
              <FormItem>
                <FormLabel>LinkedIn</FormLabel>
                <FormControl>
                  <Input placeholder="https://linkedin.com/company/..." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Twitter */}
          <FormField
            control={form.control}
            name="twitter"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Twitter</FormLabel>
                <FormControl>
                  <Input placeholder="https://twitter.com/..." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Facebook */}
          <FormField
            control={form.control}
            name="facebook"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Facebook</FormLabel>
                <FormControl>
                  <Input placeholder="https://facebook.com/..." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Instagram */}
          <FormField
            control={form.control}
            name="instagram"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Instagram</FormLabel>
                <FormControl>
                  <Input placeholder="https://instagram.com/..." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? "Creating Company..." : "Create Company"}
        </Button>
      </form>
    </Form>
  );
}