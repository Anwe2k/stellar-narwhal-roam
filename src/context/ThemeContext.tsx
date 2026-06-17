"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';

export type PaletteName = 'lavender' | 'mint' | 'ocean' | 'peach' | 'amber';

export interface ThemeColors {
  primary: string;
  secondary: string;
  secondaryText: string;
  bg: string;
  accentLight: string;
  accentDark: string;
}

export const palettes: Record<PaletteName, { name: string; colors: ThemeColors }> = {
  lavender: {
    name: 'Aether Lavender',
    colors: {
      primary: '#6750A4',
      secondary: '#EADDFF',
      secondaryText: '#21005D',
      bg: '#F7F9FC',
      accentLight: '#EADDFF',
      accentDark: '#D0BCFF',
    }
  },
  mint: {
    name: 'Mint Botanical',
    colors: {
      primary: '#006B4F',
      secondary: '#BCF2CD',
      secondaryText: '#002114',
      bg: '#F3FDF7',
      accentLight: '#BCF2CD',
      accentDark: '#8CE2A8',
    }
  },
  ocean: {
    name: 'Ocean Breeze',
    colors: {
      primary: '#0061A4',
      secondary: '#D1E4FF',
      secondaryText: '#001D36',
      bg: '#F4F9FF',
      accentLight: '#D1E4FF',
      accentDark: '#A1C9FF',
    }
  },
  peach: {
    name: 'Sunset Peach',
    colors: {
      primary: '#9C412B',
      secondary: '#FFDAD2',
      secondaryText: '#3F0400',
      bg: '#FFFBF9',
      accentLight: '#FFDAD2',
      accentDark: '#FFB4A2',
    }
  },
  amber: {
    name: 'Maple Amber',
    colors: {
      primary: '#7E5700',
      secondary: '#FFDEA3',
      secondaryText: '#281900',
      bg: '#FFFDF6',
      accentLight: '#FFDEA3',
      accentDark: '#E1C07C',
    }
  }
};

interface ThemeContextType {
  materialYouEnabled: boolean;
  setMaterialYouEnabled: (enabled: boolean) => void;
  activePalette: PaletteName;
  setActivePalette: (palette: PaletteName) => void;
  colors: ThemeColors;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [materialYouEnabled, setMaterialYouEnabled] = useState<boolean>(() => {
    const saved = localStorage.getItem('material_you_enabled');
    return saved ? JSON.parse(saved) : true; // Default to active for gorgeous presentation
  });

  const [activePalette, setActivePalette] = useState<PaletteName>(() => {
    const saved = localStorage.getItem('material_you_palette');
    return (saved as PaletteName) || 'lavender';
  });

  useEffect(() => {
    localStorage.setItem('material_you_enabled', JSON.stringify(materialYouEnabled));
  }, [materialYouEnabled]);

  useEffect(() => {
    localStorage.setItem('material_you_palette', activePalette);
  }, [activePalette]);

  const colors = materialYouEnabled 
    ? palettes[activePalette].colors 
    : palettes['lavender'].colors; // fall back to standard color styling if disabled

  // Dynamically inject custom CSS variables into a global style tag
  // to instantly override hardcoded color classes safely and cleanly!
  useEffect(() => {
    const styleId = 'material-you-dynamic-overrides';
    let styleElement = document.getElementById(styleId) as HTMLStyleElement;
    
    if (!styleElement) {
      styleElement = document.createElement('style');
      styleElement.id = styleId;
      document.head.appendChild(styleElement);
    }

    if (materialYouEnabled) {
      styleElement.innerHTML = `
        :root {
          --primary-override: ${colors.primary};
          --secondary-override: ${colors.secondary};
          --secondary-text-override: ${colors.secondaryText};
          --bg-override: ${colors.bg};
          --accent-light-override: ${colors.accentLight};
          --accent-dark-override: ${colors.accentDark};
        }

        /* Dynamically override standard colors with active Material You palette */
        .bg-\\[\\#F7F9FC\\] { background-color: var(--bg-override) !important; }
        .bg-\\[\\#6750A4\\] { background-color: var(--primary-override) !important; }
        .bg-\\[\\#EADDFF\\] { background-color: var(--secondary-override) !important; }
        
        .text-\\[\\#6750A4\\] { color: var(--primary-override) !important; }
        .text-\\[\\#21005D\\] { color: var(--secondary-text-override) !important; }
        
        /* Layout headers & buttons */
        header .text-\\[\\#6750A4\\] { color: var(--primary-override) !important; }
        nav .text-\\[\\#6750A4\\] { color: var(--primary-override) !important; }
        nav .bg-\\[\\#EADDFF\\] { background-color: var(--secondary-override) !important; }
        
        /* Summary gradients & pulses */
        .from-\\[\\#EADDFF\\] { --tw-gradient-from: var(--accent-light-override) !important; }
        .to-\\[\\#D0BCFF\\]\\/60 { --tw-gradient-to: rgba(${hexToRgb(colors.accentDark)}, 0.6) !important; }
        .text-\\[\\#21005D\\]\\/80 { color: rgba(${hexToRgb(colors.secondaryText)}, 0.8) !important; }
        
        /* Active overview sections */
        .text-\\[\\#00512C\\] { color: var(--primary-override) !important; }
        .bg-\\[\\#E2F1E8\\] { background-color: var(--secondary-override) !important; }
        
        /* Material focus states */
        .focus-visible\\:ring-\\[\\#6750A4\\]:focus-visible { --tw-ring-color: var(--primary-override) !important; }
        select:focus { border-color: var(--primary-override) !important; --tw-ring-color: var(--primary-override) !important; }
      `;
    } else {
      styleElement.innerHTML = ''; // Revert to standard colors
    }
  }, [materialYouEnabled, activePalette, colors]);

  // Utility to convert hex value to RGB array for alpha transparencies
  function hexToRgb(hex: string): string {
    const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
    const fullHex = hex.replace(shorthandRegex, (_, r, g, b) => r + r + g + g + b + b);
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(fullHex);
    return result 
      ? `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}` 
      : '103, 80, 164';
  }

  return (
    <ThemeContext.Provider value={{
      materialYouEnabled,
      setMaterialYouEnabled,
      activePalette,
      setActivePalette,
      colors
    }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useThemePalette = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useThemePalette must be used within a ThemeProvider');
  }
  return context;
};