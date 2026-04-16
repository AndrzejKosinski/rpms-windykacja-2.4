export interface TargetAudienceIndustry {
  id: string;
  icon: string;
  title: string;
  subtitle: string;
  desc: string;
  tag: string;
  assignedModalId?: string;
}

export interface TargetAudienceHeaderData {
  title: string;
  description: string;
}

export interface TargetAudienceCTAData {
  title: string;
  description: string;
  buttonText: string;
}

export interface TargetAudienceData {
  header?: TargetAudienceHeaderData;
  industries?: TargetAudienceIndustry[];
  cta?: TargetAudienceCTAData;
  modals?: import('./WhyUsTypes').ModalDefinition[];
}
