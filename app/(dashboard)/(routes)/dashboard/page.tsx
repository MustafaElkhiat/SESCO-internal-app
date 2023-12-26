"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowUpRightFromCircle } from "lucide-react";

import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { tools } from "@/constants";
import { motion } from "framer-motion";
import LoadingAnimation from "../../../../components/LoadingAnimation"; // Adjust the path accordingly

export default function HomePage() {
  const router = useRouter();
  const [hoveredCard, setHoveredCard] = useState(null); // State to track hovered card
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulating some asynchronous operation (replace this with your actual logic)
    const timeout = setTimeout(() => {
      setLoading(false);
    }, 2000);

    // Clean up the timeout to avoid memory leaks
    return () => clearTimeout(timeout);
  }, []);

  return (
    <div className="transition-all">
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.7, ease: "easeInOut" }}
        className="mb-8 space-y-4"
      >
        <h2 className="text-3xl md:text-4xl font-bold text-center drop-shadow-lg">
          <span className="bg-gradient-to-b from-sky-300 via-sky-500 to-sky-900 bg-clip-text text-transparent">
            Navigate SESCO Services
          </span>
        </h2>

        <p className="text-muted-foreground font-light text-md md:text-lg text-center drop-shadow-md">
          Explore a Multitude of Services Designed Just for You!
        </p>
      </motion.div>

      {loading ? (
        <LoadingAnimation />
      ) : (
        <motion.div
          initial={{ opacity: 1, x: "-100%" }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: "100%" }}
          transition={{ duration: 0.5, ease: "easeInOut", delay: 0.7 }}
          className="mb-12 px-4 md:px-20 lg:px-32 space-y-4 grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8"
        >
          {tools.map((tool, index) => (
            <Card
              onClick={() => router.push(tool.href)}
              key={tool.href}
              className={`p-4 border-black/5 flex items-center mt-4 justify-between shadow-md hover:shadow-xl transition cursor-pointer rounded-2xl ${
                hoveredCard === tool.href ? " scale-105 md:scale-110" : ""
              } ${index === tools.length - 1 ? "sm:mb-8 md:mb-0" : ""}`}
              // Add a bottom margin to the last card on small screens
              style={{ height: "120px" }}
              onMouseEnter={() => setHoveredCard(tool.href)} // Set the hovered card
              onMouseLeave={() => setHoveredCard(null)} // Reset the hovered card
            >
              <div className={cn("p-2 w-fit rounded-md", tool.color)}>
                <tool.icon
                  className={cn(
                    "w-10 h-10 transition drop-shadow-md",
                    tool.color,
                    hoveredCard === tool.href
                      ? "scale-150 shadow-sm  transition-all duration-300"
                      : ""
                  )}
                />
              </div>
              <div className="font-semibold text-lg md:text-xl lg:text-xl drop-shadow-lg">
                {tool.label}
              </div>

              <ArrowUpRightFromCircle
                className={`w-5 h-5 opacity-50 ${
                  hoveredCard === tool.href
                    ? " rotate-45 transition-all scale-125 opacity-90"
                    : ""
                }`}
              />
            </Card>
          ))}
        </motion.div>
      )}
    </div>
  );
}
