import { GoogleGenAI, Type } from "@google/genai";

const getAI = () => new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY || '' });

export interface SEOOptimizationResult {
  title: string;
  description: string;
  keywords: string;
  slug: string;
  imageAlt: string;
  excerpt: string;
  jsonLd: any;
  faqs: { question: string; answer: string }[];
}

export interface WhyUsModalAIResult {
  title: string;
  subtitle: string;
  benefit: string;
  standard: string;
  points: string[];
}

export const optimizeSEO = async (title: string, content: string): Promise<SEOOptimizationResult> => {
  const response = await getAI().models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Zoptymalizuj SEO dla artykułu o tytule: "${title}".
    Treść artykułu: ${content.substring(0, 2000)}...
    
    Wygeneruj:
    1. Chwytliwy Meta Tytuł (do 60 znaków).
    2. Meta Opis (do 160 znaków).
    3. Listę słów kluczowych po przecinku.
    4. Przyjazny URL (slug).
    5. Tekst alternatywny dla zdjęcia głównego.
    6. Krótki Opis (Zajawka) - zachęcające streszczenie artykułu (do 250 znaków), które będzie widoczne na liście wpisów.
    7. Dane strukturalne JSON-LD (typ BlogPosting).
    8. Listę 3-5 najczęstszych pytań i odpowiedzi (FAQ) na podstawie treści artykułu.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING },
          description: { type: Type.STRING },
          keywords: { type: Type.STRING },
          slug: { type: Type.STRING },
          imageAlt: { type: Type.STRING },
          excerpt: { type: Type.STRING },
          jsonLd: { type: Type.OBJECT },
          faqs: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                question: { type: Type.STRING },
                answer: { type: Type.STRING }
              },
              required: ["question", "answer"]
            }
          }
        },
        required: ["title", "description", "keywords", "slug", "imageAlt", "excerpt", "jsonLd", "faqs"]
      }
    }
  });

  return JSON.parse(response.text || '{}');
};

export const generateWhyUsModal = async (cardTitle: string, cardDesc: string): Promise<WhyUsModalAIResult> => {
  const response = await getAI().models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Jesteś ekspertem LegalTech i copywriterem dla nowoczesnej kancelarii prawnej RPMS Windykacja.
Na podstawie krótkiej obietnicy z karty: "${cardTitle}: ${cardDesc}", stwórz rozszerzoną treść do okna modalnego.

Wymagania:
1. Tytuł: Profesjonalny, przyciągający uwagę (np. "Pancerna dokumentacja").
2. Podtytuł: Krótkie hasło wzmacniające (np. "Precyzyjne uderzenie").
3. Benefit: Rozwiń opis w 2-3 profesjonalne zdania, podkreślając bezpieczeństwo, szybkość i korzyść biznesową dla wierzyciela.
4. Standard: Stwórz chwytliwe hasło określające standard usługi (np. "Reakcja operacyjna: 15 minut").
5. Punkty: Wygeneruj 3 konkretne punkty (bullet points) opisujące techniczne lub strategiczne aspekty tej korzyści. Każdy z 3 punktów musi być bardzo zwięzły (maksymalnie 55 znaków), tak aby bezwzględnie mieścił się w jednej linii w oknie modalnym. Unikaj złożonych zdań.

Styl: Ekspercki, budujący zaufanie, konkretny, unikający ogólników.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING },
          subtitle: { type: Type.STRING },
          benefit: { type: Type.STRING },
          standard: { type: Type.STRING },
          points: {
            type: Type.ARRAY,
            description: "Lista 3 punktów, każdy maksymalnie 55 znaków.",
            items: { type: Type.STRING }
          }
        },
        required: ["title", "subtitle", "benefit", "standard", "points"]
      }
    }
  });

  if (!response.text) {
    throw new Error('AI nie zwróciło żadnej treści.');
  }

  const result: WhyUsModalAIResult = JSON.parse(response.text);
  
  // Fallback: Ensure points are truncated to 55 characters
  result.points = result.points.map(point => point.length > 55 ? point.substring(0, 52) + '...' : point);

  return result;
};
