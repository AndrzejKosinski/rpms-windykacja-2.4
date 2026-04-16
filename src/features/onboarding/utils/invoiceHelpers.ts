export const buildFullAddress = (street: string, zip: string, city: string) => {
  const s = (street || "").trim();
  const z = (zip || "").trim();
  const c = (city || "").trim();
  if (!s && !z && !c) return "";
  let full = s;
  if (z || c) {
    full += (full ? ", " : "") + [z, c].filter(Boolean).join(" ");
  }
  return full;
};

export const robustParseAddress = (street: string, zip: string, city: string) => {
  let s = (street || "").trim();
  let z = (zip || "").trim();
  let c = (city || "").trim();

  const zipMatch = s.match(/(\d{2}-\d{3})/);
  if (zipMatch && !z) {
    z = zipMatch[1];
    const parts = s.split(z);
    s = parts[0].trim().replace(/[,]$/, '').trim();
    if (!c && parts[1]) {
      c = parts[1].trim().replace(/^[,]/, '').trim();
    }
  }

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

export const validateMagicBytes = async (file: File): Promise<boolean> => {
  try {
    const buffer = await file.slice(0, 4).arrayBuffer();
    const arr = new Uint8Array(buffer);
    let header = "";
    for (let i = 0; i < arr.length; i++) {
      header += arr[i].toString(16).padStart(2, '0').toUpperCase();
    }
    
    if (header === "25504446") return true; // PDF
    if (header.startsWith("FFD8FF")) return true; // JPEG
    if (header === "89504E47") return true; // PNG
    
    return false;
  } catch (e) {
    return false;
  }
};

export const getFileFingerprint = (file: File) => `${file.name}-${file.size}-${file.lastModified}`;
