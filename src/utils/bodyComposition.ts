"use client";

/**
 * Relative Fat Mass (RFM) - Cedars-Sinai formula
 * Accurate estimator of body fat percentage using just height and waist.
 */
export const calculateRFM = (heightCm: number, waistCm: number, sex: string): number | null => {
  if (!heightCm || !waistCm || heightCm <= 0 || waistCm <= 0) return null;
  
  const isFemale = sex.toLowerCase() === 'female';
  const baseFactor = isFemale ? 76 : 64;
  
  const rfm = baseFactor - (20 * (heightCm / waistCm));
  return parseFloat(Math.max(2, Math.min(60, rfm)).toFixed(1));
};

/**
 * Waist-to-Height Ratio (WHtR)
 * Excellent health marker indicating visceral fat distribution. Target is < 0.5.
 */
export const calculateWHtR = (heightCm: number, waistCm: number): number | null => {
  if (!heightCm || !waistCm || heightCm <= 0 || waistCm <= 0) return null;
  return parseFloat((waistCm / heightCm).toFixed(2));
};

export const getWHtRStatus = (whtr: number) => {
  if (whtr < 0.4) {
    return { label: 'Slim / Underweight', color: 'text-amber-500', bg: 'bg-amber-50' };
  } else if (whtr >= 0.4 && whtr <= 0.49) {
    return { label: 'Healthy', color: 'text-emerald-500', bg: 'bg-emerald-50' };
  } else if (whtr >= 0.5 && whtr <= 0.59) {
    return { label: 'Increased Risk', color: 'text-orange-500', bg: 'bg-orange-50' };
  } else {
    return { label: 'High Risk / Abdominal Obesity', color: 'text-red-500', bg: 'bg-red-50' };
  }
};