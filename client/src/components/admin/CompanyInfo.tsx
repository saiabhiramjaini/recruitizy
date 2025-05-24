"use client";

import { Card, CardContent } from "@/components/ui/card";
import { useEffect, useState } from "react";
import { Company } from "@/utils/types";
import axios from "@/utils/axios";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import { Plus } from "lucide-react";
import { CompanyForm } from "./CompanyForm";

export function CompanyInfo() {
  const [company, setCompany] = useState<Company | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [openCompany, setOpenCompany] = useState(false);

  useEffect(() => {
    const fetchCompany = async () => {
      try {
        const response = await axios.get("/api/v1/admin/company");

        if (response.status === 200) {
          setCompany(response.data.company || null);
          setError(null);
        } else {
          setError("No company information available");
        }
      } catch (err: any) {
        if (err.response?.status === 400) {
          setError("No company information available");
        } else {
          setError(
            err instanceof Error ? err.message : "Failed to fetch company"
          );
        }
      } finally {
        setLoading(false);
      }
    };

    fetchCompany();
  }, []);

  const handleCompanyCreated = (newCompany: Company) => {
    setCompany(newCompany);
    setOpenCompany(false);
    setError(null);
  };

  const renderSocialLink = (url: string, label: string) => {
    if (!url) return null;
    return (
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="text-sm text-blue-600 hover:underline"
      >
        {label}
      </a>
    );
  };

  return (
    <Card className="bg-white rounded-xl shadow-sm border border-gray-100">
      <CardContent>
        <div className="space-y-4">
          {loading ? (
            <div className="animate-pulse space-y-4">
              <div className="h-6 bg-gray-200 rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              <div className="h-4 bg-gray-200 rounded w-full"></div>
              <div className="h-4 bg-gray-200 rounded w-2/3"></div>
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center py-8">
              <p className="text-gray-500 mb-4">{error}</p>
              <Dialog open={openCompany} onOpenChange={setOpenCompany}>
                <DialogTrigger asChild>
                  <Button
                    onClick={() => setOpenCompany(true)}
                    className="gap-2"
                  >
                    <Plus className="h-4 w-4" /> Create Company
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-lg bg-white overflow-y-auto max-h-[80vh]">
                  <DialogTitle>Create Company</DialogTitle>
                  <CompanyForm />
                </DialogContent>
              </Dialog>
            </div>
          ) : company ? (
            <>
              <div className="flex justify-between">
                <div>
                  <h3 className="text-lg font-medium text-gray-900">
                    {company.name}
                  </h3>
                  <p className="text-sm text-gray-500">{company.industry}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-500">
                    {company.companySize} employees
                  </p>
                  <p className="text-sm text-gray-500">
                    Founded in {company.foundedYear}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium text-gray-900">About</h4>
                  <p className="text-sm text-gray-600 mt-1">{company.about}</p>
                </div>

                <div>
                  <h4 className="font-medium text-gray-900">Headquarters</h4>
                  <p className="text-sm text-gray-600 mt-1">
                    {company.headquarters}
                  </p>
                </div>

                <div>
                  <h4 className="font-medium text-gray-900">Locations</h4>
                  <div className="text-sm text-gray-600 mt-1">
                    {company.locations?.join(", ") || "Not specified"}
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-gray-900">
                    Core Technologies
                  </h4>
                  <div className="text-sm text-gray-600 mt-1">
                    {company.coreTechnologies?.join(", ") || "Not specified"}
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-medium text-gray-900">Website</h4>
                {renderSocialLink(company.website, "Company Website")}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium text-gray-900">Contact</h4>
                  <div className="text-sm text-gray-600 mt-1 space-y-1">
                    {company.contactEmail && (
                      <p>Email: {company.contactEmail}</p>
                    )}
                    {company.contactPhone && (
                      <p>Phone: {company.contactPhone}</p>
                    )}
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-gray-900">Social Media</h4>
                  <div className="text-sm text-gray-600 mt-1 space-y-1">
                    {renderSocialLink(company.linkedIn, "LinkedIn")}
                    {renderSocialLink(company.twitter, "Twitter")}
                    {renderSocialLink(company.facebook, "Facebook")}
                    {renderSocialLink(company.instagram, "Instagram")}
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center py-8">
              <p className="text-gray-500 mb-4">
                No company information available
              </p>
              <Dialog open={openCompany} onOpenChange={setOpenCompany}>
                <DialogTrigger asChild>
                  <Button
                    onClick={() => setOpenCompany(true)}
                    className="gap-2"
                  >
                    <Plus className="h-4 w-4" /> Create Company
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-lg bg-white overflow-y-auto max-h-[80vh]">
                  <DialogTitle>Create Company</DialogTitle>
                  <CompanyForm />
                </DialogContent>
              </Dialog>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
