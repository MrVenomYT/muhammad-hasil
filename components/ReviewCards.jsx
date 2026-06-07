"use client";

import { useMemo } from "react";
import { Star } from "lucide-react";
import { usePortfolioData } from "./DataProvider";
import Reveal from "./Reveal";

export default function ReviewCards() {
  const { reviews } = usePortfolioData();
  const stars = useMemo(() => Array.from({ length: 5 }), []);

  return (
    <div className="grid gap-6 md:grid-cols-3">
      {reviews.map((review, index) => (
        <Reveal key={review.id} delay={index * 0.07}>
          <article className="elite-card magnetic-hover h-full rounded-3xl p-6 backdrop-blur-xl transition hover:-translate-y-1 hover:border-gold/35">
            <div className="mb-5 flex gap-1 text-gold">
              {stars.map((_, item) => (
                <Star key={item} className={`h-4 w-4 ${item < review.rating ? "fill-current" : "opacity-25"}`} />
              ))}
            </div>
            <p className="text-sm leading-7 text-paper/70">"{review.message}"</p>
            <div className="mt-6 border-t border-paper/10 pt-4">
              <h3 className="font-bold text-paper">{review.name}</h3>
              <p className="text-sm text-paper/45">{review.role}</p>
            </div>
          </article>
        </Reveal>
      ))}
    </div>
  );
}
