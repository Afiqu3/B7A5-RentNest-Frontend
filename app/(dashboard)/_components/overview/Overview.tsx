"use client";

import { motion } from "motion/react";
import {
  Activity,
  Building2,
  CheckCircle2,
  CircleDollarSign,
  ShieldCheck,
  TrendingUp,
  Users,
} from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

type OverviewStats = {
  totalUsers: number;
  totalActiveUsers: number;
  totalBlockedUsers: number;
  totalTenants: number;
  totalLandlords: number;
  totalProperties: number;
  totalRentedProperties: number;
  totalAvailableProperties: number;
  totalPendingRentalRequests: number;
  totalApprovedRentalRequests: number;
  totalRejectedRentalRequests: number;
  totalActiveRentalRequests: number;
  totalCompletedRentalRequests: number;
  totalRentalRequests: number;
};

type OverviewProps = {
  stats: OverviewStats;
};

const statCards = [
  {
    key: "totalUsers",
    label: "Total users",
    icon: Users,
    accent: "from-primary/20 to-primary/5",
  },
  {
    key: "totalActiveUsers",
    label: "Active users",
    icon: Activity,
    accent: "from-emerald-500/20 to-emerald-500/5",
  },
  {
    key: "totalBlockedUsers",
    label: "Blocked users",
    icon: ShieldCheck,
    accent: "from-rose-500/20 to-rose-500/5",
  },
  {
    key: "totalProperties",
    label: "Properties",
    icon: Building2,
    accent: "from-sky-500/20 to-sky-500/5",
  },
  {
    key: "totalAvailableProperties",
    label: "Available properties",
    icon: CheckCircle2,
    accent: "from-amber-500/20 to-amber-500/5",
  },
  {
    key: "totalRentalRequests",
    label: "Rental requests",
    icon: CircleDollarSign,
    accent: "from-violet-500/20 to-violet-500/5",
  },
] as const;

function formatValue(value: number) {
  return new Intl.NumberFormat("en-US").format(value);
}

const Overview = ({ stats }: OverviewProps) => {
  const userBreakdownData = [
    { name: "Tenants", value: stats.totalTenants },
    { name: "Landlords", value: stats.totalLandlords },
  ];

  const propertyBreakdownData = [
    { name: "Available", value: stats.totalAvailableProperties },
    { name: "Rented", value: stats.totalRentedProperties },
  ];

  const requestBreakdownData = [
    { name: "Pending", value: stats.totalPendingRentalRequests },
    { name: "Approved", value: stats.totalApprovedRentalRequests },
    { name: "Activate", value: stats.totalActiveRentalRequests },
    { name: "Rejected", value: stats.totalRejectedRentalRequests },
    { name: "Completed", value: stats.totalCompletedRentalRequests },
  ];

  const chartColors = ["#0f766e", "#2563eb", "#f59e0b", "#dc2626", "#008000"];

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className="space-y-6"
    >
      <div className="rounded-3xl border border-border/70 bg-linear-to-br from-primary/10 via-background to-background p-5 shadow-sm sm:p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="space-y-2">
            <div className="inline-flex w-fit items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
              <TrendingUp className="size-4" />
              Admin overview
            </div>
            <div>
              <h1 className="font-heading text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
                Platform performance summary
              </h1>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground sm:text-base">
                Track user activity, property health, and rental request
                progress at a glance.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {statCards.map((card, index) => {
          const Icon = card.icon;
          const value = stats[card.key as keyof OverviewStats];

          return (
            <motion.div
              key={card.key}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05, duration: 0.25 }}
              className={`rounded-3xl border border-border/70 bg-card/70 p-5 shadow-sm ${card.accent.includes("primary") ? "bg-linear-to-br" : ""}`}
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm text-muted-foreground">{card.label}</p>
                  <p className="mt-2 font-heading text-3xl font-semibold text-foreground">
                    {formatValue(Number(value))}
                  </p>
                </div>
                <div
                  className={`flex size-12 items-center justify-center rounded-2xl bg-linear-to-br ${card.accent} text-foreground`}
                >
                  <Icon className="size-5 text-primary" />
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.25 }}
          className="rounded-3xl border border-border/70 bg-card/70 p-5 shadow-sm"
        >
          <div className="flex items-center gap-2 text-sm font-medium text-foreground">
            <Users className="size-4 text-primary" />
            User breakdown
          </div>
          <div className="mt-4 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={userBreakdownData}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={3}
                >
                  {userBreakdownData.map((entry, index) => (
                    <Cell
                      key={entry.name}
                      fill={chartColors[index % chartColors.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25, duration: 0.25 }}
          className="rounded-3xl border border-border/70 bg-card/70 p-5 shadow-sm"
        >
          <div className="flex items-center gap-2 text-sm font-medium text-foreground">
            <Building2 className="size-4 text-primary" />
            Property health
          </div>
          <div className="mt-4 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={propertyBreakdownData}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={3}
                >
                  {propertyBreakdownData.map((entry, index) => (
                    <Cell
                      key={entry.name}
                      fill={chartColors[(index + 1) % chartColors.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.25 }}
        className="rounded-3xl border border-border/70 bg-card/70 p-5 shadow-sm"
      >
        <div className="flex items-center gap-2 text-sm font-medium text-foreground">
          <CircleDollarSign className="size-4 text-primary" />
          Rental request states
        </div>
        <div className="mt-4 h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={requestBreakdownData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="name" tickLine={false} axisLine={false} />
              <YAxis allowDecimals={false} tickLine={false} axisLine={false} />
              <Tooltip />
              <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                {requestBreakdownData.map((entry, index) => (
                  <Cell
                    key={entry.name}
                    fill={chartColors[index % chartColors.length]}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default Overview;
