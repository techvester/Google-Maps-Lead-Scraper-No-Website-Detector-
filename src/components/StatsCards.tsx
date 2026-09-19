import React from "react";
import { Lead } from "../types";
import { Users, PhoneCall, Globe, DollarSign } from "lucide-react";

interface StatsCardsProps {
  leads: Lead[];
}

export const StatsCards: React.FC<StatsCardsProps> = ({ leads }) => {
  if (leads.length === 0) return null;

  const withPhone = leads.filter((l) => l.phone && l.phone !== "Available on Google Maps").length;
  const avgRating = (
    leads.reduce((acc, curr) => acc + (curr.rating || 0), 0) /
    (leads.filter((l) => l.rating).length || 1)
  ).toFixed(1);

  // Typical web design deal size ($1,200/site)
  const potentialPipeline = leads.length * 1200;

  return (
    <div id="leads-stats-grid" className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-slate-500">Unclaimed / No Site</span>
          <div className="w-7 h-7 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center">
            <Globe className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-2 flex items-baseline gap-1.5">
          <span className="text-2xl font-bold text-slate-900">{leads.length}</span>
          <span className="text-xs text-rose-600 font-semibold">100% Leads</span>
        </div>
        <p className="text-[11px] text-slate-400 mt-0.5">Need a modern website</p>
      </div>

      <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-slate-500">Avg. Reputation</span>
          <div className="w-7 h-7 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
            <Users className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-2 flex items-baseline gap-1.5">
          <span className="text-2xl font-bold text-slate-900">{avgRating}★</span>
          <span className="text-xs text-emerald-600 font-semibold">High Trust</span>
        </div>
        <p className="text-[11px] text-slate-400 mt-0.5">Established client base</p>
      </div>

      <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-slate-500">Direct Phone Ready</span>
          <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <PhoneCall className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-2 flex items-baseline gap-1.5">
          <span className="text-2xl font-bold text-slate-900">{withPhone}</span>
          <span className="text-xs text-emerald-600 font-semibold">
            {Math.round((withPhone / leads.length) * 100)}%
          </span>
        </div>
        <p className="text-[11px] text-slate-400 mt-0.5">Ready for cold outreach</p>
      </div>

      <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-slate-500">Pipeline Potential</span>
          <div className="w-7 h-7 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
            <DollarSign className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-2 flex items-baseline gap-1.5">
          <span className="text-2xl font-bold text-slate-900">
            ${potentialPipeline.toLocaleString()}
          </span>
          <span className="text-xs text-indigo-600 font-semibold">Est. value</span>
        </div>
        <p className="text-[11px] text-slate-400 mt-0.5">@ $1.2k web design pitch</p>
      </div>
    </div>
  );
};
