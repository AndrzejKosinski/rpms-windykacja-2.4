import { useEffect } from 'react';
import { GoogleGenAI } from "@google/genai";
import { useOnboardingContext } from '../ui/OnboardingContext';
import { INVOICE_PROMPT, INVOICE_SCHEMA } from '../../../shared/api/ai-config';
import { buildFullAddress, robustParseAddress, validateMagicBytes } from '../utils/invoiceHelpers';

export const useFileProcessor = () => {
  const { fileQueue, setFileQueue, setValidationErrors, setIsErrorReportOpen } = useOnboardingContext();

  useEffect(() => {
    const processQueue = async () => {
      const nextItem = fileQueue.find(item => item.status === 'queued');
      if (!nextItem) return;

      setFileQueue(prev => prev.map(it => it.id === nextItem.id ? { ...it, status: 'processing' } : it));

      try {
        const ai = new GoogleGenAI({ apiKey: process.env.NEXT_PUBLIC_GEMINI_API_KEY || process.env.API_KEY });
        const MAX_FILE_SIZE = 25 * 1024 * 1024;

        if (nextItem.file.size > MAX_FILE_SIZE) {
          throw new Error('Plik przekracza dopuszczalny rozmiar (max 25 MB).');
        }

        const isValidFormat = await validateMagicBytes(nextItem.file);
        if (!isValidFormat) {
          throw new Error('Nieprawidłowy format pliku. Akceptujemy tylko PDF, JPG i PNG.');
        }

        if (nextItem.file.type === 'application/pdf') {
          try {
            const textContent = await nextItem.file.text();
            const pageMatches = textContent.match(/\/Type\s*\/Page\b/g);
            const countByMarkers = pageMatches ? pageMatches.length : 0;
            const countMatches = [...textContent.matchAll(/\/Count\s+(\d+)/g)];
            const maxCountFromMeta = countMatches.length > 0 
              ? Math.max(...countMatches.map(m => parseInt(m[1], 10))) 
              : 0;

            const finalPageCount = Math.max(countByMarkers, maxCountFromMeta);
            if (finalPageCount > 5) {
              throw new Error(`Dokument ma ${finalPageCount} stron. Akceptujemy faktury do 5 stron.`);
            }
          } catch (pdfErr: any) {
            if (pdfErr.message?.includes('stron')) throw pdfErr;
          }
        }

        const reader = new FileReader();
        const base64: string = await new Promise((resolve) => {
          reader.readAsDataURL(nextItem.file);
          reader.onload = () => resolve((reader.result as string).split(',')[1]);
        });

        const aiResponse = await ai.models.generateContent({
          model: 'gemini-3-flash-preview',
          contents: [{ parts: [
            { inlineData: { data: base64, mimeType: nextItem.file.type } },
            { text: INVOICE_PROMPT }
          ]}],
          config: {
            responseMimeType: "application/json",
            responseSchema: INVOICE_SCHEMA
          }
        });
        
        const extracted = JSON.parse(aiResponse.text || '{}');
        
        if (extracted.isInvoice === false) {
           throw new Error('Załącznik nie został rozpoznany jako faktura VAT.');
        }

        const fixedAddr = robustParseAddress(extracted.street, extracted.zipCode, extracted.city);
        const finalFormattedAddress = buildFullAddress(fixedAddr.street, fixedAddr.zipCode, fixedAddr.city);

        setFileQueue(prev => prev.map(it => it.id === nextItem.id ? { 
          ...it, 
          status: 'completed', 
          extractedData: { 
            ...extracted, 
            street: fixedAddr.street,
            zipCode: fixedAddr.zipCode,
            city: fixedAddr.city,
            address: finalFormattedAddress,
            fileData: base64, 
            fileType: nextItem.file.type, 
            fileName: nextItem.file.name 
          } 
        } : it));

      } catch (err: any) {
        const errorMsg = err.message || 'Błąd weryfikacji dokumentu.';
        setFileQueue(prev => prev.map(it => it.id === nextItem.id ? { ...it, status: 'error', error: errorMsg } : it));
        setValidationErrors(prev => [...prev, { fileName: nextItem.file.name, reason: errorMsg }]);
        setIsErrorReportOpen(true);
      }
    };

    processQueue();
  }, [fileQueue, setFileQueue, setValidationErrors, setIsErrorReportOpen]);
};
