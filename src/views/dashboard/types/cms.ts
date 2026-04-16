export interface SEOData {
  title: string;
  description: string;
  keywords: string;
}

export interface Page {
  id: string;
  slug: string;
  title: string;
  content: string;
  seo: SEOData;
  isPublished: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface FooterLink {
  id: string;
  label: string;
  url: string;
  isExternal: boolean;
  pageId?: string;
}

export interface FooterColumn {
  id: string;
  title: string;
  links: FooterLink[];
}

export interface Footer {
  columns: FooterColumn[];
  socialMedia: {
    linkedin: string;
    facebook: string;
    [key: string]: string;
  };
  brandDescription?: string;
  copyrightText?: string;
  address?: string;
  bottomBarLinks?: FooterLink[];
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  image: string;
  imageAlt: string;
  category: string;
  publishedAt: string;
  date?: string;
  author: string;
  status: 'published' | 'draft';
  seo: SEOData;
  jsonLd?: unknown;
  faqs?: { question: string; answer: string }[];
  readTime?: string;
  imageUrl?: string;
}

export interface CompanyInfo {
  phone: string;
  email: string;
  address: string;
  socials: {
    linkedin?: string;
    facebook?: string;
    twitter?: string;
  };
  copyrightName?: string;
}

export interface CMSUpdateResponse {
  status: 'success' | 'error';
  message?: string;
}

export interface TrustBarLogo {
  name: string;
  logoUrl: string;
}

export interface TrustBar {
  logos: TrustBarLogo[];
}

export interface CMSContent {
  blog: BlogPost[];
  pages?: Page[];
  pageLayout?: any[];
  footer?: Footer;
  trustBar?: TrustBar;
  companyInfo?: CompanyInfo;
  targetAudience?: any;
  whyUs?: any;
  seo?: {
    blog?: SEOData;
    [key: string]: SEOData | undefined;
  };
  contactBar?: {
    isEnabled: boolean;
    showPhone: boolean;
    showEmail: boolean;
    phone?: string; // Optional now, should use companyInfo
    email?: string; // Optional now, should use companyInfo
  };
  settings?: {
    email?: any;
    emailTemplates?: any;
    [key: string]: any;
  };
  full_content?: CMSContent;
  [key: string]: unknown;
}

export interface SEOOptimizationResult {
  title: string;
  description: string;
  keywords: string;
  slug: string;
  imageAlt: string;
  excerpt: string;
  jsonLd: unknown;
  faqs: { question: string; answer: string }[];
}

export interface CMSManagerProps {
  content: CMSContent;
  onSave: (newContent: CMSContent) => void;
}
