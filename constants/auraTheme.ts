export const AuraColors = {
  background: '#FAF8FC',
  backgroundDark: '#11132F',

  surface: '#FFFFFF',
  surfaceSoft: '#F5F0FB',
  surfacePurple: '#EEE5FA',

  navy: '#12164A',
  navySoft: '#292C67',

  purple: '#6537D8',
  purpleDark: '#45219F',
  purpleLight: '#B56AE8',

  gold: '#C99A4A',
  goldLight: '#E6C98D',
  goldSoft: '#F7EEDC',

  text: '#17152A',
  textSecondary: '#6E6879',
  textMuted: '#9992A4',
  textOnDark: '#FFFFFF',

  success: '#4D8A68',
  warning: '#C48A3C',
  error: '#C65B68',

  border: '#E7DEEF',
  borderLight: '#F0EAF5',

  white: '#FFFFFF',
  black: '#000000',
  transparent: 'transparent',
};

export const AuraSpacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
  huge: 40,
  massive: 52,
};

export const AuraRadius = {
  small: 10,
  medium: 16,
  large: 22,
  extraLarge: 28,
  card: 24,
  pill: 999,
};

export const AuraTypography = {
  display: {
    fontSize: 34,
    lineHeight: 40,
    fontWeight: '700' as const,
  },

  title: {
    fontSize: 28,
    lineHeight: 34,
    fontWeight: '700' as const,
  },

  heading: {
    fontSize: 22,
    lineHeight: 28,
    fontWeight: '700' as const,
  },

  subheading: {
    fontSize: 18,
    lineHeight: 24,
    fontWeight: '600' as const,
  },

  bodyLarge: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '400' as const,
  },

  body: {
    fontSize: 15,
    lineHeight: 22,
    fontWeight: '400' as const,
  },

  bodyMedium: {
    fontSize: 15,
    lineHeight: 22,
    fontWeight: '500' as const,
  },

  small: {
    fontSize: 13,
    lineHeight: 18,
    fontWeight: '400' as const,
  },

  label: {
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '600' as const,
    letterSpacing: 0.5,
  },

  button: {
    fontSize: 15,
    lineHeight: 20,
    fontWeight: '600' as const,
  },
};

export const AuraShadow = {
  soft: {
    shadowColor: '#17152A',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 3,
  },

  card: {
    shadowColor: '#17152A',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.08,
    shadowRadius: 18,
    elevation: 5,
  },

  floating: {
    shadowColor: '#45219F',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 8,
  },
};

export const AuraTheme = {
  colors: AuraColors,
  spacing: AuraSpacing,
  radius: AuraRadius,
  typography: AuraTypography,
  shadow: AuraShadow,
};