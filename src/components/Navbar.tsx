import { useState, useEffect } from 'react';
import { Menu, X, Sun, Moon, Briefcase, BookOpen, Layers, LineChart, Home, MessageCircle } from 'lucide-react';
import FigureOutLogo from './FigureOutLogo';
import { ViewTab } from '../types';
import { analytics } from '../utils/analytics';

interface NavbarProps {
  currentTab: ViewTab;
  setTab: (tab: ViewTab) => void;
  darkMode: boolean;
  setDarkMode: (dark: boolean) => void;
}

export default function Navbar({ currentTab, setTab, darkMode, setDarkMode }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 15);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const selectTab = (tab: ViewTab) => {
    setTab(tab);
    setIsOpen(false);
    analytics.trackPageView(tab);
  };

  const toggleDarkMode = () => {
    const nextVal = !darkMode;
    setDarkMode(nextVal);
    analytics.trackClick('dark-mode-toggle', nextVal ? 'Dark Mode' : 'Light Mode');
  };

  const navItems = [
    { id: 'home', label: 'Studio Home', icon: Home },
    { id: 'projects', label: 'Portfolio', icon: Briefcase },
    { id: 'blog', label: 'Insights Blog', icon: BookOpen },
    { id: 'dashboard', label: 'Client Dashboard', icon: Layers },
    { id: 'analytics', label: 'Live telemetry', icon: LineChart },
  ] as const;

  return (
    <nav
      className={`fixed top-0 left-0 z-50 w-full transition-all duration-300 ${
        isScrolled
          ? 'bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md border-b border-zinc-200/50 dark:border-zinc-800/50 py-3 shadow-md'
          : 'bg-transparent py-5'
      }`}
      id="navbar-container"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-12 items-center justify-between">
          {/* Logo & Brand */}
          <div
            className="flex items-center gap-3 cursor-pointer group"
            onClick={() => selectTab('home')}
            id="brand-header-trigger"
          >
            <div className="transform transition-transform duration-500 group-hover:rotate-12">
              <FigureOutLogo size={38} />
            </div>
            <div className="flex flex-col">
              <span className="font-sans text-lg font-bold tracking-tight text-zinc-950 dark:text-white">
                Figure Out
              </span>
              <span className="font-mono text-[9px] uppercase tracking-widest text-[#0fb58c]">
                Web Studio
              </span>
            </div>
          </div>

          {/* Desktop Navigation links */}
          <div className="hidden md:flex items-center gap-1.5" id="desktop-menu-list">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  id={`nav-btn-${item.id}`}
                  onClick={() => selectTab(item.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg font-sans text-sm font-medium transition-all duration-200 cursor-pointer ${
                    isActive
                      ? 'bg-zinc-900 text-white dark:bg-white dark:text-zinc-950 shadow-sm'
                      : 'text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-900'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </button>
              );
            })}
          </div>

          {/* Right Action Widgets */}
          <div className="hidden md:flex items-center gap-3" id="desktop-right-widgets">
            {/* Direct WhatsApp Contact */}
            <button
              id="navbar-whatsapp-direct-btn"
              onClick={() => {
                const phone = (localStorage.getItem('figureout_whatsapp') || '+919284140185').replace(/[^\d+]/g, '');
                const waUrl = `https://wa.me/${phone}?text=Hello%20Figure%20Out%2520Studio!%20I%20visited%2520your%20expert%20web%20platform%20and%20would%20like%20to%20collaborate.`;
                window.open(waUrl, '_blank', 'noopener,noreferrer');
                analytics.trackClick('navbar-whatsapp-redirect', phone);
              }}
              className="px-3.5 py-2 rounded-lg border border-emerald-500/20 text-emerald-500 hover:text-white hover:bg-emerald-500 hover:border-emerald-500 transition-all cursor-pointer flex items-center gap-2 font-sans text-xs font-bold"
              title="Instant WhatsApp Connection"
            >
              <MessageCircle className="h-4 w-4" />
              <span>WhatsApp Chat</span>
            </button>

            {/* Theme Toggle Button */}
            <button
              id="theme-dark-mode-btn"
              onClick={toggleDarkMode}
              className="p-2.5 rounded-lg border border-zinc-200 dark:border-zinc-800 text-zinc-600 hover:text-zinc-950 dark:text-zinc-400 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors cursor-pointer"
              aria-label="Toggle Theme Schema"
            >
              {darkMode ? <Sun className="h-4.5 w-4.5" /> : <Moon className="h-4.5 w-4.5" />}
            </button>
          </div>

          {/* Mobile Right layout (Toggles + Buttons) */}
          <div className="flex md:hidden items-center gap-2">
            <button
              id="mobile-theme-toggle-btn"
              onClick={toggleDarkMode}
              className="p-2 rounded-lg border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-900 cursor-pointer"
            >
              {darkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </button>

            <button
              id="mobile-drawer-hamburger-btn"
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-lg border border-zinc-200 dark:border-zinc-800 text-zinc-800 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-900 focus:outline-none cursor-pointer"
            >
              {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {isOpen && (
        <div
          className="md:hidden absolute top-full left-0 w-full bg-white dark:bg-zinc-950 border-b border-zinc-200 dark:border-zinc-800 shadow-xl"
          id="mobile-navigation-drawer"
        >
          <div className="space-y-1.5 px-4 py-5" id="mobile-menu-list">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  id={`mobile-nav-btn-${item.id}`}
                  onClick={() => selectTab(item.id)}
                  className={`flex w-full items-center gap-3 px-4 py-3 rounded-lg font-sans text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-zinc-900 text-white dark:bg-white dark:text-zinc-950 shadow-sm'
                      : 'text-zinc-700 hover:text-zinc-900 dark:text-zinc-300 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-900'
                  }`}
                >
                  <Icon className="h-5 w-5 text-emerald-500" />
                  {item.label}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </nav>
  );
}
