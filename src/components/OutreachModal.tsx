import React, { useState } from "react";
import { Lead } from "../types";
import { X, Copy, Check, Mail, Phone, ExternalLink, Sparkles } from "lucide-react";

interface OutreachModalProps {
  lead: Lead | null;
  onClose: () => void;
}

export const OutreachModal: React.FC<OutreachModalProps> = ({ lead, onClose }) => {
  const [copiedScript, setCopiedScript] = useState(false);
  const [copiedEmail, setCopiedEmail] = useState(false);

  if (!lead) return null;

  const coldCallScript = `Hi, is this the owner of ${lead.name}?

My name is [Your Name]. I came across your business listing on Google Maps while looking for ${lead.niche} services in ${lead.location}.

I saw you have great customer feedback (${lead.rating ? `${lead.rating} stars` : "positive local reputation"}${lead.reviewsCount ? ` from ${lead.reviewsCount} reviews` : ""}), but I noticed you don't currently have a dedicated website linked to your listing.

You're likely losing potential high-value clients every week to competitors who have a simple online booking site. We build high-converting 1-page websites for local ${lead.niche} businesses that turn Google Maps searchers into paying callers.

Would you be open to a quick 5-minute chat this Thursday to see what a modern site for ${lead.name} could look like?`;

  const coldEmailSubject = `Quick question regarding ${lead.name}'s Google Maps listing`;
  const coldEmailBody = `Hi team at ${lead.name},

I noticed your listing on Google Maps for ${lead.niche} in ${lead.location}. Congratulations on your strong customer ratings (${lead.rating ? `${lead.rating}★` : "strong reputation"} with ${lead.reviewsCount ? `${lead.reviewsCount} reviews` : "local clientele"}).

However, I noticed that you don't have an official website attached to your business profile. Right now, when local customers search for "${lead.niche} near me" on mobile or desktop, many click off to competitors who have instant contact forms or service pricing pages.

${lead.pitchAngle}

I've put together a few ideas on how a simple, affordable 1-page website could capture those lost inquiries for ${lead.name}.

Would you be opposed to seeing a free 3-minute mockup I made for you?

Best regards,
[Your Name]
[Your Phone Number]`;

  const copyToClipboard = async (text: string, type: "script" | "email") => {
    try {
      await navigator.clipboard.writeText(text);
      if (type === "script") {
        setCopiedScript(true);
        setTimeout(() => setCopiedScript(false), 2000);
      } else {
        setCopiedEmail(true);
        setTimeout(() => setCopiedEmail(false), 2000);
      }
    } catch (err) {
      console.error("Clipboard error:", err);
    }
  };

  return (
    <div
      id="outreach-modal-backdrop"
      className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        id="outreach-modal-content"
        className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200 p-6 space-y-5"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between border-b border-slate-100 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200">
                Lead Outreach Kit
              </span>
              <span className="text-xs text-rose-600 bg-rose-50 px-2 py-0.5 rounded-md border border-rose-200 font-medium">
                No Website
              </span>
            </div>
            <h3 className="text-xl font-bold text-slate-900 mt-1">{lead.name}</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              {lead.niche} • {lead.location} • Phone: {lead.phone}
            </p>
          </div>
          <button
            onClick={onClose}
            id="btn-close-outreach-modal"
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Lead Opportunity Summary */}
        <div className="p-3.5 bg-amber-50/70 border border-amber-200/80 rounded-xl flex items-start gap-3">
          <Sparkles className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div className="text-xs text-amber-900 leading-relaxed">
            <strong className="font-semibold block mb-0.5 text-amber-950">Pitch Angle Opportunity:</strong>
            {lead.pitchAngle}
          </div>
        </div>

        {/* Cold Call Pitch Script */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 text-emerald-600" />
              Phone Pitch / Cold Call Script
            </label>
            <button
              onClick={() => copyToClipboard(coldCallScript, "script")}
              id="btn-copy-call-script"
              className="inline-flex items-center gap-1 text-xs text-slate-600 hover:text-slate-900 font-medium px-2 py-1 bg-slate-100 hover:bg-slate-200 rounded-md transition-all cursor-pointer"
            >
              {copiedScript ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
              {copiedScript ? "Copied Script" : "Copy Script"}
            </button>
          </div>
          <pre className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 whitespace-pre-wrap font-sans leading-relaxed">
            {coldCallScript}
          </pre>
        </div>

        {/* Cold Email Pitch */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-emerald-600" />
              Cold Email / Direct Message Template
            </label>
            <button
              onClick={() => copyToClipboard(`Subject: ${coldEmailSubject}\n\n${coldEmailBody}`, "email")}
              id="btn-copy-email-template"
              className="inline-flex items-center gap-1 text-xs text-slate-600 hover:text-slate-900 font-medium px-2 py-1 bg-slate-100 hover:bg-slate-200 rounded-md transition-all cursor-pointer"
            >
              {copiedEmail ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
              {copiedEmail ? "Copied Email" : "Copy Email"}
            </button>
          </div>
          <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 space-y-2 font-sans">
            <div className="text-slate-500 pb-1 border-b border-slate-200">
              <span className="font-semibold text-slate-700">Subject:</span> {coldEmailSubject}
            </div>
            <p className="whitespace-pre-wrap leading-relaxed">{coldEmailBody}</p>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-100">
          <a
            href={lead.googleMapsUrl}
            target="_blank"
            rel="noreferrer"
            id="link-view-on-maps-modal"
            className="inline-flex items-center gap-1.5 text-xs text-slate-600 hover:text-emerald-700 font-medium"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            Verify on Google Maps
          </a>

          <button
            type="button"
            onClick={onClose}
            id="btn-done-modal"
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-medium rounded-lg transition-colors cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
