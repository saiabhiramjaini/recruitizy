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
import { useState } from "react";
import toast from "react-hot-toast";
import axios from "@/utils/axios";

// HR Form Schema
const hrFormSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters"),
  email: z.string().email("Invalid email format"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type HrFormValues = z.infer<typeof hrFormSchema>;

export function HrForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<HrFormValues>({
    resolver: zodResolver(hrFormSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: HrFormValues) => {
    setIsSubmitting(true);
    try {
      const response = await axios.post<{ msg: string; hr: any }>(
        `/api/v1/admin/hr`,
        values
      );

      if (response.status === 201) {
        toast.success(response.data.msg || "HR added successfully!");
        form.reset();
      } else {
        toast.error(response.data.msg || "Failed to add HR");
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
        <div className="space-y-4">
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium text-gray-700">Username</FormLabel>
                <FormControl>
                  <Input placeholder="Enter username" {...field} className="rounded-lg" />
                </FormControl>
                <FormMessage className="text-xs" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium text-gray-700">Email</FormLabel>
                <FormControl>
                  <Input type="email" placeholder="Enter email" {...field} className="rounded-lg" />
                </FormControl>
                <FormMessage className="text-xs" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium text-gray-700">Password</FormLabel>
                <FormControl>
                  <Input type="password" placeholder="Enter password" {...field} className="rounded-lg" />
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
          {isSubmitting ? "Adding HR..." : "Add HR"}
        </Button>
      </form>
    </Form>
  );
}