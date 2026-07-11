/**
 * BORCELLE brand palette — single source of truth for color.
 * Components never use raw hex values; they consume these tokens via @theme.
 */
export const colors = {
  // Brand
  primary: '#4F6BD8',
  onPrimary: '#FFFFFF',
  secondary: '#F576B5',
  onSecondary: '#FFFFFF',
  accent: '#F6C445',
  onAccent: '#232750',

  // Surfaces
  background: '#FBFAFF',
  surface: '#FFFFFF',
  overlay: 'rgba(35, 39, 80, 0.45)',

  // Content
  text: '#232750',
  textMuted: '#7B7D96',
  onMuted: '#4A4E74',

  // Lines & fills (derived from primary/navy over white)
  border: '#E0E5F9',
  muted: '#F1F0FA',

  // Feedback (state semantics: success is green, error is red — always)
  error: '#E5484D',
  onError: '#FFFFFF',
  success: '#2E9E6B',
  onSuccess: '#FFFFFF',
} as const;

export type ColorToken = keyof typeof colors;
