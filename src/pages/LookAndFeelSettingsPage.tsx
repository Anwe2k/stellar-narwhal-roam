"use client";

import React from 'react';
import MobileLayout from '@/components/layout/MobileLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useThemePalette, palettes, PaletteName } from '@/context/ThemeContext';
import { ChevronLeft, Sparkles, Paintbrush, Palette, Heart, Check } from 'lucide-react';
import { Link } from 'react-router-dom';
import { showSuccess } from '@/utils/toast';

const LookAndFeelSettingsPage = () => {
  const { materialYouEnabled, setMaterialYouEnabled, activePalette, setActivePalette, colors } = useThemePalette();

  const handleToggle = (checked: boolean) => {
    setMaterialYouEnabled(checked);
    showSuccess(checked ? 'Material You Dynamic Theming enabled!' : 'Standard Classic Theme restored.');
  };

  const selectPalette = (key: PaletteName) => {
    setActivePalette(key);
    showSuccess(`Applied theme: ${palettes[key].name}`);
  };

  return (
    <MobileLayout title="Look & Feel">
      <div className="space-y-6">
        <div className="flex items-center gap-2 -mt-2">
          <Link to="/profile" className="p-2 -ml-2 rounded-full hover:bg-gray-150 transition-colors">
            <ChevronLeft size={24} className="text-[#6750A4]" />
          </Link>
          <span className="text-sm font-medium text-gray-500">Back to Profile</span>
        </div>

        {/* Introduction Feature Card */}
        <Card className="border-none shadow-none bg-white rounded-3xl overflow-hidden relative">
          <CardContent className="p-6 space-y-4">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-purple-50 text-[#6750A4] rounded-2xl flex items-center justify-center shrink-0">
                <Paintbrush size={24} />
              </div>
              <div className="space-y-1">
                <h3 className="font-bold text-lg text-gray-800">Visual Theming</h3>
                <p className="text-xs text-gray-500 leading-relaxed">
                  Personalize your wellness workspace. Choose between Android's signature dynamic Material You aesthetics or the classic blueprint layout.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Dynamic Theme Toggle Card */}
        <Card className="border-none shadow-none bg-white rounded-3xl overflow-hidden">
          <CardContent className="p-6 space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1 pr-4">
                <div className="flex items-center gap-2">
                  <Sparkles size={16} className="text-purple-500" />
                  <Label htmlFor="material-you-toggle" className="text-sm font-bold text-gray-800 cursor-pointer">
                    Material You Dynamic Theming
                  </Label>
                </div>
                <p className="text-xs text-gray-400">
                  Adapt the system color palette, card shapes, and focus accents automatically.
                </p>
              </div>
              <Switch 
                id="material-you-toggle"
                checked={materialYouEnabled}
                onCheckedChange={handleToggle}
              />
            </div>

            {/* Dynamic Palette Picker (Visible when Material You is on) */}
            {materialYouEnabled && (
              <div className="space-y-4 pt-4 border-t border-gray-100 animate-in fade-in duration-300">
                <div className="flex items-center gap-2">
                  <Palette size={16} className="text-gray-400" />
                  <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Palette Wallpapers</span>
                </div>

                <div className="grid grid-cols-1 gap-3">
                  {(Object.keys(palettes) as PaletteName[]).map((key) => {
                    const item = palettes[key];
                    const isSelected = activePalette === key;
                    return (
                      <button
                        key={key}
                        onClick={() => selectPalette(key)}
                        className={`flex items-center justify-between p-4 rounded-2xl transition-all duration-300 text-left border ${
                          isSelected 
                            ? 'border-purple-200 bg-purple-50/20 shadow-sm' 
                            : 'border-gray-100 hover:border-gray-200 bg-transparent'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          {/* Circle multi-color dot preview */}
                          <div className="flex -space-x-1 shrink-0">
                            <div className="w-5 h-5 rounded-full border border-white" style={{ backgroundColor: item.colors.primary }} />
                            <div className="w-5 h-5 rounded-full border border-white" style={{ backgroundColor: item.colors.secondary }} />
                          </div>
                          <div>
                            <p className="text-sm font-bold text-gray-800">{item.name}</p>
                            <p className="text-[10px] text-gray-400">Matching pastel tones</p>
                          </div>
                        </div>

                        {isSelected && (
                          <div className="w-6 h-6 rounded-full bg-purple-500 flex items-center justify-center text-white">
                            <Check size={14} strokeWidth={3} />
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Live Mock Interactive Screen Preview */}
        <div className="space-y-3">
          <span className="text-xs font-bold text-gray-400 uppercase tracking-wider px-1">Live Interface Preview</span>
          <Card className="border-none shadow-none bg-white rounded-3xl overflow-hidden">
            <CardContent className="p-6">
              {/* Mock Mobile frame */}
              <div 
                className="rounded-2xl p-5 border border-gray-100 space-y-4 shadow-sm transition-colors duration-500"
                style={{ backgroundColor: colors.bg }}
              >
                {/* Mock Header */}
                <div className="flex justify-between items-center">
                  <div className="space-y-0.5">
                    <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Wellness Hub</span>
                    <h4 className="text-base font-black text-gray-800">Dashboard Preview</h4>
                  </div>
                  <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold" style={{ backgroundColor: colors.primary }}>
                    AJ
                  </div>
                </div>

                {/* Mock Card */}
                <div className="bg-white p-4 rounded-2xl shadow-sm space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-xl flex items-center justify-center text-xs" style={{ backgroundColor: colors.secondary, color: colors.secondaryText }}>
                      <Heart size={16} />
                    </div>
                    <span className="text-xs font-bold text-gray-700">Heart Rate</span>
                  </div>
                  <div className="flex items-baseline gap-1">
                    <span className="text-2xl font-black text-gray-800">72</span>
                    <span className="text-[10px] text-gray-400">bpm</span>
                  </div>
                </div>

                {/* Mock Button */}
                <button 
                  disabled
                  className="w-full text-white text-xs font-bold py-2.5 px-4 rounded-xl flex items-center justify-center gap-1.5 transition-colors duration-500 opacity-90"
                  style={{ backgroundColor: colors.primary }}
                >
                  Confirm Choice
                </button>
              </div>
            </CardContent>
          </Card>
        </div>

      </div>
    </MobileLayout>
  );
};

export default LookAndFeelSettingsPage;