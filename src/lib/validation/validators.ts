/**
 * Field validators for checkout forms. Each returns an error message in
 * Spanish, or null when the value is valid — aligned with the backend DTO
 * (required vs optional, IsEmail).
 */

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export const validateRequired = (
  value: string,
  label: string,
): string | null => (value.trim() ? null : `${label} es obligatorio`);

export const validateEmail = (value: string): string | null => {
  if (!value.trim()) {
    return 'El email es obligatorio';
  }
  return EMAIL_PATTERN.test(value.trim()) ? null : 'Ingresa un email válido';
};

/** Optional field: only validated when present. */
export const validateOptionalPhone = (value: string): string | null => {
  const digits = value.replace(/\D/g, '');
  if (!value.trim()) {
    return null;
  }
  return digits.length >= 7 ? null : 'Ingresa un teléfono válido';
};

export type CardBrand = 'visa' | 'mastercard' | 'unknown';

/** VISA starts with 4; Mastercard with 51-55 or 2221-2720. */
export const detectCardBrand = (cardNumber: string): CardBrand => {
  const digits = cardNumber.replace(/\D/g, '');
  if (/^4/.test(digits)) {
    return 'visa';
  }
  const two = Number(digits.slice(0, 2));
  const four = Number(digits.slice(0, 4));
  if ((two >= 51 && two <= 55) || (four >= 2221 && four <= 2720)) {
    return 'mastercard';
  }
  return 'unknown';
};

/** Luhn checksum over the digits. */
const passesLuhn = (digits: string): boolean => {
  let sum = 0;
  let double = false;
  for (let i = digits.length - 1; i >= 0; i -= 1) {
    let digit = Number(digits[i]);
    if (double) {
      digit *= 2;
      if (digit > 9) {
        digit -= 9;
      }
    }
    sum += digit;
    double = !double;
  }
  return sum % 10 === 0;
};

export const validateCardNumber = (value: string): string | null => {
  const digits = value.replace(/\D/g, '');
  if (!digits) {
    return 'El número de tarjeta es obligatorio';
  }
  if (digits.length < 13 || digits.length > 19) {
    return 'El número de tarjeta está incompleto';
  }
  return passesLuhn(digits) ? null : 'El número de tarjeta no es válido';
};

/** Expiry as MM/YY, must be current month or later. */
export const validateExpiry = (
  value: string,
  now: Date = new Date(),
): string | null => {
  const match = /^(\d{2})\/(\d{2})$/.exec(value.trim());
  if (!match) {
    return 'Usa el formato MM/AA';
  }
  const month = Number(match[1]);
  const year = 2000 + Number(match[2]);
  if (month < 1 || month > 12) {
    return 'Mes de expiración inválido';
  }
  const endOfMonth = new Date(year, month, 0, 23, 59, 59);
  return endOfMonth >= now ? null : 'La tarjeta está vencida';
};

export const validateCvc = (value: string): string | null =>
  /^\d{3,4}$/.test(value.trim()) ? null : 'CVC inválido';

/** Groups digits in blocks of four for display: 4242 4242 4242 4242. */
export const formatCardNumber = (value: string): string =>
  value
    .replace(/\D/g, '')
    .slice(0, 19)
    .replace(/(\d{4})(?=\d)/g, '$1 ');

/** Auto-inserts the slash while typing MM/YY. */
export const formatExpiry = (value: string): string => {
  const digits = value.replace(/\D/g, '').slice(0, 4);
  if (digits.length <= 2) {
    return digits;
  }
  return `${digits.slice(0, 2)}/${digits.slice(2)}`;
};
