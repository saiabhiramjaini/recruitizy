"use client";

import { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { motion } from "framer-motion";
import {
  Users,
  Briefcase,
  TrendingUp,
  Clock,
  CheckCircle,
  XCircle,
  Mail,
  Target,
  Award,
} from "lucide-react";

interface StatsData {
  _count: {
    id: number;
  };
  _avg: {
    threshold: number | null;
  };
  _sum: {
    numberOfPositions: number | null;
  };
}

interface JobStatusData {
  status: string;
  count: number;
}

interface CandidateStatusData {
  status: string;
  count: number;
}

const COLORS = [
  "hsl(var(--primary))",
  "hsl(var(--secondary))",
  "hsl(var(--accent))",
  "hsl(var(--muted))",
  "hsl(var(--destructive))",
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut",
    },
  },
};

const cardHoverVariants = {
  hover: {
    scale: 1.02,
    transition: {
      duration: 0.2,
      ease: "easeInOut",
    },
  },
};

export default function DashboardPage() {
  const [stats, setStats] = useState<StatsData | null>(null);
  const [jobStatusData, setJobStatusData] = useState<JobStatusData[]>([]);
  const [candidateStatusData, setCandidateStatusData] = useState<
    CandidateStatusData[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Mock data for demo purposes
  useEffect(() => {
    const mockStats: StatsData = {
      _count: { id: 12 },
      _avg: { threshold: 75.5 },
      _sum: { numberOfPositions: 45 },
    };

    const mockJobStatus: JobStatusData[] = [
      { status: "Active", count: 8 },
      { status: "Draft", count: 3 },
      { status: "Closed", count: 1 },
    ];

    const mockCandidateStatus: CandidateStatusData[] = [
      { status: "Applied", count: 156 },
      { status: "Shortlisted", count: 42 },
      { status: "Interviewed", count: 18 },
      { status: "Rejected", count: 89 },
      { status: "Hired", count: 7 },
    ];

    setTimeout(() => {
      setStats(mockStats);
      setJobStatusData(mockJobStatus);
      setCandidateStatusData(mockCandidateStatus);
      setLoading(false);
    }, 1000);
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[80vh]">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{
            duration: 1,
            repeat: Number.POSITIVE_INFINITY,
            ease: "linear",
          }}
          className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full"
        />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[80vh]">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <XCircle className="w-16 h-16 text-destructive mx-auto mb-4" />
          <p className="text-destructive text-lg">{error}</p>
        </motion.div>
      </div>
    );
  }

  const totalCandidates = candidateStatusData.reduce(
    (acc, curr) => acc + curr.count,
    0
  );
  const activeCandidates = candidateStatusData.reduce(
    (acc, curr) => acc + (curr.status !== "Rejected" ? curr.count : 0),
    0
  );

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="space-y-8"
    >
      {/* Header */}
      <motion.div variants={itemVariants} className="space-y-2">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
          HR Dashboard
        </h1>
        <p className="text-muted-foreground text-lg">
          Welcome back! Here's what's happening with your recruitment process.
        </p>
      </motion.div>

      {stats && (
        <>
          {/* Key Metrics */}
          <motion.div variants={itemVariants}>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <motion.div variants={cardHoverVariants} whileHover="hover">
                <Card className="relative overflow-hidden border-0 shadow-lg bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-blue-700 dark:text-blue-300">
                      Total Jobs Posted
                    </CardTitle>
                    <Briefcase className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-blue-900 dark:text-blue-100">
                      {stats._count.id}
                    </div>
                    <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">
                      +2 from last month
                    </p>
                  </CardContent>
                  <div className="absolute top-0 right-0 w-20 h-20 bg-blue-200 dark:bg-blue-800 rounded-full -mr-10 -mt-10 opacity-20" />
                </Card>
              </motion.div>

              <motion.div variants={cardHoverVariants} whileHover="hover">
                <Card className="relative overflow-hidden border-0 shadow-lg bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950 dark:to-green-900">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-green-700 dark:text-green-300">
                      Total Positions
                    </CardTitle>
                    <Target className="h-5 w-5 text-green-600 dark:text-green-400" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-green-900 dark:text-green-100">
                      {stats._sum.numberOfPositions || 0}
                    </div>
                    <p className="text-xs text-green-600 dark:text-green-400 mt-1">
                      Across all departments
                    </p>
                  </CardContent>
                  <div className="absolute top-0 right-0 w-20 h-20 bg-green-200 dark:bg-green-800 rounded-full -mr-10 -mt-10 opacity-20" />
                </Card>
              </motion.div>

              <motion.div variants={cardHoverVariants} whileHover="hover">
                <Card className="relative overflow-hidden border-0 shadow-lg bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950 dark:to-purple-900">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-purple-700 dark:text-purple-300">
                      Avg. Threshold Score
                    </CardTitle>
                    <Award className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-purple-900 dark:text-purple-100">
                      {stats._avg.threshold
                        ? stats._avg.threshold.toFixed(1)
                        : "N/A"}
                    </div>
                    <p className="text-xs text-purple-600 dark:text-purple-400 mt-1">
                      Quality benchmark
                    </p>
                  </CardContent>
                  <div className="absolute top-0 right-0 w-20 h-20 bg-purple-200 dark:bg-purple-800 rounded-full -mr-10 -mt-10 opacity-20" />
                </Card>
              </motion.div>

              <motion.div variants={cardHoverVariants} whileHover="hover">
                <Card className="relative overflow-hidden border-0 shadow-lg bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-950 dark:to-orange-900">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-orange-700 dark:text-orange-300">
                      Active Candidates
                    </CardTitle>
                    <Users className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-orange-900 dark:text-orange-100">
                      {activeCandidates}
                    </div>
                    <p className="text-xs text-orange-600 dark:text-orange-400 mt-1">
                      {((activeCandidates / totalCandidates) * 100).toFixed(1)}%
                      of total
                    </p>
                  </CardContent>
                  <div className="absolute top-0 right-0 w-20 h-20 bg-orange-200 dark:bg-orange-800 rounded-full -mr-10 -mt-10 opacity-20" />
                </Card>
              </motion.div>
            </div>
          </motion.div>

        </>
      )}
    </motion.div>
  );
}
