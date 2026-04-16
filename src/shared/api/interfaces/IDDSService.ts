import { ThemeConfig } from '../../types/theme';

export interface IDDSService {
  getThemeConfig(): Promise<ThemeConfig>;
  updateThemeConfig(config: ThemeConfig): Promise<void>;
}
