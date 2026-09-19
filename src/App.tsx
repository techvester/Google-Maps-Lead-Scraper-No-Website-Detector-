import React, { useState } from "react";
import { SearchForm } from "./components/SearchForm";
import { LeadTable } from "./components/LeadTable";
import { StatsCards } from "./components/StatsCards";
import { LoadingScanner } from "./components/LoadingScanner";
import { OutreachModal } from "./components/OutreachModal";
import { Lead, ScrapeResponse } from "./types";
import {
  MapPin,
  Download,
  AlertTriangle,
  Compass,
  ArrowRight,
} from "lucide-react";
import { downloadCsvFile } from "./utils/csv";

export default function App() {
  const [niche, setNiche] = useState("Roofing Contractor");
  const [location, setLocation] = useState("Austin, TX");
  const [isLoading, setIsLoading] = useState(false);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [lastSearched, setLastSearched] = useState<{ niche: string; location: string } | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [activePitchLead, setActivePitchLead] = useState<Lead | null>(null);
  const [systemNotice, setSystemNotice] = useState<string | null>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!niche.trim() || !location.trim()) return;

    setIsLoading(true);
    setErrorMsg(null);
    setSystemNotice(null);

    try {
      const response = await fetch("/api/scrape", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          niche: niche.trim(),
          location: location.trim(),
        }),
      });

      if (!response.ok) {
        throw new Error(`Server returned HTTP status ${response.status}`);
      }

      const data: ScrapeResponse = await response.json();
      if (data.success && data.leads) {
        setLeads(data.leads);
        setLastSearched({ niche: data.niche, location: data.location });
        if (data.message) {
          setSystemNotice(data.message);
        }
      } else {
        throw new Error(data.message || "Failed to find leads for this query.");
      }
    } catch (err: any) {
      console.error("Scrape error in client:", err);
      setErrorMsg(err.message || "Unable to scrape Google Maps right now. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans selection:bg-emerald-100 selection:text-emerald-900">
      {/* Top Navigation / App Bar */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-2xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-xs">
              <Compass className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-base font-bold text-slate-900 tracking-tight flex items-center gap-2">
                <span>Google Maps Lead Scraper</span>
                <span className="text-[11px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                  No-Website Detector
                </span>
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {leads.length > 0 && (
              <button
                type="button"
                id="btn-nav-export-csv"
                onClick={() =>
                  downloadCsvFile(
                    leads,
                    `google_maps_${lastSearched?.niche || "leads"}_${lastSearched?.location || "export"}`
                  )
                }
                className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-colors cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export CSV ({leads.length})</span>
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Hero & Guidance */}
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Find Local Businesses With <span className="text-emerald-700">No Website</span>
          </h2>
          <p className="text-sm text-slate-600 leading-relaxed">
            Scrape Google Maps listings that lack an official website to discover prime agency and freelance lead generation opportunities. Enter a niche and location below to export ready-to-pitch contacts.
          </p>
        </div>

        {/* The Two Search Fields Form (strictly strictly Business Niche and Location) */}
        <SearchForm
          niche={niche}
          setNiche={setNiche}
          location={location}
          setLocation={setLocation}
          onSubmit={handleSearch}
          isLoading={isLoading}
        />

        {/* System notice if any */}
        {systemNotice && (
          <div
            id="system-notice-banner"
            className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-800 flex items-center justify-between"
          >
            <span>{systemNotice}</span>
            <button
              onClick={() => setSystemNotice(null)}
              className="text-amber-600 hover:text-amber-900 font-bold ml-2 text-xs"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Error notification */}
        {errorMsg && (
          <div
            id="error-banner"
            className="p-4 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-800 flex items-start gap-3"
          >
            <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <strong className="font-semibold">Search Notice:</strong>
              <p>{errorMsg}</p>
            </div>
          </div>
        )}

        {/* Loading scanner animation */}
        {isLoading && <LoadingScanner niche={niche} location={location} />}

        {/* Results Area */}
        {!isLoading && leads.length > 0 && lastSearched && (
          <div className="space-y-6">
            {/* Stats */}
            <StatsCards leads={leads} />

            {/* Leads Table & Export */}
            <LeadTable
              leads={leads}
              niche={lastSearched.niche}
              location={lastSearched.location}
              onOpenPitch={(lead) => setActivePitchLead(lead)}
            />
          </div>
        )}

        {/* Empty State / Initial Guidance */}
        {!isLoading && leads.length === 0 && (
          <div
            id="empty-state-card"
            className="bg-white rounded-2xl border border-dashed border-slate-300 p-8 sm:p-12 text-center max-w-xl mx-auto space-y-4"
          >
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
              <MapPin className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h3 className="text-base font-bold text-slate-800">
                Ready to find high-intent web design leads?
              </h3>
              <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
                Businesses with Google Maps listings but no website get hundreds of calls and map views every month. Offering them a simple 1-page site has a 4x higher cold conversion rate.
              </p>
            </div>

            <div className="pt-2">
              <button
                type="button"
                id="btn-sample-search"
                onClick={handleSearch}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700 hover:text-emerald-800 hover:underline cursor-pointer"
              >
                <span>Scrape sample leads for Roofing in Austin, TX</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}
      </main>

      {/* Outreach Pitch Modal */}
      <OutreachModal
        lead={activePitchLead}
        onClose={() => setActivePitchLead(null)}
      />

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-6 mt-12 text-center text-xs text-slate-400">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>Google Maps Lead Scraper & Exporter • Lead generation engine for agencies & freelancers</span>
          <span>Targeted No-Website Discovery</span>
        </div>
      </footer>
    </div>
  );
}
