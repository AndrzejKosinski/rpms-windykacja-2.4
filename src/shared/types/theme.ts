export interface ThemeConfig {
  forms?: {
    labels?: {
      fontSize?: string;
      fontWeight?: string;
      textTransform?: string;
      letterSpacing?: string;
      color?: string;
    };
    inputs?: {
      borderRadius?: string;
      borderWidth?: string;
      fontWeight?: string;
    };
  };
  buttons?: {
    primary?: {
      borderRadius?: string;
      textTransform?: string;
    };
  };
  cards?: {
    borderRadius?: string;
  };
  typography?: {
    headers?: {
      fontFamily?: string;
      h1Weight?: string;
      h2Weight?: string;
      color?: string;
    };
    body?: {
      fontFamily?: string;
      fontSize?: string;
      lineHeight?: string;
      color?: string;
    };
  };
  colors?: {
    brand?: {
      primary?: string;
      secondary?: string;
      accent?: string;
    };
    surface?: {
      background?: string;
      card?: string;
      border?: string;
    };
    background?: {
      main?: string;
      card?: string;
    };
    text?: {
      primary?: string;
      secondary?: string;
    };
  };
  [key: string]: unknown; // fallback for dynamic keys
}
