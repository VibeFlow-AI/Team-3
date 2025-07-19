"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { BookOpen } from "lucide-react";

/**
 * HeroSection component featuring the main landing content with animated image carousel
 * @returns {JSX.Element} The hero section with content and carousel
 */
export default function HeroSection() {
  const [scrollPosition, setScrollPosition] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [hasReachedEnd, setHasReachedEnd] = useState(false);
  const carouselRef = useRef<HTMLDivElement>(null);

  // Image data organized by columns for the carousel
  const imageColumns = [
    // Column 1 images
    ["/images/1.jpg", "/images/2.jpg"],
    // Column 2 images (center - larger)
    ["/images/4.jpg", "/images/5.jpg"],
    // Column 3 images
    ["/images/6.jpg", "/images/7.jpg", "/images/3.jpg"],
  ];

  /**
   * Create scrollable rows for vertical infinite scroll effect
   * @returns {Array} Array of image rows for the carousel
   */
  const createScrollableRows = () => {
    const rows = [];
    const maxLength = Math.max(...imageColumns.map((col) => col.length));

    // Create multiple copies for infinite scroll effect
    for (let copy = 0; copy < 3; copy++) {
      for (let rowIndex = 0; rowIndex < maxLength; rowIndex++) {
        const row = [];
        imageColumns.forEach((column, colIndex) => {
          if (column[rowIndex % column.length]) {
            row.push({
              src: column[rowIndex % column.length],
              colIndex,
              key: `${copy}-${rowIndex}-${colIndex}`,
            });
          }
        });
        if (row.length > 0) rows.push(row);
      }
    }
    return rows;
  };

  const scrollableRows = createScrollableRows();

  /**
   * Auto-scroll effect for the image carousel
   */
  useEffect(() => {
    if (hasReachedEnd) return;

    const interval = setInterval(() => {
      if (!isPaused) {
        setScrollPosition((prev) => {
          const maxScroll = scrollableRows.length * 140 - 500; // Approximate max scroll
          if (prev >= maxScroll) {
            setHasReachedEnd(true);
            return prev;
          }
          return prev + 1;
        });
      }
    }, 50);

    return () => clearInterval(interval);
  }, [isPaused, hasReachedEnd, scrollableRows.length]);

  /**
   * Handle manual scroll interaction on the carousel
   * @param {React.WheelEvent} e - Wheel event from user interaction
   */
  const handleManualScroll = (e: React.WheelEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const delta = e.deltaY;
    const maxScroll = scrollableRows.length * 140 - 500;

    setScrollPosition((prev) => {
      const newPosition = Math.max(0, Math.min(maxScroll, prev + delta * 0.5));
      return newPosition;
    });
  };

  return (
    <div className="w-full h-full flex items-center">
      <div className="w-4/5 mx-auto flex items-center gap-12 relative z-10">
        {/* Left Column - Content */}
        <div className="flex-1 w-1/2 space-y-8">
          <div className="space-y-6">
            <h2 className="text-5xl lg:text-6xl font-semibold text-gray-900 leading-tight">
              Empowering Students with Personalized Mentorship{" "}
              <span className="inline-block">
                <BookOpen className="h-10 w-10 lg:h-12 lg:w-12 text-primary inline" />
              </span>
            </h2>

            <p className="text-2xl text-gray-600 leading-relaxed">
              EduVibe connects students with experienced mentors to guide them
              through their academic
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                size="lg"
                className="bg-primary hover:bg-primary/90 text-white px-8 py-4"
              >
                Get Started
              </Button>
            </div>
          </div>
        </div>

        {/* Right Column - Auto-scrolling 3 Column Carousel */}
        <div className="w-1/2 relative flex justify-end">
          <div
            ref={carouselRef}
            className="overflow-hidden h-[500px] lg:h-[650px] w-full max-w-lg relative cursor-grab active:cursor-grabbing z-0"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
            onWheel={handleManualScroll}
          >
            {/* Top fade overlay */}
            <div
              className="absolute top-0 left-0 right-0 h-16 z-10 pointer-events-none"
              style={{
                background: `linear-gradient(to bottom, #f4f4f4 0%, rgba(244, 244, 244, 0.8) 50%, rgba(244, 244, 244, 0) 100%)`,
              }}
            ></div>

            {/* Bottom fade overlay */}
            <div
              className="absolute bottom-0 left-0 right-0 h-16 z-10 pointer-events-none"
              style={{
                background: `linear-gradient(to top, #f4f4f4 0%, rgba(244, 244, 244, 0.8) 50%, rgba(244, 244, 244, 0) 100%)`,
              }}
            ></div>

            <div
              className="transition-transform duration-100 ease-linear"
              style={{
                transform: `translateY(-${scrollPosition}px)`,
              }}
            >
              {scrollableRows.map((row, rowIndex) => (
                <div
                  key={rowIndex}
                  className="flex justify-center items-start space-x-3 mb-8"
                >
                  {/* Column 1 */}
                  <div className="flex flex-col gap-3">
                    {row
                      .filter((item) => item.colIndex === 0)
                      .map((item) => (
                        <div
                          key={item.key}
                          className="w-36 h-56 rounded-full overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300"
                        >
                          <img
                            src={item.src}
                            alt="Student mentorship"
                            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                      ))}
                  </div>

                  {/* Column 2 - Center (Larger) */}
                  <div
                    className="flex flex-col gap-3"
                    style={{ marginTop: "20px" }}
                  >
                    {row
                      .filter((item) => item.colIndex === 1)
                      .map((item) => (
                        <div
                          key={item.key}
                          className="w-40 h-72 rounded-full overflow-hidden shadow-2xl hover:shadow-3xl transition-shadow duration-300 relative z-[5]"
                        >
                          <img
                            src={item.src}
                            alt="Student collaboration"
                            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                      ))}
                  </div>

                  {/* Column 3 */}
                  <div
                    className="flex flex-col gap-3"
                    style={{ marginTop: "10px" }}
                  >
                    {row
                      .filter((item) => item.colIndex === 2)
                      .map((item) => (
                        <div
                          key={item.key}
                          className="w-34 h-50 rounded-full overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300"
                        >
                          <img
                            src={item.src}
                            alt="Academic achievement"
                            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                      ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
