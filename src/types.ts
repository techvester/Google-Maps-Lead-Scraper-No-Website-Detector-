export interface Lead {
  id: string;
  name: string;
  niche: string;
  location: string;
  phone: string;
  address: string;
  rating: number | null;
  reviewsCount: number | null;
  websiteStatus: string;
  googleMapsUrl: string;
  pitchAngle: string;
  verifiedAt: string;
}

export interface ScrapeRequest {
  niche: string;
  location: string;
}

export interface ScrapeResponse {
  success: boolean;
  leads: Lead[];
  totalFound: number;
  niche: string;
  location: string;
  sources?: Array<{ title?: string; uri?: string }>;
  searchQueries?: string[];
  message?: string;
}
