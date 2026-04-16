import { GoogleGenAI } from "@google/genai";
import { INVOICE_PROMPT, INVOICE_SCHEMA } from '../../../shared/api/ai-config';
import { robustParseAddress, buildFullAddress } from '../../../shared/utils/address';
import { ExtractedDebtData } from '../../../entities/invoice/model/types';

const getAI = () => new GoogleGenAI({ apiKey: process.env.NEXT_PUBLIC_GEMINI_API_KEY || '' });

export const invoiceApi = {
  analyzeInvoice: async (fileData: string, mimeType: string): Promise<ExtractedDebtData | null> => {
    try {
      const response = await getAI().models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: [{
          parts: [
            { inlineData: { data: fileData, mimeType } },
            { text: INVOICE_PROMPT }
          ]
        }],
        config: {
          responseMimeType: "application/json",
          responseSchema: INVOICE_SCHEMA
        }
      });
      
      const parsed = JSON.parse(response.text || '{}');
      if (parsed.isInvoice === false) return null;

      const fixedAddr = robustParseAddress(parsed.street, parsed.zipCode, parsed.city);
      const fullAddrString = buildFullAddress(fixedAddr.street, fixedAddr.zipCode, fixedAddr.city);

      return {
        debtorName: parsed.debtorName || "",
        nip: (parsed.nip || "").replace(/\D/g, ''),
        krs: parsed.krs || "",
        street: fixedAddr.street,
        zipCode: fixedAddr.zipCode,
        city: fixedAddr.city,
        address: fullAddrString,
        corrStreet: "",
        corrZipCode: "",
        corrCity: "",
        correspondenceAddress: "",
        isForeign: false,
        invoiceNumber: parsed.invoiceNumber || "",
        issueDate: parsed.issueDate || "", 
        dueDate: parsed.dueDate || "",     
        amount: parsed.amount || "",
        netAmount: parsed.netAmount || "",
        vatAmount: parsed.vatAmount || "",
        currency: (parsed.currency === 'EUR' ? 'EUR' : 'PLN'),
        description: parsed.description || "",
        isContested: 'NO'
      };
    } catch (error) {
      console.error("AI Analysis Error:", error);
      return null;
    }
  }
};
