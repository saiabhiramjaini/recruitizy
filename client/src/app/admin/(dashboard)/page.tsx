// src/app/admin/(dashboard)/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { format } from 'date-fns';
import { Skeleton } from '@/components/ui/skeleton';
import { Briefcase, User, Users2 } from 'lucide-react';
import axios from '@/utils/axios';

interface Stats {
  hrs: number;
  jobs: number;
  candidates: number;
}

interface RecentJob {
  id: string;
  title: string;
  type: string;
  status: string;
  createdAt: string;
  _count: {
    candidates: number;
  };
}

interface RecentCandidate {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  status: string;
  createdAt: string;
  job: {
    title: string;
  };
}

export default function DashboardPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [recentJobs, setRecentJobs] = useState<RecentJob[]>([]);
  const [recentCandidates, setRecentCandidates] = useState<RecentCandidate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const response = await axios.get('/api/v1/admin/stats');
        setStats(response.data.stats);
        setRecentJobs(response.data.recentJobs);
        setRecentCandidates(response.data.recentCandidates);
      } catch (err) {
        console.error('Failed to fetch stats:', err);
        setError('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return 'default';
      case 'PENDING':
        return 'secondary';
      case 'CLOSED':
        return 'destructive';
      default:
        return 'outline';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Dashboard Overview</h1>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        {loading ? (
          <>
            <Skeleton className="h-[120px] w-full rounded-xl" />
            <Skeleton className="h-[120px] w-full rounded-xl" />
            <Skeleton className="h-[120px] w-full rounded-xl" />
          </>
        ) : (
          <>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">
                  HR Managers
                </CardTitle>
                <User/>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats?.hrs || 0}</div>
                <p className="text-xs text-muted-foreground">
                  Total HR managers
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">
                  Active Jobs
                </CardTitle>
                <Briefcase/>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats?.jobs || 0}</div>
                <p className="text-xs text-muted-foreground">
                  Currently active jobs
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">
                  Candidates
                </CardTitle>
                <Users2/>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {stats?.candidates || 0}
                </div>
                <p className="text-xs text-muted-foreground">
                  Total candidates
                </p>
              </CardContent>
            </Card>
          </>
        )}
      </div>

      {/* Recent Jobs */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Job Postings</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-4">
              <Skeleton className="h-[40px] w-full" />
              <Skeleton className="h-[40px] w-full" />
              <Skeleton className="h-[40px] w-full" />
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Candidates</TableHead>
                  <TableHead>Posted</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentJobs.length > 0 ? (
                  recentJobs.map((job) => (
                    <TableRow key={job.id}>
                      <TableCell className="font-medium">{job.title}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{job.type}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={getStatusBadgeVariant(job.status)}>
                          {job.status}
                        </Badge>
                      </TableCell>
                      <TableCell>{job._count.candidates}</TableCell>
                      <TableCell>
                        {format(new Date(job.createdAt), 'MMM dd, yyyy')}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center">
                      No recent jobs found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Recent Candidates */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Candidates</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-4">
              <Skeleton className="h-[40px] w-full" />
              <Skeleton className="h-[40px] w-full" />
              <Skeleton className="h-[40px] w-full" />
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Candidate</TableHead>
                  <TableHead>Job</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Applied</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentCandidates.length > 0 ? (
                  recentCandidates.map((candidate) => (
                    <TableRow key={candidate.id}>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Avatar>
                            <AvatarFallback>
                              {candidate.firstName.charAt(0)}
                              {candidate.lastName.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p>
                              {candidate.firstName} {candidate.lastName}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {candidate.email}
                            </p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{candidate.job?.title || 'N/A'}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{candidate.status}</Badge>
                      </TableCell>
                      <TableCell>
                        {format(new Date(candidate.createdAt), 'MMM dd, yyyy')}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center">
                      No recent candidates found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}