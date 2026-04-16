module.exports=[113419,a=>{"use strict";var b=a.i(979997);a.s(["Loader2",()=>b.default])},139216,a=>{"use strict";var b=a.i(172354);let c=()=>new b.GoogleGenAI({apiKey:"[TWOJ-KLUCZ-GEMINI]"}),d=async(a,d)=>JSON.parse((await c().models.generateContent({model:"gemini-3-flash-preview",contents:`Zoptymalizuj SEO dla artykułu o tytule: "${a}".
    Treść artykułu: ${d.substring(0,2e3)}...
    
    Wygeneruj:
    1. Chwytliwy Meta Tytuł (do 60 znak\xf3w).
    2. Meta Opis (do 160 znak\xf3w).
    3. Listę sł\xf3w kluczowych po przecinku.
    4. Przyjazny URL (slug).
    5. Tekst alternatywny dla zdjęcia gł\xf3wnego.
    6. Kr\xf3tki Opis (Zajawka) - zachęcające streszczenie artykułu (do 250 znak\xf3w), kt\xf3re będzie widoczne na liście wpis\xf3w.
    7. Dane strukturalne JSON-LD (typ BlogPosting).
    8. Listę 3-5 najczęstszych pytań i odpowiedzi (FAQ) na podstawie treści artykułu.`,config:{responseMimeType:"application/json",responseSchema:{type:b.Type.OBJECT,properties:{title:{type:b.Type.STRING},description:{type:b.Type.STRING},keywords:{type:b.Type.STRING},slug:{type:b.Type.STRING},imageAlt:{type:b.Type.STRING},excerpt:{type:b.Type.STRING},jsonLd:{type:b.Type.OBJECT},faqs:{type:b.Type.ARRAY,items:{type:b.Type.OBJECT,properties:{question:{type:b.Type.STRING},answer:{type:b.Type.STRING}},required:["question","answer"]}}},required:["title","description","keywords","slug","imageAlt","excerpt","jsonLd","faqs"]}}})).text||"{}"),e=async(a,d)=>{let e=await c().models.generateContent({model:"gemini-3-flash-preview",contents:`Jesteś ekspertem LegalTech i copywriterem dla nowoczesnej kancelarii prawnej RPMS Windykacja.
Na podstawie kr\xf3tkiej obietnicy z karty: "${a}: ${d}", stw\xf3rz rozszerzoną treść do okna modalnego.

Wymagania:
1. Tytuł: Profesjonalny, przyciągający uwagę (np. "Pancerna dokumentacja").
2. Podtytuł: Kr\xf3tkie hasło wzmacniające (np. "Precyzyjne uderzenie").
3. Benefit: Rozwiń opis w 2-3 profesjonalne zdania, podkreślając bezpieczeństwo, szybkość i korzyść biznesową dla wierzyciela.
4. Standard: Stw\xf3rz chwytliwe hasło określające standard usługi (np. "Reakcja operacyjna: 15 minut").
5. Punkty: Wygeneruj 3 konkretne punkty (bullet points) opisujące techniczne lub strategiczne aspekty tej korzyści. Każdy z 3 punkt\xf3w musi być bardzo zwięzły (maksymalnie 55 znak\xf3w), tak aby bezwzględnie mieścił się w jednej linii w oknie modalnym. Unikaj złożonych zdań.

Styl: Ekspercki, budujący zaufanie, konkretny, unikający og\xf3lnik\xf3w.`,config:{responseMimeType:"application/json",responseSchema:{type:b.Type.OBJECT,properties:{title:{type:b.Type.STRING},subtitle:{type:b.Type.STRING},benefit:{type:b.Type.STRING},standard:{type:b.Type.STRING},points:{type:b.Type.ARRAY,description:"Lista 3 punktów, każdy maksymalnie 55 znaków.",items:{type:b.Type.STRING}}},required:["title","subtitle","benefit","standard","points"]}}});if(!e.text)throw Error("AI nie zwróciło żadnej treści.");let f=JSON.parse(e.text);return f.points=f.points.map(a=>a.length>55?a.substring(0,52)+"...":a),f};a.s(["generateWhyUsModal",0,e,"optimizeSEO",0,d])},524941,a=>{"use strict";var b=a.i(194524);a.s(["Database",()=>b.default])},238782,a=>{"use strict";var b=a.i(519988);a.s(["LayoutTemplate",()=>b.default])}];

//# sourceMappingURL=Documents_Windykacja%20RPMS_rpms-windykacja-2_683_a60d94f8._.js.map