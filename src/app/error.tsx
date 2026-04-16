'use client';

import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 text-center bg-white">
      <h2 className="text-2xl font-bold mb-4 text-brand-navy">Coś poszło nie tak!</h2>
      <button
        onClick={() => reset()}
        className="px-6 py-3 bg-brand-blue text-white font-bold rounded-[var(--radius-brand-button)] hover:bg-brand-blue/90 transition-all"
      >
        Spróbuj ponownie
      </button>
    </div>
  );
}
