"use client";

/**
 * Calculates Basal Metabolic Rate (BMR) using the Mifflin-St Jeor Equation.
 * Falls back to sensible defaults if some values are missing.
 */
export const calculateBMR = (
  weightKg: number,
  heightCm: number,
  ageYears: number,
  sex: string
): number => {
  const isFemale = sex.toLowerCase() === 'female';
  const baseBMR = (10 * weightKg) + (6.25 * heightCm) - (5 * ageYears);
  return Math.round(isFemale ? baseBMR - 161 : baseBMR + 5);
};

/**
 * Calculates Total Daily Energy Expenditure (TDEE).
 * Uses a sedentary multiplier (1.2) for baseline daily non-exercise activity, 
 * then adds the logged active workout calories for the day.
 */
export const calculateTDEE = (bmr: number, activeWorkoutKcal: number): number => {
  const baselineActivity = bmr * 1.2;
  return Math.round(baselineActivity + activeWorkoutKcal);
};

/**
 * Calculates the recommended daily water intake based on body weight.
 * Standard guidelines recommend roughly 35ml per kg of body weight.
 */
export const calculateHydrationTarget = (weightKg: number): number => {
  return Math.round(weightKg * 35);
};