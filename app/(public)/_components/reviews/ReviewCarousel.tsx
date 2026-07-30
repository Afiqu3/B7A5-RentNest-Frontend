"use client";

import { motion } from "motion/react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation, Pagination } from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

import type { Review } from "../../_action/actions";
import ReviewCard from "./ReviewCard";

type ReviewCarouselProps = {
  reviews: Review[];
};

export default function ReviewCarousel({ reviews }: ReviewCarouselProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="reviews-swiper-shell relative"
      style={
        {
          "--swiper-theme-color": "var(--primary)",
          "--swiper-pagination-color": "var(--primary)",
          "--swiper-pagination-bullet-inactive-color": "var(--muted-foreground)",
          "--swiper-pagination-bullet-inactive-opacity": "0.35",
          "--swiper-navigation-size": "22px",
        } as React.CSSProperties
      }
    >
      <Swiper
        modules={[Autoplay, Navigation, Pagination]}
        spaceBetween={24}
        slidesPerView={1}
        grabCursor
        loop={reviews.length > 3}
        autoplay={{
          delay: 1000,
          disableOnInteraction: false,
          // pauseOnMouseEnter: true,
        }}
        speed={650}
        // pagination={{ clickable: true }}
        // navigation
        breakpoints={{
          768: { slidesPerView: 2 },
          1280: { slidesPerView: 3 },
        }}
        className="px-1! pb-14!"
      >
        {reviews.map((review) => (
          <SwiperSlide key={review.id} className="h-auto!">
            <div className="h-full py-2">
              <ReviewCard review={review} />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </motion.div>
  );
}
