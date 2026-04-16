import dynamic from 'next/dynamic';
import Hero from './ui/Hero';
import HeroAlt from './ui/HeroAlt';
import HeroAltV2 from './ui/HeroAltV2';
import TrustBar from './ui/TrustBar';
import TrustBarV2 from './ui/TrustBarV2';

// Dynamiczne ładowanie sekcji poniżej "folda" dla optymalizacji bundle size
const WhyUs = dynamic(() => import('./ui/WhyUs'), { ssr: true });
const WhyUsAlt = dynamic(() => import('./ui/WhyUsAlt'), { ssr: true });
const WhyUsV2 = dynamic(() => import('./ui/WhyUsV2'), { ssr: true });
const ProcessSteps = dynamic(() => import('./ui/ProcessSteps'), { ssr: true });
const ProcessStepsAlt = dynamic(() => import('./ui/ProcessStepsAlt'), { ssr: true });
const ProcessStepsV2 = dynamic(() => import('./ui/ProcessStepsV2'), { ssr: true });
const DashboardPreview = dynamic(() => import('./ui/DashboardPreview'), { ssr: true });
const TargetAudienceAlt = dynamic(() => import('./ui/TargetAudienceAlt'), { ssr: true });
const TargetAudienceV2 = dynamic(() => import('./ui/TargetAudienceV2'), { ssr: true });
const AiOperations = dynamic(() => import('./ui/AiOperations'), { ssr: true });
const AiOperationsAlt = dynamic(() => import('./ui/AiOperationsAlt'), { ssr: true });
const AiOperationsV2 = dynamic(() => import('./ui/AiOperationsV2'), { ssr: true });
const FaqAccordion = dynamic(() => import('./ui/FaqAccordion'), { ssr: true });
const LegalSupport = dynamic(() => import('./ui/LegalSupport'), { ssr: true });
const LegalSupportAlt = dynamic(() => import('./ui/LegalSupportAlt'), { ssr: true });
const Comparison = dynamic(() => import('./ui/Comparison'), { ssr: true });
const Pricing = dynamic(() => import('./ui/Pricing'), { ssr: true });
const FinalCTA = dynamic(() => import('./ui/FinalCTA'), { ssr: true });
const LeadForm = dynamic(() => import('./ui/LeadForm'), { ssr: true });
const RpmsGroupCards = dynamic(() => import('./ui/RpmsGroupCards'), { ssr: true });
const RpmsGroupStrip = dynamic(() => import('./ui/RpmsGroupStrip'), { ssr: true });
const RpmsGroupBento = dynamic(() => import('./ui/RpmsGroupBento'), { ssr: true });

export const ComponentRegistry: Record<string, any> = {
  'HERO_MODERN': Hero,
  'TRUST_BAR': TrustBar,
  'TRUST_BAR_v2': TrustBarV2,
  'HERO_ALT': HeroAlt,
  'HERO_ALT_v2': HeroAltV2,
  'HERO': Hero,
  'WHY_US_MODERN': WhyUs,
  'WHY_US_ALT': WhyUsAlt,
  'WHY_US_V2': WhyUsV2,
  'WHY_US': WhyUsV2,
  'PROCESS_STEPS_MODERN': ProcessSteps,
  'PROCESS_STEPS_ALT': ProcessStepsAlt,
  'PROCESS_STEPS_V2': ProcessStepsV2,
  'PROCESS': ProcessStepsV2,
  'DASHBOARD_PREVIEW_MODERN': DashboardPreview,
  'PANEL': DashboardPreview,
  'TARGET_AUDIENCE_MODERN': TargetAudienceV2,
  'TARGET_AUDIENCE_MODERN_V2': TargetAudienceV2,
  'TARGET_AUDIENCE_ALT': TargetAudienceAlt,
  'TARGET_AUDIENCE': TargetAudienceV2,
  'AI_OPERATIONS_MODERN': AiOperations,
  'AI_OPERATIONS_ALT': AiOperationsAlt,
  'AI_OPERATIONS_ALT_V2': AiOperationsV2,
  'AI_OPERATIONS': AiOperations,
  'LEGAL_SUPPORT_MODERN': LegalSupport,
  'LEGAL_SUPPORT_MODERN_1': LegalSupport,
  'LEGAL_SUPPORT_MODERN_2': AiOperations,
  'LEGAL_SUPPORT_ALT': LegalSupportAlt,
  'LEGAL_SUPPORT': LegalSupport,
  'COMPARISON_MODERN': Comparison,
  'COMPARISON': Comparison,
  'PRICING_MODERN': Pricing,
  'PRICING': Pricing,
  'FINAL_CTA_MODERN': FinalCTA,
  'FINAL_CTA': FinalCTA,
  'LEAD_FORM_MODERN': LeadForm,
  'LEAD_FORM': LeadForm,
  'FAQ_ACCORDION': FaqAccordion,
  'FAQ': FaqAccordion,
  'GROUP_CARDS': RpmsGroupCards,
  'GROUP_STRIP': RpmsGroupStrip,
  'GROUP_BENTO': RpmsGroupBento,
};
