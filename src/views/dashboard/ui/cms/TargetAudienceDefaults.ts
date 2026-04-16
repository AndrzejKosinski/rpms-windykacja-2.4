import { ModalDefinition } from './WhyUsTypes';
import { TargetAudienceHeaderData, TargetAudienceIndustry, TargetAudienceCTAData } from './TargetAudienceTypes';

export const defaultHeader: TargetAudienceHeaderData = {
  title: "Płynność finansowa[br]nie jest [blue]przypadkiem[/blue]",
  description: "W Polsce sektor MŚP to serce gospodarki, ale też obszar najbardziej narażony na zatory. Nasze podejście to merytoryczne wsparcie dopasowane do Twojej branży."
};

export const defaultTargetAudienceModals: ModalDefinition[] = [
  {
    id: "modal_services",
    internalName: "Usługi i Konsulting",
    title: "Ochrona dla Usług i Konsultingu",
    subtitle: "Zabezpiecz swoje wynagrodzenie",
    icon: "Briefcase",
    benefit: "Skuteczna obrona przed wymówkami dłużników.",
    standard: "Przeprowadzamy audyt dowodowy i stosujemy twardą mediację.",
    points: [
      "Weryfikacja dowodowa wykonania usługi",
      "Mediacja przedsądowa",
      "Szybkie wezwania do zapłaty"
    ],
    imageUrl: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&q=80&w=600",
    isVisibleInCarousel: true,
    sectionType: 'target_audience'
  },
  {
    id: "modal_production",
    internalName: "Handel i Produkcja",
    title: "Ochrona Łańcucha Dostaw",
    subtitle: "Zabezpiecz płynność finansową",
    icon: "Factory",
    benefit: "Ochrona przed zatorami płatniczymi kontrahentów.",
    standard: "Wprowadzamy pieczęć prewencyjną i priorytetową ścieżkę egzekucji.",
    points: [
      "Pieczęć prewencyjna na fakturach",
      "Priorytetowa ścieżka egzekucji",
      "Monitoring płatności"
    ],
    imageUrl: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=600",
    isVisibleInCarousel: true,
    sectionType: 'target_audience'
  },
  {
    id: "modal_tsl",
    internalName: "Transport i Logistyka",
    title: "Koniec z kredytowaniem spedycji",
    subtitle: "Płynność w branży TSL",
    icon: "Truck",
    benefit: "Ochrona floty przed ryzykiem długich terminów płatności.",
    standard: "Stosujemy natychmiastowe wezwania z rygorem wpisu do rejestrów długów.",
    points: [
      "Natychmiastowe wezwania do zapłaty",
      "Wpis do rejestrów długów",
      "Windykacja należności transportowych"
    ],
    imageUrl: "https://images.unsplash.com/photo-1586528116311-ad8ed7c508b0?auto=format&fit=crop&q=80&w=600",
    isVisibleInCarousel: true,
    sectionType: 'target_audience'
  },
  {
    id: "modal_construction",
    internalName: "Budownictwo",
    title: "Odpowiedzialność Solidarna",
    subtitle: "Ochrona inwestycji budowlanych",
    icon: "HardHat",
    benefit: "Zabezpieczenie wynagrodzenia od głównego wykonawcy i inwestora.",
    standard: "Wykorzystujemy przepisy Kodeksu Cywilnego do pociągnięcia do odpowiedzialności Inwestora.",
    points: [
      "Egzekwowanie odpowiedzialności solidarnej",
      "Zabezpieczenie roszczeń na inwestycji",
      "Reprezentacja w sporach budowlanych"
    ],
    imageUrl: "https://images.unsplash.com/photo-1541888086425-d81bb19240f5?auto=format&fit=crop&q=80&w=600",
    isVisibleInCarousel: true,
    sectionType: 'target_audience'
  }
];

export const defaultIndustries: TargetAudienceIndustry[] = [
  {
    id: "services",
    icon: "Briefcase",
    title: "Usługi i Konsulting",
    subtitle: "Skuteczna obrona przed wymówkami",
    desc: "Dłużnik twierdzi, że usługa nie spełnia oczekiwań, by uniknąć zapłaty? Nasz zespół prawny przeprowadza audyt dowodowy i stosuje twardą mediację.",
    tag: "Weryfikacja Dowodowa",
    assignedModalId: "modal_services"
  },
  {
    id: "production",
    icon: "Factory",
    title: "Handel i Produkcja",
    subtitle: "Ochrona łańcucha dostaw",
    desc: "Przy dużych zamówieniach zator płatniczy jednego kontrahenta może pogrążyć Twoją firmę. Wprowadzamy pieczęć prewencyjną i priorytetową ścieżkę egzekucji.",
    tag: "Ochrona Kapitału",
    assignedModalId: "modal_production"
  },
  {
    id: "tsl",
    icon: "Truck",
    title: "Transport i Logistyka",
    subtitle: "Koniec z kredytowaniem spedycji",
    desc: "Terminy 60 lub 90 dni to w polskim TSL standard, ale przekraczanie ich to ryzyko dla Twojej floty. Stosujemy natychmiastowe wezwania z rygorem wpisu do rejestrów długów.",
    tag: "Płynność TSL",
    assignedModalId: "modal_tsl"
  },
  {
    id: "construction",
    icon: "HardHat",
    title: "Budownictwo",
    subtitle: "Odpowiedzialność solidarna",
    desc: "Główny wykonawca zwleka z zapłatą? Wykorzystujemy przepisy Kodeksu Cywilnego, aby pociągnąć do odpowiedzialności Inwestora. Zabezpieczamy Twoje wynagrodzenie.",
    tag: "Ochrona Inwestycji",
    assignedModalId: "modal_construction"
  }
];

export const defaultCTA: TargetAudienceCTAData = {
  title: "Potrzebujesz twardej ochrony prawnej?",
  description: "Nasi mecenasi specjalizują się w sporach gospodarczych o wysokim stopniu skomplikowania.",
  buttonText: "Konsultacja z mecenasem"
};

export const availableIcons = [
  'Briefcase', 'Factory', 'Truck', 'HardHat', 'ShieldCheck', 'AlertCircle', 'Zap', 'Scale', 'TrendingUp', 'Eye', 'MapPin', 'RefreshCw', 'Target', 'FileCheck', 'Mail', 'FileText', 'CheckCircle', 'Star', 'Award', 'HeartHandshake'
];
