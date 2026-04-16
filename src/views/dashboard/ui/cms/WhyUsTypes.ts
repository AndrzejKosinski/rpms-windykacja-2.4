export interface ModalDefinition {
  id: string;
  internalName: string;
  title: string;
  subtitle: string;
  icon: string;
  benefit: string;
  standard: string;
  points: string[];
  imageUrl: string;
  isVisibleInCarousel: boolean;
  sectionType?: 'why_us' | 'target_audience';
}

export interface WhyUsCard {
  id: string;
  icon: string;
  title: string;
  desc: string;
  assignedModalId?: string | null;
}

export interface WhyUsHeader {
  title: string;
  description: string;
}

export interface WhyUsData {
  header?: WhyUsHeader;
  cards: WhyUsCard[];
  modals?: ModalDefinition[];
}
