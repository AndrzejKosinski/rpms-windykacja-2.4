// Plik: src/config/fallbackLayout.ts
// UWAGA: Ten plik jest generowany automatycznie przez Panel Administratora RPMS CMS.
// Służy jako twardy fallback (układ awaryjny) w przypadku braku połączenia z chmurą.

export interface LayoutSection {
  id: string;
  component: string;
  visible: boolean;
}

export const FALLBACK_PAGE_LAYOUT: LayoutSection[] = [
  {
    "id": "hero",
    "component": "HERO_MODERN",
    "visible": true
  },
  {
    "id": "why_us",
    "component": "WHY_US_V2",
    "visible": true
  },
  {
    "id": "process",
    "component": "PROCESS_STEPS_V2",
    "visible": true
  },
  {
    "id": "panel",
    "component": "DASHBOARD_PREVIEW_MODERN",
    "visible": true
  },
  {
    "id": "target_audience",
    "component": "TARGET_AUDIENCE_MODERN",
    "visible": true
  },
  {
    "id": "ai_operations",
    "component": "AI_OPERATIONS_MODERN",
    "visible": true
  },
  {
    "id": "legal_support",
    "component": "LEGAL_SUPPORT_MODERN",
    "visible": true
  },
  {
    "id": "comparison",
    "component": "COMPARISON_MODERN",
    "visible": true
  },
  {
    "id": "pricing",
    "component": "PRICING_MODERN",
    "visible": true
  },
  {
    "id": "lead_form",
    "component": "LEAD_FORM_MODERN",
    "visible": true
  },
  {
    "id": "faq",
    "component": "FAQ_ACCORDION",
    "visible": true
  },
  {
    "id": "final_cta",
    "component": "FINAL_CTA_MODERN",
    "visible": true
  }
];
