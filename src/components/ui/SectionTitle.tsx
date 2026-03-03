"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface SectionTitleProps {
  label?: string;
  title: string;
  subtitle?: string;
  align?: "left" | "center" | "right";
  className?: string;
  light?: boolean;
}

export function SectionTitle({
  label,
  title,
  subtitle,
  align = "left",
  className,
  light = false,
}: SectionTitleProps) {
  const alignClasses = {
    left: "text-left items-start",
    center: "text-center items-center",
    right: "text-right items-end",
  };

  return (
    <motion.div
      className={cn("flex flex-col gap-3", alignClasses[align], className)}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
    >
      {label && (
        <span className="text-[#fd0000] text-xs font-semibold uppercase tracking-[0.25em]">
          {label}
        </span>
      )}
      <h2
        className={cn(
          "text-4xl md:text-6xl font-black uppercase leading-none tracking-tight",
          light ? "text-white" : "text-white",
        )}
        style={{ fontFamily: "'Bebas Neue', sans-serif" }}
      >
        {title}
      </h2>
      {subtitle && (
        <p className={cn("text-sm md:text-base max-w-2xl", light ? "text-white/60" : "text-white/50")}>
          {subtitle}
        </p>
      )}
    </motion.div>
  );
}
