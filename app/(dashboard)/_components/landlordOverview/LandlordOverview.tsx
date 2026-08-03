"use client";

import { motion } from "motion/react";
import {
  ArrowRight,
  Building2,
  HousePlus,
  MessageSquareMore,
  Sparkles,
  TrendingUp,
} from "lucide-react";

type LandlordOverviewStats = {
  totalProperties: number;
  totalActiveRequests: number;
};

type LandlordOverviewProps = {
  stats: LandlordOverviewStats;
};

function formatValue(value: number) {
  return new Intl.NumberFormat("en-US").format(value);
}

const LandlordOverview = ({ stats }: LandlordOverviewProps) => {
  const totalProperties = Number(stats?.totalProperties ?? 0);
  const totalActiveRequests = Number(stats?.totalActiveRequests ?? 0);
  const demandPulse =
    totalProperties > 0
      ? Math.min(100, Math.round((totalActiveRequests / totalProperties) * 100))
      : 0;

  const insightCards = [
    {
      label: "Total properties",
      value: formatValue(totalProperties),
      icon: Building2,
      accent: "from-primary/20 to-primary/5",
      description: "Listings you currently manage.",
    },
    {
      label: "Active requests",
      value: formatValue(totalActiveRequests),
      icon: MessageSquareMore,
      accent: "from-sky-500/20 to-sky-500/5",
      description: "Prospects currently interested in your rentals.",
    },
  ];

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
              Landlord overview
            </div>
            <div>
              <h1 className="font-heading text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
                Keep your rental portfolio moving forward
              </h1>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground sm:text-base">
                Monitor your listings and stay on top of the latest renter
                interest in one place.
              </p>
            </div>
          </div>

          <div className="rounded-2xl border border-border/60 bg-card/80 px-4 py-3 text-sm text-muted-foreground">
            <div className="flex items-center gap-2 font-medium text-foreground">
              <Sparkles className="size-4 text-primary" />
              {totalActiveRequests > 0
                ? "Momentum is building"
                : "Ready for new leads"}
            </div>
            <p className="mt-1">
              A quick view of your current portfolio health
            </p>
          </div>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {insightCards.map((card, index) => {
          const Icon = card.icon;

          return (
            <motion.div
              key={card.label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05, duration: 0.25 }}
              className={`rounded-3xl border border-border/70 bg-card/70 p-5 shadow-sm bg-linear-to-br ${card.accent}`}
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm text-muted-foreground">{card.label}</p>
                  <p className="mt-2 font-heading text-3xl font-semibold text-foreground">
                    {card.value}
                  </p>
                </div>
                <div className="flex size-12 items-center justify-center rounded-2xl bg-background/80 text-foreground">
                  <Icon className="size-5 text-primary" />
                </div>
              </div>
              <p className="mt-4 text-sm leading-6 text-muted-foreground">
                {card.description}
              </p>
            </motion.div>
          );
        })}
      </div>

      <div className="grid gap-4 lg:grid-cols-[1.3fr_0.9fr]">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.25 }}
          className="rounded-3xl border border-border/70 bg-card/70 p-5 shadow-sm"
        >
          <div className="flex items-center gap-2 text-sm font-medium text-foreground">
            <HousePlus className="size-4 text-primary" />
            Portfolio pulse
          </div>

          <div className="mt-5 rounded-2xl border border-border/60 bg-background/70 p-4">
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <span>Current interest level</span>
              <span className="font-medium text-foreground">
                {demandPulse}%
              </span>
            </div>
            <div className="mt-3 h-2.5 rounded-full bg-muted">
              <div
                className="h-2.5 rounded-full bg-linear-to-r from-primary to-sky-500"
                style={{ width: `${demandPulse}%` }}
              />
            </div>
            <p className="mt-3 text-sm leading-6 text-muted-foreground">
              {totalActiveRequests > 0
                ? `You currently have ${totalActiveRequests} active request${totalActiveRequests > 1 ? "s" : ""} for your properties.`
                : "There are no active requests right now, so this is a good moment to refresh your listings."}
            </p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.25 }}
          className="rounded-3xl border border-border/70 bg-card/70 p-5 shadow-sm"
        >
          <div className="flex items-center gap-2 text-sm font-medium text-foreground">
            <ArrowRight className="size-4 text-primary" />
            Suggested next step
          </div>

          <div className="mt-5 space-y-3">
            <div className="rounded-2xl border border-border/60 bg-background/70 p-4">
              <p className="text-sm font-medium text-foreground">
                Stay proactive
              </p>
              <p className="mt-1 text-sm leading-6 text-muted-foreground">
                Review the status of your current requests and keep your
                listings polished for new tenants.
              </p>
            </div>
            <div className="rounded-2xl border border-border/60 bg-background/70 p-4">
              <p className="text-sm font-medium text-foreground">
                Keep your portfolio visible
              </p>
              <p className="mt-1 text-sm leading-6 text-muted-foreground">
                Fresh images and updated descriptions can improve how quickly
                your properties attract attention.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default LandlordOverview;
