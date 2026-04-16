import React, { useState } from 'react';
import { Database, Loader2 } from 'lucide-react';
import { migrationService } from '@/features/migration/MigrationService';

const MigrationManager: React.FC = () => {
  const [isMigrating, setIsMigrating] = useState(false);
  const [status, setStatus] = useState<'idle' | 'migrating' | 'success' | 'error'>('idle');
  const [log, setLog] = useState<string[]>([]);
  const [showConfirm, setShowConfirm] = useState(false);

  const addLog = (message: string) => setLog((prev) => [...prev, message]);

  const runMigration = async () => {
    setIsMigrating(true);
    setStatus('migrating');
    setLog([]);
    setShowConfirm(false);
    addLog('Rozpoczynanie migracji...');

    await migrationService.runMigration({
      onLog: addLog,
      onSuccess: () => {
        setStatus('success');
      },
      onError: (error) => {
        setStatus('error');
        addLog(`BŁĄD: ${error.message}`);
      }
    });

    setIsMigrating(false);
  };

  return (
    <div className="p-6 bg-[#0f172a] rounded-[var(--radius-brand-card)] shadow-sm border border-slate-800">
      <h2 className="text-lg font-semibold flex items-center gap-2 mb-4 text-white">
        <Database className="w-5 h-5 text-brand-blue" />
        Migration Manager
      </h2>
      <p className="text-sm text-slate-400 mb-4">
        Narzędzie do migracji danych z Google Sheets do Supabase.
      </p>
      
      {!showConfirm ? (
        <button
          onClick={() => setShowConfirm(true)}
          disabled={isMigrating}
          className="px-4 py-2 bg-brand-blue text-white rounded-[var(--radius-brand-button)] hover:bg-brand-blue/90 disabled:bg-gray-700 flex items-center gap-2"
        >
          {isMigrating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Database className="w-4 h-4" />}
          {isMigrating ? 'Migrowanie...' : 'Uruchom Migrację'}
        </button>
      ) : (
        <div className="p-4 bg-red-900/20 border border-red-900/50 rounded-[var(--radius-brand-card)] mb-4">
          <p className="text-red-400 text-sm mb-3">Czy na pewno chcesz rozpocząć migrację? Ta operacja może nadpisać istniejące dane w Supabase.</p>
          <div className="flex gap-3">
            <button
              onClick={runMigration}
              className="px-4 py-2 bg-red-600 text-white rounded-[var(--radius-brand-button)] hover:bg-red-700 text-sm font-bold"
            >
              Tak, rozpocznij
            </button>
            <button
              onClick={() => setShowConfirm(false)}
              className="px-4 py-2 bg-slate-800 text-white rounded-[var(--radius-brand-button)] hover:bg-slate-700 text-sm"
            >
              Anuluj
            </button>
          </div>
        </div>
      )}

      {log.length > 0 && (
        <div className="mt-4 p-4 bg-slate-950 text-emerald-400 rounded-[var(--radius-brand-input)] text-xs font-mono h-40 overflow-y-auto border border-slate-800">
          {log.map((entry, i) => <div key={i}>{entry}</div>)}
        </div>
      )}
    </div>
  );
};

export default MigrationManager;
