import React, { useState, useEffect } from "react";
import { Loader2, MapPin, Search, Globe, CheckCircle2 } from "lucide-react";

interface LoadingScannerProps {
  niche: string;
  location: string;
}

export const LoadingScanner: React.FC<LoadingScannerProps> = ({ niche, location }) => {
  const [step, setStep] = useState(0);

  const steps = [
    { text: `Locating Google Maps business profiles in ${location}...`, icon: MapPin },
    { text: `Scanning local companies registered under "${niche}"...`, icon: Search },
    { text: "Inspecting digital footprint & filtering out businesses WITH active websites...", icon: Globe },
    { text: "Formatting verified phone numbers, ratings, and lead outreach pitches...", icon: CheckCircle2 },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setStep((prev) => (prev < steps.length - 1 ? prev + 1 : prev));
    }, 1200);
    return () => clearInterval(interval);
  }, [steps.length]);

  return (
    <div
      id="loading-scanner-container"
      className="bg-white rounded-2xl border border-slate-200/80 p-8 shadow-sm text-center max-w-lg mx-auto space-y-6"
    >
      <div className="relative w-16 h-16 mx-auto flex items-center justify-center">
        <div className="absolute inset-0 rounded-full border-4 border-emerald-100 border-t-emerald-600 animate-spin" />
        <Loader2 className="w-6 h-6 text-emerald-600 animate-pulse" />
      </div>

      <div className="space-y-1">
        <h3 className="text-base font-bold text-slate-900">Scraping Google Maps Directory</h3>
        <p className="text-xs text-slate-500">
          Target: <strong className="text-slate-700">{niche}</strong> in <strong className="text-slate-700">{location}</strong>
        </p>
      </div>

      {/* Progress steps */}
      <div className="space-y-2.5 text-left bg-slate-50 p-4 rounded-xl border border-slate-200/60">
        {steps.map((s, idx) => {
          const Icon = s.icon;
          const isDone = idx < step;
          const isCurrent = idx === step;
          return (
            <div
              key={idx}
              className={`flex items-center gap-3 text-xs transition-opacity duration-300 ${
                isCurrent
                  ? "text-emerald-800 font-semibold"
                  : isDone
                  ? "text-slate-400"
                  : "text-slate-300"
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 text-[10px] ${
                  isDone
                    ? "bg-emerald-100 text-emerald-700"
                    : isCurrent
                    ? "bg-emerald-600 text-white animate-pulse"
                    : "bg-slate-200 text-slate-500"
                }`}
              >
                {isDone ? "✓" : idx + 1}
              </div>
              <span className="truncate">{s.text}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
