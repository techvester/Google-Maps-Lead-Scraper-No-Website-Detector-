import { Lead } from "../types";

export function generateCsvString(leads: Lead[]): string {
  const headers = [
    "Business Name",
    "Niche",
    "Location",
    "Phone",
    "Address",
    "Rating",
    "Reviews Count",
    "Website Status",
    "Google Maps URL",
    "Pitch Angle",
    "Scraped Date",
  ];

  const escapeCell = (val: string | number | null | undefined): string => {
    if (val === null || val === undefined) return '""';
    const str = String(val).replace(/"/g, '""');
    return `"${str}"`;
  };

  const rows = leads.map((lead) => [
    escapeCell(lead.name),
    escapeCell(lead.niche),
    escapeCell(lead.location),
    escapeCell(lead.phone),
    escapeCell(lead.address),
    escapeCell(lead.rating !== null ? lead.rating : ""),
    escapeCell(lead.reviewsCount !== null ? lead.reviewsCount : ""),
    escapeCell(lead.websiteStatus),
    escapeCell(lead.googleMapsUrl),
    escapeCell(lead.pitchAngle),
    escapeCell(lead.verifiedAt),
  ]);

  return [headers.map((h) => `"${h}"`).join(","), ...rows.map((r) => r.join(","))].join("\r\n");
}

export function downloadCsvFile(leads: Lead[], filenamePrefix = "google_maps_leads"): void {
  if (leads.length === 0) return;

  const csvContent = generateCsvString(leads);
  const blob = new Blob(["\uFEFF" + csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);

  const safePrefix = filenamePrefix
    .toLowerCase()
    .replace(/[^a-z0-9_-]/g, "_")
    .replace(/_+/g, "_");
  const dateStr = new Date().toISOString().slice(0, 10);
  const filename = `${safePrefix}_${dateStr}.csv`;

  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", filename);
  link.style.visibility = "hidden";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
