"use client";

import { motion } from "motion/react";
import { Quote, Star } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import type { Review } from "../../_action/actions";

type ReviewCardProps = {
  review: Review;
};

function getInitials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export default function ReviewCard({ review }: ReviewCardProps) {
  return (
    <motion.article
      whileHover={{ y: -6 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      className="group relative flex h-full w-full flex-col rounded-[28px] border border-border bg-card/80 p-6 shadow-sm backdrop-blur-sm"
    >
      <Quote className="size-8 text-primary/20" aria-hidden />

      <div className="mt-3 flex items-center gap-1" aria-hidden>
        {Array.from({ length: 5 }).map((_, index) => (
          <Star
            key={index}
            className={
              index < review.rating
                ? "size-4 fill-amber-400 text-amber-400"
                : "size-4 fill-muted text-muted"
            }
          />
        ))}
      </div>
      <span className="sr-only">Rated {review.rating} out of 5</span>

      <p className="mt-4 flex-1 text-sm leading-6 text-muted-foreground">
        &ldquo;{review.comment}&rdquo;
      </p>

      <div className="mt-6 flex items-center gap-3 border-t border-border/70 pt-4">
        <Avatar>
          <AvatarImage src={review.avatarUrl} alt={review.reviewerName} />
          <AvatarFallback>{getInitials(review.reviewerName)}</AvatarFallback>
        </Avatar>
        <div>
          <p className="text-sm font-semibold text-foreground">
            {review.reviewerName}
          </p>
          <p className="text-xs text-muted-foreground">
            {review.reviewerRole} · {review.location}
          </p>
        </div>
      </div>
    </motion.article>
  );
}
