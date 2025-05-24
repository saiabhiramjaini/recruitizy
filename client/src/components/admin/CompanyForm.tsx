"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
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
import { useState } from "react";
import toast from "react-hot-toast";
import axios from "@/utils/axios";

// Company Form Schema
const companyFormSchema = z.object({
  name: z.string().min(3, "Company name must be at least 3 characters"),
  about: z.string().min(10, "About section must be at least 10 characters"),
  companySize: z.coerce.number().int().positive("Company size must be a positive integer"),
  locations: z.string().min(1, "At least one location is required"),
  headquarters: z.string().min(2, "Headquarters must be specified"),
  foundedYear: z.coerce.number().int().min(1800).max(new Date().getFullYear(), "Founded year cannot be in the future"),
  coreTechnologies: z.string().min(1, "At least one core technology is required"),
  industry: z.string().min(2, "Industry must be specified"),
  website: z.string().url("Website must be a valid URL"),
  linkedIn: z.string().url("LinkedIn must be a valid URL"),
  twitter: z.string().url("Twitter must be a valid URL").or(z.literal('')).nullish(),
  facebook: z.string().url("Facebook must be a valid URL").or(z.literal('')).nullish(),
  instagram: z.string().url("Instagram must be a valid URL").or(z.literal('')).nullish(),
  contactEmail: z.string().email("Contact email must be valid"),
  contactPhone: z.string().min(10, "Contact phone must be at least 10 characters"),
});

type CompanyFormValues = z.infer<typeof companyFormSchema>;

export function CompanyForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<CompanyFormValues>({
    resolver: zodResolver(companyFormSchema),
    defaultValues: {
      name: "",
      about: "",
      companySize: 0,
      locations: "",
      headquarters: "",
      foundedYear: 0,
      coreTechnologies: "",
      industry: "",
      website: "",
      linkedIn: "",
      twitter: "",
      facebook: "",
      instagram: "",
      contactEmail: "",
      contactPhone: "",
    },
  });

  const onSubmit = async (values: CompanyFormValues) => {
    setIsSubmitting(true);
    try {
      // Transform the data to match the API expectations
      const apiData = {
        ...values,
        locations: values.locations.split(',').map(item => item.trim()),
        coreTechnologies: values.coreTechnologies.split(',').map(item => item.trim()),
      };

      const response = await axios.post<{ msg: string; company: any }>(
        `/api/v1/admin/company`,
        apiData
      );

      if (response.status === 201) {
        toast.success(response.data.msg || "Company created successfully!");
        form.reset();
      } else {
        toast.error(response.data.msg || "Failed to create company");
      }
    } catch (error: any) {
      if (error.response?.data?.msg) {
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
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium text-gray-700">Company Name</FormLabel>
                <FormControl>
                  <Input placeholder="Company name" {...field} className="rounded-lg" />
                </FormControl>
                <FormMessage className="text-xs" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="industry"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium text-gray-700">Industry</FormLabel>
                <FormControl>
                  <Input placeholder="Industry" {...field} className="rounded-lg" />
                </FormControl>
                <FormMessage className="text-xs" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="about"
            render={({ field }) => (
              <FormItem className="md:col-span-2">
                <FormLabel className="text-sm font-medium text-gray-700">About</FormLabel>
                <FormControl>
                  <Textarea placeholder="Company description" {...field} className="rounded-lg" rows={4} />
                </FormControl>
                <FormMessage className="text-xs" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="companySize"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium text-gray-700">Company Size</FormLabel>
                <FormControl>
                  <Input type="number" placeholder="Number of employees" {...field} className="rounded-lg" />
                </FormControl>
                <FormMessage className="text-xs" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="foundedYear"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium text-gray-700">Founded Year</FormLabel>
                <FormControl>
                  <Input type="number" placeholder="Year founded" {...field} className="rounded-lg" />
                </FormControl>
                <FormMessage className="text-xs" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="headquarters"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium text-gray-700">Headquarters</FormLabel>
                <FormControl>
                  <Input placeholder="Headquarters location" {...field} className="rounded-lg" />
                </FormControl>
                <FormMessage className="text-xs" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="locations"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium text-gray-700">Locations (comma separated)</FormLabel>
                <FormControl>
                  <Input placeholder="San Francisco, New York, Berlin" {...field} className="rounded-lg" />
                </FormControl>
                <FormMessage className="text-xs" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="coreTechnologies"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium text-gray-700">Core Technologies (comma separated)</FormLabel>
                <FormControl>
                  <Input placeholder="AI, Cloud Computing, Machine Learning" {...field} className="rounded-lg" />
                </FormControl>
                <FormMessage className="text-xs" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="website"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium text-gray-700">Website</FormLabel>
                <FormControl>
                  <Input placeholder="https://example.com" {...field} className="rounded-lg" />
                </FormControl>
                <FormMessage className="text-xs" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="contactEmail"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium text-gray-700">Contact Email</FormLabel>
                <FormControl>
                  <Input type="email" placeholder="contact@example.com" {...field} className="rounded-lg" />
                </FormControl>
                <FormMessage className="text-xs" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="contactPhone"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium text-gray-700">Contact Phone</FormLabel>
                <FormControl>
                  <Input placeholder="+1234567890" {...field} className="rounded-lg" />
                </FormControl>
                <FormMessage className="text-xs" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="linkedIn"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium text-gray-700">LinkedIn URL</FormLabel>
                <FormControl>
                  <Input placeholder="https://linkedin.com/company/example" {...field} className="rounded-lg" />
                </FormControl>
                <FormMessage className="text-xs" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="twitter"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium text-gray-700">Twitter URL</FormLabel>
                <FormControl>
                  <Input placeholder="https://twitter.com/example" {...field} value={field.value || ''} className="rounded-lg" />
                </FormControl>
                <FormMessage className="text-xs" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="facebook"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium text-gray-700">Facebook URL</FormLabel>
                <FormControl>
                  <Input placeholder="https://facebook.com/example" {...field} value={field.value || ''} className="rounded-lg" />
                </FormControl>
                <FormMessage className="text-xs" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="instagram"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium text-gray-700">Instagram URL</FormLabel>
                <FormControl>
                  <Input placeholder="https://instagram.com/example" {...field} value={field.value || ''} className="rounded-lg" />
                </FormControl>
                <FormMessage className="text-xs" />
              </FormItem>
            )}
          />
        </div>

        <Button
          type="submit"
          className="w-full rounded-lg py-3 text-sm font-medium"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Creating company..." : "Create Company"}
        </Button>
      </form>
    </Form>
  );
}