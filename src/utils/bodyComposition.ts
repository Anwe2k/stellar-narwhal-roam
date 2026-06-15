"use client";

/**
 * Calculates Relative Fat Mass (RFM)
 * RFM is a simple and validated body fat estimation method based on height and waist.
 * Height and Waist must be in the same unit (typically cm).
 */
export const calculateRFM = (heightCm: number, waistCm: number, sex: string): number | null => {
  if (!heightCm || !waistCm || waistCm <= 0 || heightCm <= 0) return null;
  const isFemale = sex.toLowerCase() === 'female';
  const baseValue = isFemale ? 76 : 64;
  const result = baseValue - (20 * (heightCm / waistCm));
  return Math.round(result * 10) / 10;
};

/**
 * Calculates Waist-to-Height Ratio (WHtR)
 */
export const calculateWHtR = (heightCm: number, waistCm: number): number | null => {
  if (!heightCm || !waistCm || waistCm <= 0 || heightCm <= 0) return null;
  return Math.round((waistCm / heightCm) * 100) / 100;
};

export interface WHtRStatus {
  label: string;
  colorClass: string;
  bgClass: string;
}

/**
 * Provides clinical risk classification based on Waist-to-Height Ratio (WHtR)
 */
export const getWHtRStatus = (whtr: number): WHtRStatus => {
  if (whtr < 0.4) {
    return {
      label: "Extremely Slim",
      colorClass: "text-[#44474E]",
      bgClass: "bg-gray-100"
    };
  }
  if (whtr < 0.5) {
    return {
      label: "Healthy Range",
      colorClass: "text-[#00512C]",
      bgClass: "bg-[#E2F1E8]"
    };
  }
  if (whtr < 0.6) {
    return {
      label: "Increased Health Risk",
      colorClass: "text-[#9A6B00]",
      bgClass: "bg-amber-50"
    };
  }
  return {
    label: "High Health Risk",
    colorClass: "text-[#BA1A1A]",
    bgClass: "bg-[#FFDAD6]"
  };
};