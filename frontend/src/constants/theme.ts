
export const COLORS = {
  // Paleta principal inspirada en el clima
  primary: '#1E40AF',      // Azul profundo del cielo
  primaryLight: '#3B82F6', // Azul claro
  primaryDark: '#1E3A8A',  // Azul muy oscuro
  
  secondary: '#0EA5E9',    // Azul cyan del agua
  secondaryLight: '#38BDF8',
  secondaryDark: '#0284C7',
  
  // Colores de estado
  success: '#10B981',      // Verde para datos disponibles
  warning: '#F59E0B',      // Naranja para advertencias
  danger: '#EF4444',       // Rojo para alertas/FWI
  info: '#6366F1',         // Índigo para información
  
  // Grises y neutros
  background: '#F8FAFC',   // Fondo muy claro
  surface: '#FFFFFF',      // Surface cards
  surfaceAlt: '#F1F5F9',   // Surface alternativo
  
  text: '#0F172A',         // Texto principal
  textSecondary: '#475569', // Texto secundario
  textMuted: '#94A3B8',    // Texto desaturado
  
  border: '#E2E8F0',       // Bordes suaves
  borderLight: '#F1F5F9',  // Bordes muy suaves
  
  // Gradientes
  gradientStart: '#1E40AF',
  gradientEnd: '#0EA5E9',
  
  // Estados especiales
  shimmer: '#E2E8F0',
  overlay: 'rgba(0, 0, 0, 0.5)',
  overlayLight: 'rgba(0, 0, 0, 0.3)',
};

export const SIZES = {
  // Espaciado
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
  
  // Texto
  textSm: 12,
  textMd: 14,
  textLg: 16,
  textXl: 18,
  text2xl: 20,
  text3xl: 24,
  text4xl: 28,
  
  // Componentes
  buttonHeight: 48,
  inputHeight: 48,
  cardRadius: 12,
  buttonRadius: 8,
  
  // Pantalla
  screenPadding: 16,
  containerMaxWidth: 400,
};

export const FONTS = {
  regular: 'System',
  medium: 'System',
  semiBold: 'System',
  bold: 'System',
};

export const SHADOWS = {
  small: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  medium: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.12,
    shadowRadius: 4,
    elevation: 4,
  },
  large: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 8,
  },
};

// Temas para tipos de productos meteorológicos
export const PRODUCT_THEMES = {
  FWI: {
    color: COLORS.danger,
    gradient: ['#EF4444', '#DC2626'],
    icon: 'fire',
  },
  RADAR: {
    color: COLORS.success,
    gradient: ['#10B981', '#059669'],
    icon: 'radar',
  },
  SATELITE: {
    color: COLORS.primary,
    gradient: ['#3B82F6', '#2563EB'],
    icon: 'satellite',
  },
  PRECIPITACION: {
    color: COLORS.secondary,
    gradient: ['#0EA5E9', '#0284C7'],
    icon: 'cloud-rain',
  },
  TEMPERATURA: {
    color: COLORS.warning,
    gradient: ['#F59E0B', '#D97706'],
    icon: 'thermometer',
  },
  GENERIC: {
    color: COLORS.textSecondary,
    gradient: ['#6B7280', '#4B5563'],
    icon: 'cloud',
  },
};
