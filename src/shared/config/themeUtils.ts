import themeConfig from './theme.json';
import { ddsService } from '@/shared/api/apiClientFactory';

function mapConfigToVariables(config: any) {
  return {
    '--dds-form-label-size': config.forms?.labels?.fontSize || themeConfig.forms.labels.fontSize,
    '--dds-form-label-weight': config.forms?.labels?.fontWeight || themeConfig.forms.labels.fontWeight,
    '--dds-form-label-transform': config.forms?.labels?.textTransform || themeConfig.forms.labels.textTransform,
    '--dds-form-label-tracking': config.forms?.labels?.letterSpacing || themeConfig.forms.labels.letterSpacing,
    '--dds-form-label-color': config.forms?.labels?.color || themeConfig.forms.labels.color,
    
    '--dds-form-input-radius': config.forms?.inputs?.borderRadius || themeConfig.forms.inputs.borderRadius,
    '--dds-form-input-border': config.forms?.inputs?.borderWidth || themeConfig.forms.inputs.borderWidth,
    '--dds-form-input-weight': config.forms?.inputs?.fontWeight || themeConfig.forms.inputs.fontWeight || '700',
    
    '--dds-button-primary-radius': config.buttons?.primary?.borderRadius || themeConfig.buttons.primary.borderRadius,
    '--dds-button-primary-transform': config.buttons?.primary?.textTransform || themeConfig.buttons.primary.textTransform,

    '--dds-card-radius': config.cards?.borderRadius || themeConfig.cards.borderRadius,

    // Typography
    '--dds-font-headers': config.typography?.headers?.fontFamily || themeConfig.typography?.headers?.fontFamily || 'var(--font-manrope), sans-serif',
    '--dds-h1-weight': config.typography?.headers?.h1Weight || themeConfig.typography?.headers?.h1Weight || '900',
    '--dds-h2-weight': config.typography?.headers?.h2Weight || themeConfig.typography?.headers?.h2Weight || '800',
    '--dds-header-color': config.typography?.headers?.color || themeConfig.typography?.headers?.color || '#0f172a',
    
    '--dds-font-body': config.typography?.body?.fontFamily || themeConfig.typography?.body?.fontFamily || 'var(--font-manrope), sans-serif',
    '--dds-body-size': config.typography?.body?.fontSize || themeConfig.typography?.body?.fontSize || '16px',
    '--dds-body-line-height': config.typography?.body?.lineHeight || themeConfig.typography?.body?.lineHeight || '1.5',
    '--dds-body-color': config.typography?.body?.color || themeConfig.typography?.body?.color || '#0f172a',

    // Colors
    '--dds-color-primary': config.colors?.brand?.primary || themeConfig.colors?.brand?.primary || '#137fec',
    '--dds-color-secondary': config.colors?.brand?.secondary || themeConfig.colors?.brand?.secondary || '#0a2e5c',
    '--dds-color-accent': config.colors?.brand?.accent || themeConfig.colors?.brand?.accent || '#38bdf8',
    '--dds-color-bg': config.colors?.surface?.background || themeConfig.colors?.surface?.background || '#e0f2fe',
    '--dds-color-card': config.colors?.surface?.card || themeConfig.colors?.surface?.card || '#ffffff',
    '--dds-color-border': config.colors?.surface?.border || themeConfig.colors?.surface?.border || '#e2e8f0',
  } as React.CSSProperties;
}

export function getThemeVariables() {
  return mapConfigToVariables(themeConfig);
}

export async function getDynamicThemeVariables() {
  try {
    // Use the unified service instead of direct Apps Script call
    const config = await ddsService.getThemeConfig();
    
    if (config && Object.keys(config).length > 0) {
      // Deep merge with themeConfig to ensure no missing properties
      const mergedConfig = {
        ...themeConfig,
        ...config,
        forms: {
          labels: { ...themeConfig.forms.labels, ...config.forms?.labels },
          inputs: { ...themeConfig.forms.inputs, ...config.forms?.inputs }
        },
        buttons: {
          primary: { ...themeConfig.buttons.primary, ...config.buttons?.primary }
        },
        typography: {
          headers: { ...themeConfig.typography.headers, ...config.typography?.headers },
          body: { ...themeConfig.typography.body, ...config.typography?.body }
        },
        colors: {
          brand: { ...themeConfig.colors.brand, ...config.colors?.brand },
          surface: { ...themeConfig.colors.surface, ...config.colors?.surface }
        }
      };
      return mapConfigToVariables(mergedConfig);
    }
  } catch (error) {
    console.error('Failed to fetch dynamic theme variables:', error);
  }
  
  return getThemeVariables();
}
