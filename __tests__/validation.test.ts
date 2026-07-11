import {
  detectCardBrand,
  formatCardNumber,
  formatExpiry,
  validateCardNumber,
  validateCvc,
  validateEmail,
  validateExpiry,
  validateOptionalPhone,
  validateRequired,
} from '@lib';

describe('shipping validators', () => {
  test('required fields reject blanks', () => {
    expect(validateRequired('  ', 'La ciudad')).toContain('obligatorio');
    expect(validateRequired('Bogotá', 'La ciudad')).toBeNull();
  });

  test('email format aligned with IsEmail', () => {
    expect(validateEmail('')).toContain('obligatorio');
    expect(validateEmail('no-es-email')).toContain('válido');
    expect(validateEmail('cliente@correo.com')).toBeNull();
  });

  test('phone is optional but validated when present', () => {
    expect(validateOptionalPhone('')).toBeNull();
    expect(validateOptionalPhone('12')).toContain('válido');
    expect(validateOptionalPhone('300 123 4567')).toBeNull();
  });
});

describe('card validators', () => {
  test('detects VISA and Mastercard ranges', () => {
    expect(detectCardBrand('4242 4242 4242 4242')).toBe('visa');
    expect(detectCardBrand('5555 5555 5555 4444')).toBe('mastercard');
    expect(detectCardBrand('2221 0000 0000 0009')).toBe('mastercard');
    expect(detectCardBrand('3782 822463 10005')).toBe('unknown');
  });

  test('card number requires Luhn-valid structure', () => {
    expect(validateCardNumber('')).toContain('obligatorio');
    expect(validateCardNumber('4242 4242')).toContain('incompleto');
    expect(validateCardNumber('4242 4242 4242 4241')).toContain('no es válido');
    expect(validateCardNumber('4242 4242 4242 4242')).toBeNull();
  });

  test('expiry must be MM/YY in the future', () => {
    const now = new Date(2026, 6, 15);
    expect(validateExpiry('13/30', now)).toContain('inválido');
    expect(validateExpiry('0630', now)).toContain('MM/AA');
    expect(validateExpiry('06/25', now)).toContain('vencida');
    expect(validateExpiry('07/26', now)).toBeNull();
    expect(validateExpiry('12/29', now)).toBeNull();
  });

  test('cvc accepts 3-4 digits', () => {
    expect(validateCvc('12')).toContain('inválido');
    expect(validateCvc('123')).toBeNull();
    expect(validateCvc('1234')).toBeNull();
  });

  test('formatters group the number and slash the expiry', () => {
    expect(formatCardNumber('4242424242424242')).toBe('4242 4242 4242 4242');
    expect(formatExpiry('0629')).toBe('06/29');
    expect(formatExpiry('06')).toBe('06');
  });
});
