"use client";

import React from 'react';
import { NavLink, Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Activity, User, ChevronLeft, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MobileLayoutProps {
  children: React.ReactNode;
  title: string;
  backPath?: string;
  rightAction?: React.ReactNode;
  // Allows disabling default bottom padding if custom FABs/Bars are used
  noPaddingBottom?: boolean;
}

const MobileLayout = ({ children, title, backPath, rightAction, noPaddingBottom = false }: MobileLayoutProps) => {
  const location = useLocation();
  
  const navItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/' },
    { icon: Activity, label: 'Overview', path: '/overview' },
    { icon: User, label: 'Profile', path: '/profile' },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-[#FEF7FF] text-[#1D1B20] font-sans relative overflow-x-hidden pb-24 selection:bg-[#EADDFF]">
      
      {/* Material 3 App Bar (Large/Medium Variant) */}
      <header className="sticky top-0 bg-[#FEF7FF]/90 backdrop-blur-md z-30 px-6 pt-6 pb-4 flex flex-col gap-2 transition-all duration-300 border-b border-[#E6E0E9]/50">
        <div className="flex items-center justify-between min-h-12">
          <div className="flex items-center gap-3">
            {backPath && (
              <Link 
                to={backPath} 
                className="w-11 h-11 rounded-full hover:bg-[#1D1B20]/8 active:scale-95 transition-all flex items-center justify-center text-[#49454F] shrink-0"
                aria-label="Back"
              >
                <ChevronLeft size={24} strokeWidth={2.5} />
              </Link>
            )}
            <h1 className="text-2xl font-bold tracking-tight text-[#1D1B20] font-sans">
              {title}
            </h1>
          </div>
          {rightAction && (
            <div className="flex items-center gap-1.5 shrink-0">
              {rightAction}
            </div>
          )}
        </div>
      </header>

      {/* Main Container */}
      <main className={cn(
        "flex-1 px-4 pt-4 relative animate-in fade-in-50 slide-in-from-bottom-2 duration-300 max-w-md mx-auto w-full",
        noPaddingBottom ? "pb-4" : "pb-12"
      )}>
        {children}
      </main>

      {/* Material 3 Bottom Navigation Bar */}
      <nav className="fixed bottom-0 left-0 right-0 bg-[#F3EDF7] border-t border-[#E6E0E9] py-3 px-6 flex justify-around items-center z-40 shadow-[0_4px_30px_rgba(0,0,0,0.03)] max-w-md mx-auto rounded-t-[24px]">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path || 
                           (item.path !== '/' && location.pathname.startsWith(item.path));
                           
          return (
            <Link
              key={item.path}
              to={item.path}
              className="flex flex-col items-center gap-1.5 group transition-colors relative"
            >
              {/* Active Indicator Pill */}
              <div className={cn(
                "h-8 px-6 rounded-full flex items-center justify-center transition-all duration-300 relative overflow-hidden",
                isActive 
                  ? "bg-[#EADDFF] text-[#21005D]" 
                  : "text-[#49454F] hover:bg-[#49454F]/8"
              )}>
                <item.icon 
                  size={22} 
                  strokeWidth={isActive ? 2.5 : 2} 
                  className={cn("transition-transform duration-300", isActive ? "scale-105" : "group-hover:scale-105")}
                />
              </div>
              
              {/* M3 Navigation Label */}
              <span className={cn(
                "text-xs font-bold tracking-wide transition-all duration-200",
                isActive 
                  ? "text-[#1D1B20] font-extrabold" 
                  : "text-[#49454F] font-semibold"
              )}>
                {item.label}
              </span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
};

export default MobileLayout;