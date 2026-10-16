// Utility functions for Binary Lab (BitLab TJKT)

export const BIT_WEIGHTS = [128, 64, 32, 16, 8, 4, 2, 1] as const;
export const BIT_POWERS = [7, 6, 5, 4, 3, 2, 1, 0] as const;

/**
 * Convert array of 8 bits [b7..b0] to decimal number
 */
export function bitsToDecimal(bits: number[]): number {
  return bits.reduce((total, bit, index) => {
    return total + (bit ? BIT_WEIGHTS[index] : 0);
  }, 0);
}

/**
 * Convert decimal number (0..255) to array of 8 bits [b7..b0]
 */
export function decimalToBits(decimal: number, length = 8): number[] {
  const clamped = Math.max(0, Math.min(Math.floor(decimal) || 0, Math.pow(2, length) - 1));
  const binaryString = clamped.toString(2).padStart(length, '0');
  return binaryString.split('').map(char => (char === '1' ? 1 : 0));
}

/**
 * Generate step-by-step multiplication & addition for Binary to Decimal
 */
export interface BinaryToDecimalStep {
  position: number; // 7..0
  power: number; // 2^7
  weight: number; // 128
  bit: number; // 0 or 1
  calculation: string; // "1 × 128 = 128"
  result: number;
}

export function generateBinaryToDecimalBreakdown(bits: number[]) {
  const steps: BinaryToDecimalStep[] = [];
  let total = 0;

  bits.forEach((bit, index) => {
    const weight = BIT_WEIGHTS[index];
    const power = BIT_POWERS[index];
    const result = bit ? weight : 0;
    total += result;

    steps.push({
      position: 7 - index,
      power,
      weight,
      bit,
      calculation: `${bit} × ${weight} = ${result}`,
      result,
    });
  });

  const activeWeights = bits
    .map((bit, idx) => (bit ? BIT_WEIGHTS[idx] : null))
    .filter(val => val !== null) as number[];

  const formulaString = activeWeights.length > 0 
    ? `${activeWeights.join(' + ')} = ${total}` 
    : 'Semua bit 0 = 0';

  return { steps, total, formulaString, activeWeights };
}

/**
 * Generate steps for Subtraction Method (Teknik Subnetting TJKT)
 */
export interface SubtractionStep {
  weight: number;
  remainingBefore: number;
  comparison: boolean; // remaining >= weight
  bitValue: 0 | 1;
  remainingAfter: number;
  explanation: string;
}

export function generateSubtractionBreakdown(decimal: number) {
  const clamped = Math.max(0, Math.min(255, Math.floor(decimal) || 0));
  let remainder = clamped;
  const steps: SubtractionStep[] = [];

  BIT_WEIGHTS.forEach((weight) => {
    const before = remainder;
    const canSubtract = remainder >= weight;
    const bitValue = canSubtract ? 1 : 0;
    
    if (canSubtract) {
      remainder -= weight;
    }

    steps.push({
      weight,
      remainingBefore: before,
      comparison: canSubtract,
      bitValue,
      remainingAfter: remainder,
      explanation: canSubtract
        ? `Karena ${before} ≥ ${weight}, bit bernilai 1. Sisa: ${before} - ${weight} = ${remainder}`
        : `Karena ${before} < ${weight}, bit bernilai 0. Sisa tetap: ${before}`,
    });
  });

  return { decimal: clamped, steps };
}

/**
 * Generate steps for Division by 2 Method (Modulo / Sisa Bagi)
 */
export interface DivisionStep {
  stepNumber: number;
  dividend: number;
  quotient: number;
  remainder: number;
}

export function generateDivisionBreakdown(decimal: number) {
  let num = Math.max(0, Math.min(65535, Math.floor(decimal) || 0));
  if (num === 0) {
    return [
      { stepNumber: 1, dividend: 0, quotient: 0, remainder: 0 }
    ];
  }

  const steps: DivisionStep[] = [];
  let step = 1;

  while (num > 0) {
    const quotient = Math.floor(num / 2);
    const remainder = num % 2;
    steps.push({
      stepNumber: step++,
      dividend: num,
      quotient,
      remainder,
    });
    num = quotient;
  }

  return steps;
}

/**
 * Common Subnet Mask Presets in TJKT
 */
export const SUBNET_PRESETS = [
  { prefix: "/24", decimal: 255, label: "255.255.255.0 (/24)", hostCount: 254 },
  { prefix: "/25", decimal: 128, label: "255.255.255.128 (/25)", hostCount: 126 },
  { prefix: "/26", decimal: 192, label: "255.255.255.192 (/26)", hostCount: 62 },
  { prefix: "/27", decimal: 224, label: "255.255.255.224 (/27)", hostCount: 30 },
  { prefix: "/28", decimal: 240, label: "255.255.255.240 (/28)", hostCount: 14 },
  { prefix: "/29", decimal: 248, label: "255.255.255.248 (/29)", hostCount: 6 },
  { prefix: "/30", decimal: 252, label: "255.255.255.252 (/30)", hostCount: 2 },
];
