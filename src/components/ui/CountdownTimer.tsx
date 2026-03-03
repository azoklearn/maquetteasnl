"use client";

import { useState, useEffect } from "react";
import { getTimeUntil } from "@/lib/utils";

interface CountdownTimerProps {
  date: string;
  time: string;
  className?: string;
}

interface TimeUnit {
  label: string;
  value: number;
}

export function CountdownTimer({ date, time, className = "" }: CountdownTimerProps) {
  const [countdown, setCountdown] = useState(getTimeUntil(date, time));

  useEffect(() => {
    const interval = setInterval(() => {
      setCountdown(getTimeUntil(date, time));
    }, 1000);
    return () => clearInterval(interval);
  }, [date, time]);

  if (countdown.isPast) {
    return (
      <div className={`text-center ${className}`}>
        <span className="text-asnl-red font-bold text-lg uppercase tracking-widest">Match en cours</span>
      </div>
    );
  }

  const units: TimeUnit[] = [
    { label: "Jours", value: countdown.days },
    { label: "Heures", value: countdown.hours },
    { label: "Minutes", value: countdown.minutes },
    { label: "Secondes", value: countdown.seconds },
  ];

  return (
    <div className={`flex items-center gap-2 sm:gap-4 ${className}`}>
      {units.map((unit, i) => (
        <div key={unit.label} className="flex items-center gap-2 sm:gap-4">
          <div className="text-center">
            <div
              className="bg-black/40 border border-white/10 rounded-lg px-3 py-2 sm:px-5 sm:py-3 min-w-[56px] sm:min-w-[72px]"
              style={{ fontFamily: "'Bebas Neue', sans-serif" }}
            >
              <span className="text-3xl sm:text-5xl text-white leading-none tabular-nums">
                {String(unit.value).padStart(2, "0")}
              </span>
            </div>
            <span className="text-[10px] sm:text-xs text-white/50 uppercase tracking-[0.2em] mt-1 block">
              {unit.label}
            </span>
          </div>
          {i < units.length - 1 && (
            <span
              className="text-2xl sm:text-4xl text-[#C8102E] font-bold leading-none mb-4"
              style={{ fontFamily: "'Bebas Neue', sans-serif" }}
            >
              :
            </span>
          )}
        </div>
      ))}
    </div>
  );
}
