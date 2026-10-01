import { describe, expect, it } from 'vitest';
import { createRepairSchema } from '../src/shared/validation';

describe('createRepairSchema', () => {
  it('accepts and normalizes a complete repair intake', () => {
    const result = createRepairSchema.parse({
      customerName: '  Ana García ',
      customerPhone: '',
      deviceCategory: 'smartphone',
      deviceBrand: ' Apple ',
      deviceModel: ' iPhone 13 ',
      issue: 'No enciende',
    });

    expect(result.customerName).toBe('Ana García');
    expect(result.deviceBrand).toBe('Apple');
  });

  it('rejects missing customer and device details', () => {
    const result = createRepairSchema.safeParse({
      customerName: ' ',
      deviceCategory: 'smartphone',
      deviceBrand: '',
      deviceModel: '',
      issue: '',
    });

    expect(result.success).toBe(false);
  });

  it('rejects unsupported device categories', () => {
    const result = createRepairSchema.safeParse({
      customerName: 'Ana',
      deviceCategory: 'wearable',
      deviceBrand: 'Acme',
      deviceModel: 'Watch 1',
      issue: 'No carga',
    });

    expect(result.success).toBe(false);
  });
});
