import { IDDSService } from '../interfaces/IDDSService';
import { supabase } from '../supabaseClient';
import { ThemeConfig } from '../../types/theme';

export class SupabaseDDSAdapter implements IDDSService {
  async getThemeConfig(): Promise<ThemeConfig> {
    try {
      const { data, error } = await supabase
        .from('dds_config')
        .select('theme_data')
        .eq('is_active', true)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (error) throw error;
      return data?.theme_data || {};
    } catch (error) {
      console.error('SupabaseDDSAdapter: Error fetching theme config:', error);
      return {};
    }
  }

  async updateThemeConfig(config: ThemeConfig): Promise<void> {
    try {
      const { error } = await supabase
        .from('dds_config')
        .insert([{ theme_data: config, is_active: true }]);

      if (error) throw error;
    } catch (error) {
      console.error('SupabaseDDSAdapter: Error updating theme config:', error);
      throw error;
    }
  }
}
