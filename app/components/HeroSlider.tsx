"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

type HeroSlide = {
  image: string;
  label?: string;
  title?: string;
  italicTitle?: string;
  description?: string;
  buttonText?: string;
  buttonLink?: string;

  // Image positioning
  positionX?: number;
  positionY?: number;
  zoom?: number;
};

type HeroData = {
  slides?: HeroSlide[];
};

type HeroSliderProps = {
  hero?: HeroData | null;
};

export default function HeroSlider({
  hero,
}: HeroSliderProps) {
  const heroSlides: HeroSlide[] =
    hero?.slides?.length
      ? hero.slides
      : [
          {
            image: "/image/image_1.png",
            label: "NEW COLLECTION",
            title: "ELEGANCE",
            italicTitle: "IN EVERY STEP",
            description:
              "Timeless designs for life's most beautiful moments.",
            buttonText:
              "DISCOVER THE COLLECTION",
            buttonLink: "/shop",
          },
        ];

  const [current, setCurrent] = useState(0);

  // =====================================================
  // AUTO SLIDER
  // =====================================================

  useEffect(() => {
    if (heroSlides.length <= 1) {
      return;
    }

    const timer = setInterval(() => {
      setCurrent((prev) =>
        prev === heroSlides.length - 1
          ? 0
          : prev + 1
      );
    }, 4500);

    return () => clearInterval(timer);
  }, [heroSlides.length]);

  // =====================================================
  // SAFETY
  // =====================================================

  useEffect(() => {
    if (current >= heroSlides.length) {
      setCurrent(0);
    }
  }, [current, heroSlides.length]);

  const currentSlide = heroSlides[current];

  return (
    <section className="relative">
      <div className="relative min-h-[1000px] overflow-hidden bg-[#eadbd6] md:min-h-[1000px] lg:min-h-[1060px]">

        {/* =====================================================
            SLIDES
        ===================================================== */}

        {heroSlides.map((slide, index) => (
          <div
            key={`${slide.image}-${index}`}
            className={`absolute inset-0 transition-opacity duration-[1200ms] ease-in-out ${
              current === index
                ? "z-10 opacity-100"
                : "z-0 opacity-0"
            }`}
          >
            <Image
  src={slide.image}
  alt={
    slide.title
      ? `VIREL ${slide.title}`
      : `VIREL Bridal Collection ${index + 1}`
  }
  fill
  priority={index === 0}
  sizes="100vw"
  className="object-cover"
  style={{
    objectPosition: `${slide.positionX ?? 50}% ${
      slide.positionY ?? 50
    }%`,
    transform: `scale(${slide.zoom ?? 1})`,
  }}
/>
          </div>
        ))}

        {/* =====================================================
            SOFT OVERLAY
        ===================================================== */}

        <div className="absolute inset-0 z-20 bg-gradient-to-r from-[#f2e4df]/95 via-[#f2e4df]/55 to-transparent" />

        {/* =====================================================
            HERO CONTENT
        ===================================================== */}

        <div className="absolute inset-0 z-30 flex items-center">
          <div className="mx-auto w-full max-w-[1800px] px-7 sm:px-12 lg:px-20">
            <div className="max-w-[520px]">

              {/* LABEL */}

              <p className="text-[9px] tracking-[0.4em] text-[#967577]">
                {currentSlide?.label}
              </p>

              {/* TITLE */}

              <h1 className="mt-6 font-serif text-[52px] leading-[0.92] tracking-[-0.025em] sm:text-[68px] md:text-[78px] lg:text-[86px]">
                {currentSlide?.title}

                <br />

                <span className="italic">
                  {currentSlide?.italicTitle}
                </span>
              </h1>

              {/* DESCRIPTION */}

              <p className="mt-7 max-w-[360px] text-xs leading-6 text-[#625656] sm:text-sm">
                {currentSlide?.description}
              </p>

              {/* BUTTON */}

              <Link
                href={
                  currentSlide?.buttonLink ||
                  "/shop"
                }
                className="mt-8 inline-flex bg-[#211c1c] px-9 py-4 text-[9px] tracking-[0.23em] text-white transition hover:bg-[#4b3c3c]"
              >
                {currentSlide?.buttonText ||
                  "DISCOVER THE COLLECTION"}
              </Link>

            </div>
          </div>
        </div>

        {/* =====================================================
            PREVIOUS BUTTON
        ===================================================== */}

        {heroSlides.length > 1 && (
          <button
            type="button"
            aria-label="Previous slide"
            onClick={() =>
              setCurrent((prev) =>
                prev === 0
                  ? heroSlides.length - 1
                  : prev - 1
              )
            }
            className="absolute left-5 top-1/2 z-40 hidden -translate-y-1/2 text-4xl font-light text-white/80 transition hover:text-white md:block"
          >
            ‹
          </button>
        )}

        {/* =====================================================
            NEXT BUTTON
        ===================================================== */}

        {heroSlides.length > 1 && (
          <button
            type="button"
            aria-label="Next slide"
            onClick={() =>
              setCurrent((prev) =>
                prev === heroSlides.length - 1
                  ? 0
                  : prev + 1
              )
            }
            className="absolute right-5 top-1/2 z-40 hidden -translate-y-1/2 text-4xl font-light text-white/80 transition hover:text-white md:block"
          >
            ›
          </button>
        )}

        {/* =====================================================
            SLIDER DOTS
        ===================================================== */}

        {heroSlides.length > 1 && (
          <div className="absolute bottom-8 left-1/2 z-40 flex -translate-x-1/2 items-center gap-2">
            {heroSlides.map((_, index) => (
              <button
                key={index}
                type="button"
                aria-label={`Go to slide ${
                  index + 1
                }`}
                onClick={() =>
                  setCurrent(index)
                }
                className={`rounded-full transition-all duration-500 ${
                  current === index
                    ? "h-2 w-6 bg-[#211c1c]"
                    : "h-2 w-2 bg-white/75 hover:bg-white"
                }`}
              />
            ))}
          </div>
        )}

      </div>
    </section>
  );
}