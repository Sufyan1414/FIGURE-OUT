import React, { useState, useEffect } from 'react';
import { Mail, MessageCircle, Settings, X, Check, ArrowRight, Sparkles } from 'lucide-react';
import { analytics } from '../utils/analytics';
import { motion, AnimatePresence } from 'motion/react';

export default function FloatingContactHub() {
  const [isOpen, setIsOpen] = useState(false);
  const [showConfig, setShowConfig] = useState(false);
  
  // Custom WhatsApp configuration persisted in localStorage so the user can test their real number instantly
  const [whatsappNumber, setWhatsappNumber] = useState(() => {
    try {
      return localStorage.getItem('figureout_whatsapp') || '+919284140185';
    } catch {
      return '+919284140185';
    }
  });

  const [tempNumber, setTempNumber] = useState(whatsappNumber);
  const [isSaved, setIsSaved] = useState(false);
  const [quickMessage, setQuickMessage] = useState('');

  const saveWhatsapp = (e: React.FormEvent) => {
    e.preventDefault();
    // Sanitize digits only (optionally keeping +)
    let sanitized = tempNumber.trim();
    if (sanitized) {
      setWhatsappNumber(sanitized);
      try {
        localStorage.setItem('figureout_whatsapp', sanitized);
      } catch {}
      setIsSaved(true);
      analytics.trackClick('whatsapp-number-config-updated', sanitized);
      setTimeout(() => setIsSaved(false), 2000);
      setShowConfig(false);
    }
  };

  const handleWhatsAppRedirect = () => {
    analytics.trackClick('floating-whatsapp-redirect', whatsappNumber);
    // Sanitize phone number for URL (remove non-digits except +)
    const sanitizedPhone = whatsappNumber.replace(/[^\d+]/g, '');
    const prefillText = quickMessage.trim() || 'Hello Figure Out Studio, I would like to design and build a high-performance web platform.';
    const encodedText = encodeURIComponent(prefillText);
    const waUrl = `https://wa.me/${sanitizedPhone}?text=${encodedText}`;
    
    // Smooth high-fidelity redirection trigger
    window.open(waUrl, '_blank', 'noopener,noreferrer');
  };

  const handleGmailRedirect = () => {
    analytics.trackClick('floating-gmail-redirect', 'figureoutstore14@gmail.com');
    const emailTarget = 'figureoutstore14@gmail.com';
    const prefillText = quickMessage.trim() || 'Hello Figure Out Studio, I have inspected your premium web portfolio and would like to receive a proposal checklist.';
    const subject = 'Inquiry from Bespoke Portfolio Hub';
    const mailtoUrl = `mailto:${emailTarget}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(prefillText)}`;
    
    window.location.href = mailtoUrl;
  };

  return (
    <div className="fixed bottom-6 right-6 z-[9990] font-sans" id="floating-contact-hub-wrapper">
      {/* Absolute animated toggle button with pulsing premium layout ring */}
      <div className="relative flex items-center justify-center">
        {/* Intuitively gorgeous glowing outline glow to guide and capture user attention */}
        <motion.div
          className="absolute -inset-1.5 rounded-full bg-emerald-500/25 blur-[3px] z-0"
          animate={{
            scale: [1, 1.22, 1],
            opacity: [0.35, 0.75, 0.35],
          }}
          transition={{
            duration: 2.8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        <motion.button
          id="toggle-contact-hub-btn"
          onClick={() => {
            setIsOpen(!isOpen);
            analytics.trackClick('contact-hub-toggle', isOpen ? 'Close' : 'Open');
          }}
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          whileHover={{ 
            scale: 1.08, 
            y: -2,
            transition: { duration: 0.2, ease: "easeOut" } 
          }}
          whileTap={{ scale: 0.94 }}
          transition={{
            type: "spring",
            stiffness: 280,
            damping: 18
          }}
          className={`relative p-4 rounded-full shadow-2xl flex items-center justify-center cursor-pointer border border-emerald-500/20 text-white z-10 ${
            isOpen 
              ? 'bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 rotate-90' 
              : 'bg-gradient-to-tr from-emerald-500 to-[#0fb58c] hover:shadow-emerald-500/30'
          }`}
        >
          {isOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <div className="relative flex items-center justify-center">
              <MessageCircle className="h-6 w-6" />
              <span className="absolute -top-1.5 -right-1.5 flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-500"></span>
              </span>
            </div>
          )}
        </motion.button>
      </div>

      {/* Main Glassmorphism popup with elegant spring-based enter/exit physics */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: 24, scale: 0.94, filter: 'blur(3px)' }}
            animate={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
            exit={{ opacity: 0, y: 20, scale: 0.94, filter: 'blur(3px)' }}
            transition={{
              type: "spring",
              damping: 24,
              stiffness: 320
            }}
            className="absolute bottom-19 right-0 w-80 sm:w-88 bg-white/95 dark:bg-zinc-950/95 backdrop-blur-xl border border-zinc-200/80 dark:border-zinc-800/80 rounded-3xl shadow-2xl p-6 origin-bottom-right z-20 text-left"
            id="floating-contact-hub-card"
          >
            {/* Header */}
            <div className="flex items-center justify-between pb-3.5 border-b border-zinc-100 dark:border-zinc-900 mb-4">
              <div className="flex items-center gap-2">
                <div className="p-1 px-2 rounded-md bg-[#0fb58c]/10 text-[#0fb58c] font-mono text-[10px] uppercase font-bold tracking-wider">
                  Direct Sync Mode
                </div>
                <Sparkles className="h-3.5 w-3.5 text-amber-500" />
              </div>

              {/* Config setup gear icon */}
              <button
                id="toggle-hub-config-btn"
                onClick={() => {
                  setShowConfig(!showConfig);
                  setTempNumber(whatsappNumber);
                }}
                className="p-1.5 text-zinc-400 hover:text-emerald-500 transition-colors rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-900"
                title="Configure Custom WhatsApp Number"
              >
                <Settings className="h-4 w-4" />
              </button>
            </div>

            {/* Configuration Form screen */}
            {showConfig ? (
              <form onSubmit={saveWhatsapp} className="space-y-3 p-1 bg-zinc-50 dark:bg-zinc-900/50 rounded-2xl mb-4">
                <div className="px-3 pt-3 flex items-center justify-between">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-amber-500 font-extrabold">
                    Config Whatsapp
                  </span>
                  <button 
                    type="button" 
                    onClick={() => setShowConfig(false)}
                    className="text-zinc-400 hover:text-zinc-600 text-[10px]"
                  >
                    Cancel
                  </button>
                </div>
                
                <div className="p-3 space-y-2">
                  <p className="text-[10px] leading-relaxed text-zinc-400">
                    Instantly save your team's custom WhatsApp layout digits to test real chat redirection seamlessly in your browser frame.
                  </p>
                  <div className="relative">
                    <input
                      type="text"
                      id="whatsapp-config-input"
                      value={tempNumber}
                      onChange={(e) => setTempNumber(e.target.value)}
                      placeholder="e.g. +919284140185"
                      className="w-full bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl px-3 py-2 text-xs font-mono text-zinc-900 dark:text-white focus:outline-none focus:border-amber-500"
                    />
                    <button
                      type="submit"
                      className="absolute right-1.5 top-1/2 -translate-y-1/2 p-1.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg transition-colors"
                    >
                      <Check className="h-3 w-3" />
                    </button>
                  </div>
                </div>
              </form>
            ) : null}

            {/* Quick messaging narrative element */}
            <div className="space-y-4">
              <div className="text-zinc-900 dark:text-white">
                <h4 className="font-sans font-extrabold text-sm tracking-tight text-left">
                  Direct Connection Hub
                </h4>
                <p className="text-zinc-500 dark:text-zinc-400 text-xs mt-1 text-left">
                  Select your preferred connection medium. Compose a quick message optionally, and let our ports handle the rest.
                </p>
              </div>

              <textarea
                id="hub-message-textarea"
                rows={2}
                value={quickMessage}
                onChange={(e) => setQuickMessage(e.target.value)}
                placeholder="e.g. Hi! I want to discuss a custom design project..."
                className="w-full bg-zinc-50 dark:bg-zinc-900/40 border border-zinc-200/70 dark:border-zinc-800/80 rounded-xl px-3.5 py-2.5 text-xs text-zinc-800 dark:text-white placeholder:text-zinc-400 resize-none focus:outline-none focus:border-emerald-500"
              />

              {/* Connection Actions Column */}
              <div className="space-y-2.5">
                {/* WhatsApp Trigger */}
                <button
                  id="hub-whatsapp-redirect-btn"
                  onClick={handleWhatsAppRedirect}
                  className="w-full group p-3 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/20 hover:border-emerald-500/50 rounded-2xl flex items-center justify-between transition-all duration-300"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-emerald-500 rounded-xl text-white">
                      <MessageCircle className="h-4.5 w-4.5" />
                    </div>
                    <div className="text-left">
                      <span className="block text-xs font-bold text-zinc-800 dark:text-zinc-100">
                        WhatsApp Instant Chat
                      </span>
                      <span className="block text-[10px] font-mono text-emerald-500 font-medium">
                        Router: {whatsappNumber}
                      </span>
                    </div>
                  </div>
                  <ArrowRight className="h-4 w-4 text-emerald-500 group-hover:translate-x-1 transition-transform" />
                </button>

                {/* Gmail Trigger */}
                <button
                  id="hub-gmail-redirect-btn"
                  onClick={handleGmailRedirect}
                  className="w-full group p-3 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/20 hover:border-amber-500/50 rounded-2xl flex items-center justify-between transition-all duration-300"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-amber-500 rounded-xl text-white">
                      <Mail className="h-4.5 w-4.5" />
                    </div>
                    <div className="text-left">
                      <span className="block text-xs font-bold text-zinc-800 dark:text-zinc-100">
                        Send via Official Gmail
                      </span>
                      <span className="block text-[10px] font-mono text-amber-500 font-medium">
                        Direct: figureoutstore14@gmail.com
                      </span>
                    </div>
                  </div>
                  <ArrowRight className="h-4 w-4 text-amber-500 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>

              {/* Direct Status Anchor */}
              <div className="pt-2 text-[10px] text-zinc-400 dark:text-zinc-500 flex items-center justify-between font-mono">
                <span>Status: Online Ports Active</span>
                <div className="flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  <span>Active 1-to-1 Sync</span>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
