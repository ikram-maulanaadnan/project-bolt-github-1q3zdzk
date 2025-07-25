// File: src/utils/security.ts
import * as bcrypt from 'bcrypt-ts';

// Security configuration
export const SECURITY_CONFIG = {
  SALT_ROUNDS: 12,
  MAX_LOGIN_ATTEMPTS: 5,
  LOCKOUT_DURATION: 15 * 60 * 1000, // 15 minutes
  SESSION_TIMEOUT: 24 * 60 * 60 * 1000, // 24 hours
  PASSWORD_MIN_LENGTH: 8,
  PASSWORD_REQUIREMENTS: {
    minLength: 8,
    requireUppercase: true,
    requireLowercase: true,
    requireNumbers: true,
    requireSpecialChars: true
  }
};

// Password strength validation
export const validatePasswordStrength = (password: string): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];
  const { minLength, requireUppercase, requireLowercase, requireNumbers, requireSpecialChars } = SECURITY_CONFIG.PASSWORD_REQUIREMENTS;

  if (password.length < minLength) {
    errors.push(`Kata sandi harus minimal ${minLength} karakter`);
  }
  if (requireUppercase && !/[A-Z]/.test(password)) {
    errors.push('Kata sandi harus mengandung huruf besar');
  }
  if (requireLowercase && !/[a-z]/.test(password)) {
    errors.push('Kata sandi harus mengandung huruf kecil');
  }
  if (requireNumbers && !/\d/.test(password)) {
    errors.push('Kata sandi harus mengandung angka');
  }
  if (requireSpecialChars && !/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
    errors.push('Kata sandi harus mengandung karakter khusus');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};