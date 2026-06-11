"use client";

import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Activity, User } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MobileLayoutProps {
  children: React.ReactNode;
  title: string;
}

const MobileLayout = ({ children, title }: MobileLayoutProps) => {
  const navItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/' },
    { icon: Activity, label: 'Overview', path: '/overview' },
    { icon: User, label: 'Profile', path: '/profile' },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-[#F7F9FC] text-[#1A1C1E] font-sans pb-20">
      {/* Header */}
      <header className="px-6 pt-8 pb-4 sticky top-0 bg-[#F7F9FC]/80 backdrop-blur-md z-10">
        <h1 className="text-3xl font-bold tracking-tight text-[#1A1C1E]">{title}</h1>
      </header>

      {/* Main Content */}
      <main className="flex-1 px-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
        {children}
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 px-6 py-3 flex justify-around items-center z-20 shadow-[0_-4px_20px_rgba(0,0,0,0.03)]">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              cn(
                "flex flex-col items-center gap-1 transition-all duration-300 group",
                isActive ? "text-[#6750A4]" : "text-[#44474E]"
              )
            }
          >
            {({ isActive }) => (
              <>
                <div className={cn(
                  "p-1 px-5 rounded-full transition-all duration-300",
                  isActive ? "bg-[#EADDFF]" : "group-hover:bg-gray-100"
                )}>
                  <item.icon size={24} strokeWidth={isActive ? 2.5 : 2} />
                </div>
                <span className="text-xs font-medium">{item.label}</span>
              </>
            )}
          </NavLink>
        ))}
      </nav>
    </div>
  );
};

export default MobileLayout;