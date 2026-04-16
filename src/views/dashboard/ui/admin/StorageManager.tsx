import React, { useState, useEffect } from 'react';
import { Settings, Save, Loader2, CheckCircle, AlertTriangle } from 'lucide-react';
import { supabase } from '@/shared/api/supabaseClient';

interface ModuleConfig {
  module_id: string;
  storage_type: 'apps-script' | 'supabase';
  config: Record<string, any>;
}

const StorageManager: React.FC = () => {
  const [configs, setConfigs] = useState<ModuleConfig[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  useEffect(() => {
    fetchConfigs();
  }, []);

  const fetchConfigs = async () => {
    setLoading(true);
    const { data, error } = await supabase.from('system_settings').select('*');
    if (error) {
      setError(error.message);
    } else {
      if (!data || data.length === 0) {
        // Seed default modules if empty
        const defaultConfigs: ModuleConfig[] = [
          { module_id: 'cms', storage_type: 'apps-script', config: {} },
          { module_id: 'dds', storage_type: 'apps-script', config: {} },
          { module_id: 'auth', storage_type: 'apps-script', config: {} },
          { module_id: 'analytics', storage_type: 'apps-script', config: {} },
          { module_id: 'debt_case', storage_type: 'apps-script', config: {} },
          { module_id: 'file', storage_type: 'apps-script', config: {} },
          { module_id: 'settings', storage_type: 'apps-script', config: {} },
          { module_id: 'user', storage_type: 'apps-script', config: {} }
        ];
        setConfigs(defaultConfigs);
      } else {
        setConfigs(data);
      }
    }
    setLoading(false);
  };

  const updateConfig = (moduleId: string, field: string, value: any) => {
    setConfigs(prev => prev.map(c => 
      c.module_id === moduleId ? { ...c, [field]: value } : c
    ));
  };

  const saveConfigs = async () => {
    setSaving(true);
    setError(null);
    setSuccessMsg(null);
    const { error } = await supabase.from('system_settings').upsert(configs);
    if (error) {
      setError(error.message);
    } else {
      setSuccessMsg('Konfiguracja zapisana pomyślnie. Odśwież stronę, aby zastosować zmiany.');
      setTimeout(() => setSuccessMsg(null), 5000);
    }
    setSaving(false);
  };

  if (loading) return <div className="text-white p-6">Ładowanie konfiguracji...</div>;

  return (
    <div className="p-6 bg-[#0f172a] rounded-[var(--radius-brand-card)] shadow-sm border border-slate-800">
      <h2 className="text-lg font-semibold flex items-center gap-2 mb-6 text-white">
        <Settings className="w-5 h-5 text-brand-blue" />
        Konfiguracja Storage
      </h2>

      {error && (
        <div className="mb-4 p-3 bg-red-900/20 text-red-400 rounded border border-red-900/50 flex items-center gap-2">
          <AlertTriangle className="w-4 h-4" />
          {error}
        </div>
      )}

      {successMsg && (
        <div className="mb-4 p-3 bg-emerald-900/20 text-emerald-400 rounded border border-emerald-900/50 flex items-center gap-2">
          <CheckCircle className="w-4 h-4" />
          {successMsg}
        </div>
      )}

      <div className="space-y-6">
        {configs.map(config => (
          <div key={config.module_id} className="p-4 bg-slate-900 rounded-[var(--radius-brand-card)] border border-slate-800">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-white font-medium capitalize flex items-center gap-2">
                {config.module_id}
                <span className={`w-2 h-2 rounded-full ${config.storage_type === 'supabase' ? 'bg-emerald-500' : 'bg-amber-500'}`} title={`Aktywny backend: ${config.storage_type}`}></span>
              </h3>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-slate-400 block mb-1">Typ Storage</label>
                <select 
                  value={config.storage_type}
                  onChange={(e) => updateConfig(config.module_id, 'storage_type', e.target.value)}
                  className="w-full bg-slate-950 text-white p-2 rounded border border-slate-700 text-sm"
                >
                  <option value="apps-script">Apps Script</option>
                  <option value="supabase">Supabase</option>
                </select>
              </div>
              <div>
                <label className="text-xs text-slate-400 block mb-1">Konfiguracja (JSON)</label>
                <input 
                  type="text"
                  value={JSON.stringify(config.config)}
                  onChange={(e) => {
                    try {
                      updateConfig(config.module_id, 'config', JSON.parse(e.target.value));
                    } catch {}
                  }}
                  className="w-full bg-slate-950 text-white p-2 rounded border border-slate-700 text-sm font-mono"
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={saveConfigs}
        disabled={saving}
        className="mt-6 px-4 py-2 bg-brand-blue text-white rounded-[var(--radius-brand-button)] hover:bg-brand-blue/90 disabled:bg-gray-700 flex items-center gap-2"
      >
        {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
        {saving ? 'Zapisywanie...' : 'Zapisz Ustawienia'}
      </button>
    </div>
  );
};

export default StorageManager;
