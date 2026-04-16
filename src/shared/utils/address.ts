// Helper do budowania sformatowanego adresu dla backendu (format: Ulica, Kod Miasto)
export const buildFullAddress = (street: string, zip: string, city: string) => {
  const s = (street || "").trim();
  const z = (zip || "").trim();
  const c = (city || "").trim();
  
  if (!s && !z && !c) return "";
  
  // Budowa: "Ulica, Kod Miasto" lub "Ulica, Miasto" lub "Ulica"
  let full = s;
  if (z || c) {
    full += (full ? ", " : "") + [z, c].filter(Boolean).join(" ");
  }
  return full;
};

// Inteligentny parser zabezpieczający na wypadek błędu AI
export const robustParseAddress = (street: string, zip: string, city: string) => {
  let s = (street || "").trim();
  let z = (zip || "").trim();
  let c = (city || "").trim();

  // Jeśli AI wpisało kod pocztowy do ulicy, spróbuj go wyciąć
  const zipMatch = s.match(/(\d{2}-\d{3})/);
  if (zipMatch && !z) {
    z = zipMatch[1];
    const parts = s.split(z);
    s = parts[0].trim().replace(/[,]$/, '').trim();
    if (!c && parts[1]) {
      c = parts[1].trim().replace(/^[,]/, '').trim();
    }
  }

  // Dodatkowe zabezpieczenie: jeśli ulica zawiera przecinek, a miasto jest puste
  if (s.includes(',') && !c) {
    const parts = s.split(',');
    s = parts[0].trim();
    c = parts[1].trim();
    const innerZip = c.match(/(\d{2}-\d{3})/);
    if (innerZip && !z) {
      z = innerZip[1];
      c = c.replace(z, '').trim();
    }
  }

  return { street: s, zipCode: z, city: c };
};

export const parseAddressParts = (addr: string) => {
  if (!addr) return { street: '', zipCode: '', city: '' };
  const parts = addr.split(',');
  const street = parts[0]?.trim() || '';
  const remaining = parts.slice(1).join(',').trim() || '';
  const zipCodeMatch = remaining.match(/\d{2}-\d{3}/);
  const zipCode = zipCodeMatch ? zipCodeMatch[0] : '';
  const city = remaining.replace(/\d{2}-\d{3}/, '').trim();
  return { street, zipCode, city };
};
