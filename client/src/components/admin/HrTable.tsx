"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { useEffect, useState } from "react";
import { HR } from "@/utils/types";
import axios from "@/utils/axios";

export function HrTable() {
  const [hrs, setHrs] = useState<HR[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchHRs = async () => {
      try {
        const response = await axios.get("/api/v1/admin/hr");

        if (response.status !== 200) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = response.data;
        setHrs(data.hrs || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch HRs");
      } finally {
        setLoading(false);
      }
    };

    fetchHRs();
  }, []);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <Card className="bg-white rounded-xl shadow-sm border border-gray-100">
      <CardHeader>
        <h2 className="text-xl font-semibold text-gray-900">HR Accounts</h2>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Created At</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={3} className="text-center py-4">
                  <div className="animate-pulse space-y-2">
                    <div className="h-4 bg-gray-200 rounded"></div>
                  </div>
                </TableCell>
              </TableRow>
            ) : error ? (
              <TableRow>
                <TableCell colSpan={3} className="text-center text-red-500 py-4">
                  {error}
                </TableCell>
              </TableRow>
            ) : hrs.length === 0 ? (
              <TableRow>
                <TableCell colSpan={3} className="text-center text-gray-500 py-4">
                  No HR accounts found
                </TableCell>
              </TableRow>
            ) : (
              hrs.map((hr) => (
                <TableRow key={hr.id}>
                  <TableCell>{hr.username}</TableCell>
                  <TableCell>{hr.email}</TableCell>
                  <TableCell>{formatDate(hr.createdAt)}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
