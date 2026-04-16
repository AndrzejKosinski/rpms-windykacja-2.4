import { WhyUsHeader, ModalDefinition, WhyUsCard } from './WhyUsTypes';

export const defaultHeader: WhyUsHeader = {
  title: "Dlaczego firmy wybierają nas, [br][blue]gdy liczy się efekt[/blue]",
  description: "Zapewniamy wsparcie, które łączy dynamikę biznesową z najwyższym standardem obsługi prawnej."
};

export const defaultModals: ModalDefinition[] = [
  {
    id: 'speed',
    internalName: 'Płynność finansowa',
    title: "Płynność finansowa",
    subtitle: "Działanie natychmiastowe",
    icon: "Zap",
    benefit: "Działamy natychmiast po zgłoszeniu sprawy, zatrzymując proces starzenia się długu. Już na etapie przedsądowym wysyłamy wezwanie do zapłaty opatrzone pieczęcią Kancelarii, co stanowi najszybszy i najmniej kosztowny sposób dochodzenia należności.",
    standard: "Reakcja operacyjna: 15 minut.",
    points: ["Natychmiastowe zatrzymanie przedawnienia", "Priorytetowa ścieżka płatności", "Weryfikacja strategii w czasie rzeczywistym"],
    imageUrl: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&q=80&w=600",
    isVisibleInCarousel: true,
    sectionType: 'why_us'
  },
  {
    id: 'efficiency',
    internalName: 'Nieuchronność spłaty',
    title: "Nieuchronność spłaty",
    subtitle: "Skuteczny wpływ",
    icon: "CheckCircle2",
    benefit: "Przekładamy procedury na realny wpływ – od analizy sprawy po egzekucję komorniczą. Dzięki kompleksowemu podejściu i obecności na każdym etapie postępowania zwiększamy nieuchronność spłaty Twoich środków.",
    standard: "92% skuteczności w sprawach B2B.",
    points: ["Autorytet Kancelarii od 1. dnia", "Scenariusze oparte na faktach", "Precyzyjne uderzenie w zatory"],
    imageUrl: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&q=80&w=600",
    isVisibleInCarousel: true,
    sectionType: 'why_us'
  },
  {
    id: 'shield',
    internalName: 'Pieczęć Kancelarii',
    title: "Pieczęć Kancelarii",
    subtitle: "Psychologia nacisku",
    icon: "ShieldAlert",
    benefit: "Wezwania do zapłaty są wysyłane na firmowym papierze, podpisane przez radcę prawnego lub adwokata, co nadaje sprawie autorytet prawny już od pierwszego kontaktu z dłużnikiem. To zwiększa priorytet spłaty i skuteczność negocjacji.",
    standard: "Pieczęć prewencyjna od pierwszej minuty.",
    points: ["Oficjalna autoryzacja prawna", "Sygnał o gotowości procesowej", "Drastyczny wzrost wpłat polubownych"],
    imageUrl: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&q=80&w=600",
    isVisibleInCarousel: true,
    sectionType: 'why_us'
  },
  {
    id: 'audit',
    internalName: 'Audyt Dowodowy',
    title: "Audyt Dowodowy",
    subtitle: "Pancerna dokumentacja",
    icon: "FileSearch",
    benefit: "Weryfikujemy dokumentację pod kątem braków formalnych, co pozwala zbudować niepodważalną pozycję w sądzie. Dzięki temu minimalizujemy ryzyko oddalenia roszczenia i zwiększamy szanse na szybkie uzyskanie wyroku.",
    standard: "100% weryfikacja zgodności z KPC.",
    points: ["Sprawdzenie protokołów odbioru", "Wzmocnienie materiału dowodowego", "Gotowość do pozwu w 24h"],
    imageUrl: "https://images.unsplash.com/photo-1454165833767-027ffea9e77b?auto=format&fit=crop&q=80&w=600",
    isVisibleInCarousel: true,
    sectionType: 'why_us'
  },
  {
    id: 'legal',
    internalName: 'Bezpieczeństwo prawne',
    title: "Bezpieczeństwo prawne",
    subtitle: "Pełne odciążenie",
    icon: "Scale",
    benefit: "Przejmujemy pełną odpowiedzialność za proces windykacyjny – od analizy sprawy, przez działania sądowe, aż po egzekucję. Działamy jako Twój dział prawny, zapewniając bieżące doradztwo i reprezentację na każdym etapie.",
    standard: "Pełna reprezentacja przed EPU i sądami.",
    points: ["Dedykowany radca prawny", "Bezpieczeństwo procesowe", "Aktywny nadzór komorniczy"],
    imageUrl: "https://images.unsplash.com/photo-1505664194779-8beaceb93744?auto=format&fit=crop&q=80&w=600",
    isVisibleInCarousel: true,
    sectionType: 'why_us'
  },
  {
    id: 'monitoring',
    internalName: 'Monitoring Majątku',
    title: "Monitoring Majątku",
    subtitle: "Precyzyjne uderzenie",
    icon: "SearchCode",
    benefit: "Wskazujemy komornikowi konkretne składniki majątku dłużnika, w tym aktywa ukryte lub nieujawnione. Dzięki temu egzekucja jest szybsza i bardziej skuteczna, a wierzyciel zyskuje realną szansę na odzyskanie środków.",
    standard: "Lokalizacja aktywów in trybie proaktywnym.",
    points: ["Wykrywanie ukrytych nieruchomości", "Analiza powiązań kapitałowych", "Wskazanie mienia komornikowi"],
    imageUrl: "https://images.unsplash.com/photo-1553877522-43269d4ea984?auto=format&fit=crop&q=80&w=600",
    isVisibleInCarousel: true,
    sectionType: 'why_us'
  },
  {
    id: 'transparency',
    internalName: 'Kontrola strategiczna',
    title: "Kontrola strategiczna",
    subtitle: "Przejrzystość 24/7",
    icon: "Clock",
    benefit: "Zapewniamy pełną przejrzystość działań na każdym etapie procesu windykacyjnego – od analizy sprawy po egzekucję. Klient ma stały dostęp do informacji i pełną kontrolę strategiczną nad przebiegiem sprawy.",
    standard: "Brak ukrytych kosztów i pełny wgląd.",
    points: ["Podgląd postępów Live", "Dostęp do pełnej dokumentacji", "Jasne raporty efektywności"],
    imageUrl: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=600",
    isVisibleInCarousel: true,
    sectionType: 'why_us'
  },
  {
    id: 'diplomacy',
    internalName: 'Dyplomacja Prawna',
    title: "Dyplomacja Prawna",
    subtitle: "Relacje pod ochroną",
    icon: "Handshake",
    benefit: "Odzyskujemy należności z poszanowaniem relacji biznesowych. Nasze działania are wyważone i profesjonalne – nie palimy mostów, lecz budujemy rozwiązania, które chronią reputację i przyszłą współpracę.",
    standard: "Negocjacje w asyście mediatora.",
    points: ["Profesjonalny ton komunikacji", "Mediacja przedsądowa", "Zachowanie reputacji wierzyciela"],
    imageUrl: "https://images.unsplash.com/photo-1521791136364-798a730bb361?auto=format&fit=crop&q=80&w=600",
    isVisibleInCarousel: true,
    sectionType: 'why_us'
  },
  {
    id: 'responsibility',
    internalName: 'Ochrona wizerunku',
    title: "Ochrona wizerunku",
    subtitle: "Etyka i autorytet",
    icon: "ShieldCheck",
    benefit: "Działamy zgodnie z najwyższymi standardami etyki zawodowej. Chronimy wizerunek Twojej marki, reprezentując ją w sposób profesjonalny i zgodny z zasadami odpowiedzialnego biznesu.",
    standard: "Ochrona wierzyciela ubezpieczeniem OC.",
    points: ["Standardy etyki adwokackiej", "Profesjonalny ton komunikacji", "Ochrona Twoich relacji biznesowych"],
    imageUrl: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&q=80&w=600",
    isVisibleInCarousel: true,
    sectionType: 'why_us'
  },
  {
    id: 'security',
    internalName: 'Gwarancja Bezpieczeństwa',
    title: "Gwarancja Bezpieczeństwa",
    subtitle: "Poufność i standardy",
    icon: "LockKeyhole",
    benefit: "Jako kancelaria działająca pod nadzorem samorządów prawniczych gwarantujemy bezpieczeństwo danych i zgodność z obowiązującymi regulacjami. Twoja reputacja i poufność są dla nas priorytetem.",
    standard: "Gwarancja ubezpieczeniowa OC Kancelarii.",
    points: ["Tajemnica adwokacka i radcowska", "Szyfrowanie danych klasy bankowej", "Pełna odpowiedzialność cywilna"],
    imageUrl: "https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&q=80&w=600",
    isVisibleInCarousel: true,
    sectionType: 'why_us'
  }
];

