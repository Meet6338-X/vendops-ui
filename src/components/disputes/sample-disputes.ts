export interface SampleDispute {
  id: string;
  label: string;
  description: string;
  message: string;
  sender: string;
  expectedDialect: "hi-latn" | "en" | "hi";
}

export const SAMPLE_DISPUTES: SampleDispute[] = [
  {
    id: "hinglish-short-delivery",
    label: "Hinglish Short Delivery",
    description: "50 units billed, 25 received on dock",
    message:
      "Bhai INV-20240103 ka payment abhi tak nahi aaya, PO-20240103 ke against 50 units deliver kar diye the, GRN-20240103 dock intake ho chuka hai. Please check karo.",
    sender: "billing@acmesupply.co.in",
    expectedDialect: "hi-latn",
  },
  {
    id: "english-payment-delay",
    label: "English Payment Delay",
    description: "Standard overdue payment inquiry",
    message:
      "Our invoice INV-20240101 under PO-20240101 is overdue. Payment was due last week.",
    sender: "ap@globalparts.com",
    expectedDialect: "en",
  },
  {
    id: "high-value-hitl",
    label: "High-Value ($120k) HITL",
    description: "Triggers human-in-the-loop review threshold",
    message:
      "Requesting immediate payment release for enterprise invoice INV-20240999 ($120,000) under PO-20240999.",
    sender: "cfo@turbinetech.com",
    expectedDialect: "en",
  },
  {
    id: "price-mismatch",
    label: "Price Mismatch",
    description: "$12,000 discrepancy against PO",
    message:
      "Discrepancy of $12,000 on INV-20240111 against PO-20240111.",
    sender: "finance@fastenerscorp.com",
    expectedDialect: "en",
  },
];

export function detectDialect(text: string): "hi" | "hi-latn" | "en" {
  if (!text || !text.trim()) return "en";
  // Devanagari Unicode range
  if (/[\u0900-\u097F]/.test(text)) {
    return "hi";
  }
  // Common Hinglish markers
  const hinglishMarkers = /\b(bhai|ka|ki|ke|ko|se|me|mein|par|pe|hai|hain|nahi|nahin|aaya|aayi|aaye|gaya|gayi|gaye|karo|karein|karna|karta|kar|diye|diya|chuka|chuki|chuke|tha|thi|the|hoga|hogi|hoge|kripya|aap|aapka|aapke|hum|humara|kya|kyun|kab|kaise|kitna|bohot|abhi|tak|baad|lekin|aur|yeh|ye|woh|wo)\b/i;
  if (hinglishMarkers.test(text)) {
    return "hi-latn";
  }
  return "en";
}
