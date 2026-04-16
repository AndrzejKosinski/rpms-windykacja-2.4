import { useState } from 'react';

/**
 * Interfejs reprezentujący ustandaryzowany wynik wyszukiwania danych firmy po NIP-ie.
 */
export interface NipLookupResult {
  /** Nazwa firmy pobrana z rejestru */
  name: string;
  /** Adres siedziby firmy (ulica, kod pocztowy, miasto) */
  address: string;
  /** Numer NIP, dla którego wykonano zapytanie */
  nip: string;
}

/**
 * Hook do pobierania danych firmy na podstawie numeru NIP z zewnętrznego API (np. Biała Księga, docelowo GUS).
 * 
 * @returns {Object} Obiekt zawierający:
 * - `lookupNip`: Funkcja asynchroniczna pobierająca dane dla podanego NIP-u.
 * - `isFetching`: Flaga informująca, czy zapytanie jest w trakcie przetwarzania.
 * - `error`: Komunikat błędu, jeśli zapytanie się nie powiodło.
 */
export function useNipLookup() {
  const [isFetching, setIsFetching] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Pobiera dane firmy po numerze NIP.
   * 
   * @param {string} nip - 10-cyfrowy numer NIP.
   * @returns {Promise<NipLookupResult | null>} Obiekt z danymi firmy lub null w przypadku błędu.
   */
  const lookupNip = async (nip: string): Promise<NipLookupResult | null> => {
    setIsFetching(true);
    setError(null);

    try {
      const res = await fetch(`/api/nip?nip=${nip}`);
      const data = await res.json();

      if (res.ok && data.result && data.result.subject) {
        const subject = data.result.subject;
        return {
          name: subject.name || '',
          address: subject.workingAddress || subject.residenceAddress || '',
          nip
        };
      } else {
        setError('Nie znaleziono firmy o podanym numerze NIP.');
        return null;
      }
    } catch (err) {
      setError('Błąd podczas pobierania danych z rejestru.');
      return null;
    } finally {
      setIsFetching(false);
    }
  };

  return { lookupNip, isFetching, error };
}
