import React from "react";
import { Search, MapPin, Briefcase, Loader2, Sparkles } from "lucide-react";

interface SearchFormProps {
  niche: string;
  setNiche: (val: string) => void;
  location: string;
  setLocation: (val: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  isLoading: boolean;
}

const POPULAR_NICHES = [
  "Roofing Contractor",
  "Plumbing Services",
  "Auto Repair & Detail",
  "Landscaping & Lawn",
  "Bakery & Deli",
  "HVAC & AC Repair",
];

const POPULAR_LOCATIONS = [
  "Austin, TX",
  "Miami, FL",
  "Phoenix, AZ",
  "Chicago, IL",
  "Denver, CO",
];

export const SearchForm: React.FC<SearchFormProps> = ({
  niche,
  setNiche,
  location,
  setLocation,
  onSubmit,
  isLoading,
}) => {
  return (
    <div id="search-form-card" className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6 md:p-8">
      <form onSubmit={onSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Field 1: Business Niche */}
          <div id="field-business-niche" className="space-y-2">
            <div className="flex items-center justify-between">
              <label
                htmlFor="niche-input"
                className="block text-sm font-semibold text-slate-800 tracking-tight flex items-center gap-1.5"
              >
                <Briefcase className="w-4 h-4 text-emerald-600" />
                Business Niche
              </label>
              <span className="text-xs text-slate-400 font-medium">Field 1 of 2</span>
            </div>
            <div className="relative">
              <input
                id="niche-input"
                type="text"
                value={niche}
                onChange={(e) => setNiche(e.target.value)}
                placeholder="e.g. Roofing, Plumber, Barber, Landscaping"
                required
                disabled={isLoading}
                className="w-full px-4 py-3 pl-11 text-slate-900 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all text-sm font-medium placeholder:text-slate-400 disabled:opacity-60"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>

            {/* Quick niche suggestions */}
            <div className="flex flex-wrap gap-1.5 pt-1">
              <span className="text-[11px] text-slate-400 self-center mr-1">Popular:</span>
              {POPULAR_NICHES.map((item) => (
                <button
                  key={item}
                  type="button"
                  id={`btn-niche-pill-${item.toLowerCase().replace(/[^a-z0-9]/g, "-")}`}
                  onClick={() => setNiche(item)}
                  disabled={isLoading}
                  className={`text-[11px] px-2.5 py-1 rounded-lg border transition-all ${
                    niche.toLowerCase() === item.toLowerCase()
                      ? "bg-emerald-50 border-emerald-300 text-emerald-700 font-semibold"
                      : "bg-slate-50/80 border-slate-200/60 text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                  }`}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>

          {/* Field 2: Location */}
          <div id="field-location" className="space-y-2">
            <div className="flex items-center justify-between">
              <label
                htmlFor="location-input"
                className="block text-sm font-semibold text-slate-800 tracking-tight flex items-center gap-1.5"
              >
                <MapPin className="w-4 h-4 text-emerald-600" />
                Location
              </label>
              <span className="text-xs text-slate-400 font-medium">Field 2 of 2</span>
            </div>
            <div className="relative">
              <input
                id="location-input"
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g. Austin, TX; Manchester, UK; Brooklyn, NY"
                required
                disabled={isLoading}
                className="w-full px-4 py-3 pl-11 text-slate-900 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all text-sm font-medium placeholder:text-slate-400 disabled:opacity-60"
              />
              <MapPin className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>

            {/* Quick location suggestions */}
            <div className="flex flex-wrap gap-1.5 pt-1">
              <span className="text-[11px] text-slate-400 self-center mr-1">Examples:</span>
              {POPULAR_LOCATIONS.map((loc) => (
                <button
                  key={loc}
                  type="button"
                  id={`btn-loc-pill-${loc.toLowerCase().replace(/[^a-z0-9]/g, "-")}`}
                  onClick={() => setLocation(loc)}
                  disabled={isLoading}
                  className={`text-[11px] px-2.5 py-1 rounded-lg border transition-all ${
                    location.toLowerCase() === loc.toLowerCase()
                      ? "bg-emerald-50 border-emerald-300 text-emerald-700 font-semibold"
                      : "bg-slate-50/80 border-slate-200/60 text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                  }`}
                >
                  {loc}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Submit Action */}
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-slate-100">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 font-bold text-[10px]">
              ✓
            </span>
            <span>Filters exclusively for businesses on Google Maps with <strong>no active website</strong></span>
          </div>

          <button
            type="submit"
            id="btn-submit-scrape"
            disabled={isLoading || !niche.trim() || !location.trim()}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-medium text-sm rounded-xl shadow-sm hover:shadow transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Scraping Google Maps...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Scrape Qualified Leads</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