export const defaultCards: WhyUsCard[] = [
  { id: "kompleksowa", icon: "Scale", title: "Kompleksowa obsługa", desc: "Prowadzimy sprawy od etapu polubownego, przez sądowy, aż po egzekucję komorniczą.", assignedModalId: "legal" },
  { id: "platnosc", icon: "TrendingUp", title: "Płatność za efekt", desc: "Prowizję (success fee) pobieramy wyłącznie wtedy, gdy realnie odzyskamy Twoje pieniądze.", assignedModalId: "efficiency" },
  { id: "transparentne", icon: "Eye", title: "Transparentne koszty", desc: "Jasne stawki za wezwania i pozwy. Gwarantujemy brak ukrytych opłat i niespodzianek.", assignedModalId: "transparency" },
  { id: "zasieg", icon: "MapPin", title: "Ogólnopolski zasięg", desc: "Współpracujemy z komornikami w całym kraju. Cały proces możesz przeprowadzić w 100% zdalnie.", assignedModalId: "monitoring" },
  { id: "przejecie", icon: "RefreshCw", title: "Przejęcie w toku", desc: "Elastycznie dołączamy do spraw na każdym etapie – nawet tych będących już w sądzie lub u komornika.", assignedModalId: "speed" },
  { id: "skutecznosc", icon: "Target", title: "Skuteczność", desc: "Oceniamy realne szanse odzyskania środków na podstawie weryfikacji sytuacji majątkowej dłużnika.", assignedModalId: "audit" },
  { id: "formalnosci", icon: "FileCheck", title: "Minimum formalności", desc: "Nie wymagamy spotkań. Wystarczy, że przekażesz nam dokumenty, a całą resztą zajmiemy się my.", assignedModalId: "diplomacy" },
  { id: "status", icon: "ShieldCheck", title: "Status Kancelarii", desc: "Jesteśmy kancelarią prawną, nie firmą windykacyjną. Zapewniamy pełną reprezentację procesową.", assignedModalId: "shield" }
];

export const availableIcons = [
  'Scale', 'TrendingUp', 'Eye', 'MapPin', 'RefreshCw', 'Target', 'FileCheck', 'ShieldCheck', 'Mail', 'FileText', 'CheckCircle', 'Star', 'Zap', 'Award', 'Briefcase', 'HeartHandshake'
];
