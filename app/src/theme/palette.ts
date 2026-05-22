export const lightPalette = {
  background: '#F4F6FB',
  card: '#FFFFFF',
  text: '#0F172A',
  muted: '#475569',
  accent: '#2563EB',
  border: '#E2E8F0',
  error: '#DC2626',
  errorBackground: '#FEF2F2',
  errorBorder: '#FECACA',
  inputBackground: '#FFFFFF',
  disabled: '#94A3B8',
} as const;

export const darkPalette = {
  background: '#0B1220',
  card: '#111827',
  text: '#F8FAFC',
  muted: '#94A3B8',
  accent: '#60A5FA',
  border: '#1E293B',
  error: '#F87171',
  errorBackground: '#450A0A',
  errorBorder: '#7F1D1D',
  inputBackground: '#1E293B',
  disabled: '#64748B',
} as const;

export type Palette = {
  background: string;
  card: string;
  text: string;
  muted: string;
  accent: string;
  border: string;
  error: string;
  errorBackground: string;
  errorBorder: string;
  inputBackground: string;
  disabled: string;
};

export function getPalette(isDarkMode: boolean): Palette {
  return isDarkMode ? darkPalette : lightPalette;
}
