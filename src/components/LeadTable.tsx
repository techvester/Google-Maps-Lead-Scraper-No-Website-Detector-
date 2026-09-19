import React, { useState } from "react";
import { Lead } from "../types";
import {
  Download,
  Copy,
  Check,
  ExternalLink,
  Phone,
  Star,
  MapPin,
  FileSpreadsheet,
  MessageSquareQuote,
  AlertCircle,
  Filter,
} from "lucide-react";
import { downloadCsvFile, generateCsvString } from "../utils/csv";

interface LeadTableProps {
  leads: Lead[];
  niche: string;
  location: string;
  onOpenPitch: (lead: Lead) => void;
}

export const LeadTable: React.FC<LeadTableProps> = ({
  leads,
  niche,
  location,
  onOpenPitch,
}) => {
  const [selectedIds, setSelectedIds] = useState<Set<string>>(
    () => new Set(leads.map((l) => l.id))
  );
  const [copiedPhoneId, setCopiedPhoneId] = useState<string | null>(null);
  const [copiedCsv, setCopiedCsv] = useState(false);
  const [filterQuery, setFilterQuery] = useState("");

  const handleToggleSelectAll = () => {
    if (selectedIds.size === leads.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(leads.map((l) => l.id)));
    }
  };

  const handleToggleSelect = (id: string) => {
    const next = new Set(selectedIds);
    if (next.has(id)) {
      next.delete(id);
    } else {
      next.add(id);
    }
    setSelectedIds(next);
  };

  const filteredLeads = leads.filter((lead) => {
    if (!filterQuery.trim()) return true;
    const q = filterQuery.toLowerCase();
    return (
      lead.name.toLowerCase().includes(q) ||
      lead.address.toLowerCase().includes(q) ||
      lead.phone.toLowerCase().includes(q) ||
      lead.pitchAngle.toLowerCase().includes(q)
    );
  });

  const selectedLeads = leads.filter((l) => selectedIds.has(l.id));

  const handleExportCsv = () => {
    const toExport = selectedLeads.length > 0 ? selectedLeads : leads;
    const prefix = `leads_no_website_${niche}_${location}`;
    downloadCsvFile(toExport, prefix);
  };

  const handleCopyCsv = async () => {
    const toExport = selectedLeads.length > 0 ? selectedLeads : leads;
    const csvStr = generateCsvString(toExport);
    try {
      await navigator.clipboard.writeText(csvStr);
      setCopiedCsv(true);
      setTimeout(() => setCopiedCsv(false), 2000);
    } catch (err) {
      console.error("Clipboard write error:", err);
    }
  };

  const handleCopyPhone = (leadId: string, phone: string) => {
    navigator.clipboard.writeText(phone);
    setCopiedPhoneId(leadId);
    setTimeout(() => setCopiedPhoneId(null), 2000);
  };

  return (
    <div id="leads-results-section" className="space-y-4">
      {/* Action Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
            <FileSpreadsheet className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <span>Scraped Qualified Leads</span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-semibold">
                {leads.length} Found
              </span>
            </h3>
            <p className="text-xs text-slate-500">
              Verified local listings in <strong>{location}</strong> ({niche}) with <strong>no active website</strong>
            </p>
          </div>
        </div>

        {/* Action buttons: Export CSV and Copy */}
        <div className="flex flex-wrap items-center gap-2.5">
          <div className="relative">
            <input
              type="text"
              value={filterQuery}
              onChange={(e) => setFilterQuery(e.target.value)}
              placeholder="Filter leads..."
              className="text-xs pl-8 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500 w-36 sm:w-44"
            />
            <Filter className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
          </div>

          <button
            type="button"
            id="btn-copy-csv"
            onClick={handleCopyCsv}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
            title="Copy CSV to clipboard"
          >
            {copiedCsv ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedCsv ? "Copied CSV" : "Copy CSV"}</span>
          </button>

          <button
            type="button"
            id="btn-export-csv"
            onClick={handleExportCsv}
            className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 rounded-lg shadow-xs hover:shadow transition-all cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>
              Export to CSV ({selectedLeads.length > 0 ? selectedLeads.length : leads.length})
            </span>
          </button>
        </div>
      </div>

      {/* Leads Table Container */}
      <div className="bg-white rounded-xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-600 font-semibold">
                <th className="py-3 px-4 w-10 text-center">
                  <input
                    type="checkbox"
                    checked={selectedIds.size === leads.length && leads.length > 0}
                    onChange={handleToggleSelectAll}
                    id="checkbox-select-all"
                    aria-label="Select all leads"
                    className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                  />
                </th>
                <th className="py-3 px-4 min-w-[200px]">Business & Reputation</th>
                <th className="py-3 px-4 min-w-[150px]">Contact Phone</th>
                <th className="py-3 px-4 min-w-[180px]">Location & Address</th>
                <th className="py-3 px-4 min-w-[130px]">Website Status</th>
                <th className="py-3 px-4 min-w-[240px]">Outreach Angle</th>
                <th className="py-3 px-4 text-right min-w-[140px]">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filteredLeads.map((lead) => {
                const isSelected = selectedIds.has(lead.id);
                return (
                  <tr
                    key={lead.id}
                    id={`lead-row-${lead.id}`}
                    className={`hover:bg-slate-50/60 transition-colors ${
                      isSelected ? "bg-emerald-50/20" : ""
                    }`}
                  >
                    {/* Checkbox */}
                    <td className="py-3.5 px-4 text-center">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => handleToggleSelect(lead.id)}
                        id={`checkbox-lead-${lead.id}`}
                        aria-label={`Select ${lead.name}`}
                        className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                      />
                    </td>

                    {/* Business Name & Rating */}
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-slate-900 text-sm leading-snug">
                        {lead.name}
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        {lead.rating ? (
                          <div className="flex items-center gap-1 text-amber-600 font-semibold text-xs">
                            <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                            <span>{lead.rating.toFixed(1)}</span>
                            {lead.reviewsCount && (
                              <span className="text-slate-400 font-normal">
                                ({lead.reviewsCount} reviews)
                              </span>
                            )}
                          </div>
                        ) : (
                          <span className="text-slate-400 text-[11px]">Unrated listing</span>
                        )}
                        <span className="text-[11px] px-1.5 py-0.5 rounded bg-slate-100 text-slate-600">
                          {lead.niche}
                        </span>
                      </div>
                    </td>

                    {/* Phone */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-1.5">
                        <a
                          href={`tel:${lead.phone.replace(/[^0-9+]/g, "")}`}
                          className="font-medium text-slate-800 hover:text-emerald-700 flex items-center gap-1"
                          title="Click to call"
                        >
                          <Phone className="w-3.5 h-3.5 text-slate-400 hover:text-emerald-600" />
                          <span>{lead.phone}</span>
                        </a>
                        <button
                          type="button"
                          onClick={() => handleCopyPhone(lead.id, lead.phone)}
                          id={`btn-copy-phone-${lead.id}`}
                          className="p-1 text-slate-400 hover:text-slate-700 rounded transition-colors"
                          title="Copy phone number"
                        >
                          {copiedPhoneId === lead.id ? (
                            <Check className="w-3 h-3 text-emerald-600" />
                          ) : (
                            <Copy className="w-3 h-3" />
                          )}
                        </button>
                      </div>
                    </td>

                    {/* Address */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-start gap-1 text-slate-600 leading-snug max-w-[200px]">
                        <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                        <span className="truncate" title={lead.address}>
                          {lead.address}
                        </span>
                      </div>
                    </td>

                    {/* Website Status */}
                    <td className="py-3.5 px-4">
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-rose-50 text-rose-700 border border-rose-200">
                        <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
                        {lead.websiteStatus || "No Website"}
                      </span>
                    </td>

                    {/* Pitch Angle */}
                    <td className="py-3.5 px-4">
                      <p className="text-slate-600 text-xs leading-relaxed line-clamp-2" title={lead.pitchAngle}>
                        {lead.pitchAngle}
                      </p>
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-right">
                      <div className="inline-flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => onOpenPitch(lead)}
                          id={`btn-pitch-${lead.id}`}
                          className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded-md transition-colors cursor-pointer"
                          title="View custom cold call/email pitch"
                        >
                          <MessageSquareQuote className="w-3 h-3" />
                          <span>Pitch</span>
                        </button>

                        <a
                          href={lead.googleMapsUrl}
                          target="_blank"
                          rel="noreferrer"
                          id={`btn-map-link-${lead.id}`}
                          className="p-1.5 text-slate-400 hover:text-slate-800 hover:bg-slate-100 rounded-md transition-colors"
                          title="View listing on Google Maps"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Table footer / status summary */}
        <div className="p-4 bg-slate-50/70 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <span>
              Showing {filteredLeads.length} of {leads.length} leads
            </span>
            {selectedIds.size > 0 && (
              <span className="font-semibold text-emerald-700">
                ({selectedIds.size} selected for export)
              </span>
            )}
          </div>

          <div className="flex items-center gap-4">
            <span className="inline-flex items-center gap-1 text-slate-600">
              <AlertCircle className="w-3.5 h-3.5 text-emerald-600" />
              All leads verified without dedicated web domains
            </span>
            <button
              type="button"
              id="btn-export-csv-footer"
              onClick={handleExportCsv}
              className="font-semibold text-emerald-700 hover:text-emerald-800 hover:underline cursor-pointer"
            >
              Download CSV file
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
