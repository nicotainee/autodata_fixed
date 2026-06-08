export interface Car {
  id: number;
  name: string;
  brand: string;
  model: string;
  type: 'Hatch' | 'SUV' | 'MPV' | 'Sedan' | 'EV';
  transmission: string;
  seats: number;
  fuel: 'Bensin' | 'Electric' | 'Hybrid' | 'Diesel';
  cc: number;
  power: number; // in horsepower (hp)
  torque: number; // in Nm
  drive: 'FWD' | 'RWD' | 'AWD' | '4WD';
  year: number;
  mileage: number;
  condition: 'new' | 'used';
  price_new: number;
  price_used: number;
  image: string;
  description?: string;
}

export interface PredictionResult {
  model: string;
  predicted_price: number;
  execution_time_ms: number;
  complexity: string;
  confidence: number; // percentage (e.g. 74 or 89)
  description: string;
  std_deviation?: number;
  n_trees?: number;
}

export interface PredictParams {
  brand: string;
  condition: 'new' | 'used';
  year: number;
  cc: number;
  power: number;
  seats: number;
  mileage: number;
  fuel: 'Bensin' | 'Electric' | 'Hybrid' | 'Diesel';
}

export interface GeminiAnalysis {
  expert_text: string;
  verdict: 'LAYAK_BELI' | 'PERTIMBANGKAN' | 'TIDAK_REKOMENDASI';
  estimated_fair_range: string;
  safety_rating: number; // out of 5
  fuel_efficiency_note: string;
  market_trend: string;
}

export interface FullPredictionResponse {
  lr: PredictionResult;
  rf: PredictionResult;
  gemini?: GeminiAnalysis;
}

export const FALLBACK_IMAGE = "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&q=80&w=600";

export function getProxiedImageUrl(originalUrl: string): string {
  if (!originalUrl) {
    return FALLBACK_IMAGE;
  }

  // Wikipedia/Wikimedia images: convert to thumbnail format which is publicly accessible
  // Format: /commons/thumb/{hash1}/{hash2}/{filename}/{width}px-{filename}
  if (originalUrl.includes("upload.wikimedia.org/wikipedia/commons/")) {
    const match = originalUrl.match(/\/commons\/([a-f0-9])\/([a-f0-9]{2})\/(.+)$/);
    if (match) {
      const [, h1, h2, filename] = match;
      return `https://upload.wikimedia.org/wikipedia/commons/thumb/${h1}/${h2}/${filename}/480px-${filename}`;
    }
  }

  // All other URLs: serve directly (browsers handle CORS fine with referrerPolicy="no-referrer")
  return originalUrl;
}

