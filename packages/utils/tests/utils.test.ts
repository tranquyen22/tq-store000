import { describe, it, expect } from 'vitest';
import { maskPhoneNumber, maskCitizenID, maskEmail, formatVND } from '../src';

describe('@tq-platform/utils Unit Tests', () => {
  describe('Data Masking Utilities', () => {
    it('should mask phone numbers correctly', () => {
      expect(maskPhoneNumber('0987654321')).toBe('098***4321');
      expect(maskPhoneNumber('0912345678')).toBe('091***5678');
      expect(maskPhoneNumber(null)).toBe('N/A');
    });

    it('should mask citizen ID numbers correctly', () => {
      expect(maskCitizenID('036123456789')).toBe('036*******89');
      expect(maskCitizenID(null)).toBe('N/A');
    });

    it('should mask email addresses correctly', () => {
      expect(maskEmail('nguyen.van.a@gmail.com')).toBe('ngu***@gmail.com');
      expect(maskEmail('info@tqplatform.vn')).toBe('inf***@tqplatform.vn');
      expect(maskEmail('ab@domain.com')).toBe('a***@domain.com');
      expect(maskEmail(null)).toBe('N/A');
    });
  });

  describe('Currency & Format Utilities', () => {
    it('should format VND currency correctly', () => {
      expect(formatVND(1500000)).toContain('1.500.000');
      expect(formatVND(0)).toContain('0');
      expect(formatVND('50000')).toContain('50.000');
    });
  });
});
