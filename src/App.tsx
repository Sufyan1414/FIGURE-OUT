import { useState, useEffect } from 'react';
import { ViewTab } from './types';
import { analytics } from './utils/analytics';
import CustomCursor from './components/CustomCursor';
import Navbar from './components/Navbar';
import ProjectSection from './components/ProjectSection';
import BlogCMS from './components/BlogCMS';
import ClientDashboard from './components/ClientDashboard';
import AnalyticsView from './components/AnalyticsView';
import ContactForm from './components/ContactForm';
import FigureOutLogo from './components/FigureOutLogo';
import FloatingContactHub from './components/FloatingContactHub';
import { 
  ArrowRight, Sparkles, Code2, Rocket, LineChart, Cpu, 
  MapPin, Milestone, CheckCircle2, ChevronRight, Terminal, Star, ArrowUpRight, Mail
} from 'lucide-react';
import gsap from 'gsap';

export default function App() {
  const [currentTab, setTab] = useState<ViewTab>('home');
  const [darkMode, setDarkMode] = useState<boolean>(true); // Default to a gorgeous dark theme

  // Sync dark theme with body document element
  useEffect(() => {
    // Resolve initial preference
    try {
      const savedTheme = localStorage.getItem('figure_out_theme');
      if (savedTheme) {
        setDarkMode(savedTheme === 'dark');
      } else {
        // Fallback to dark theme for high-end feel
        setDarkMode(true);
      }
    } catch {
      setDarkMode(true);
    }
  }, []);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      try {
        localStorage.setItem('figure_out_theme', 'dark');
      } catch {}
    } else {
      document.documentElement.classList.remove('dark');
      try {
        localStorage.setItem('figure_out_theme', 'light');
      } catch {}
    }
  }, [darkMode]);

  // Handle SEO Meta Injection & Schema injection on load
  useEffect(() => {
    document.title = "Figure Out | Premium Web Studio & Portfolio";
    
    // Inject JSON-LD structured schema for crawlers optimization
    const schemaId = 'figure-out-seo-schema';
    let script = document.getElementById(schemaId) as HTMLScriptElement;
    if (!script) {
      script = document.createElement('script');
      script.id = schemaId;
      script.type = 'application/ld+json';
      document.head.appendChild(script);
    }
    script.textContent = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "ProfessionalService",
      "name": "Figure Out",
      "url": window.location.origin,
      "logo": window.location.origin + "/src/assets/logo.svg",
      "description": "High-end visual web development portfolio, headless store transitions, organic motion animations, and real-time client ticket dashboards.",
      "email": "figureoutstore14@gmail.com",
      "address": {
        "@type": "PostalAddress",
        "addressLocality": "San Francisco",
        "addressRegion": "CA",
        "addressCountry": "US"
      }
    });

    // Setup or inject Meta Description tag
    let metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc) {
      metaDesc = document.createElement('meta');
      metaDesc.setAttribute('name', 'description');
      document.head.appendChild(metaDesc);
    }
    metaDesc.setAttribute('content', 'Figure Out is a premium bespoke web development studio. Specialized in sub-second fast loading speed, headless Shopify, elegant GSAP layout transitions, and dedicated support dashboards.');

    analytics.trackPageView('Studio Home');
  }, []);

  // GSAP animation for homepage load
  useEffect(() => {
    if (currentTab === 'home') {
      window.scrollTo({ top: 0, behavior: 'instant' });
      
      gsap.fromTo(
        '.gsap-hero-badge',
        { opacity: 0, scale: 0.85, y: -10 },
        { opacity: 1, scale: 1, y: 0, duration: 0.5, ease: 'back.out' }
      );
      gsap.fromTo(
        '.gsap-hero-title',
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.6, delay: 0.1, ease: 'power3.out' }
      );
      gsap.fromTo(
        '.gsap-hero-desc',
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.5, delay: 0.2, ease: 'power2.out' }
      );
      gsap.fromTo(
        '.gsap-hero-action',
        { opacity: 0, scale: 0.9 },
        { opacity: 1, scale: 1, duration: 0.4, delay: 0.3, stagger: 0.1, ease: 'power2.out' }
      );
      gsap.fromTo(
        '.gsap-bento-item',
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.5, delay: 0.4, stagger: 0.12, ease: 'power2.out' }
      );
    }
  }, [currentTab]);

  const selectTab = (tab: ViewTab) => {
    setTab(tab);
    analytics.trackPageView(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const bentoServices = [
    {
      id: 'headless-service',
      title: 'Decoupled Architectures',
      subtitle: 'Headless / CMS Decoupled API Integrations',
      desc: 'Decouple client interfaces from legacy backends to construct sub-second page views, unbreachable security levels, and limitless visual flexibility.',
      stat: '0.4s avg load speed'
    },
    {
      id: 'gsap-service',
      title: 'Cinematic Gestures',
      subtitle: 'GSAP Inertia & Canvas Coordinates Rendering',
      desc: 'Build organic canvas coordinate physics, spring animations, and responsive micro-interactions that mirror tangible real-world behaviors.',
      stat: '60fps mobile execution'
    },
    {
      id: 'seo-service',
      title: 'Speed Diagnostics',
      subtitle: 'Core Web Vitals SEO Hardening',
      desc: 'We audit layout configurations to remove blocking cycles, leverage edge caches, and optimize page load weights for immediate crawlers indexing.',
      stat: '100/100 Lighthouse'
    },
    {
      id: 'telemetry-service',
      title: 'Engagement Dashboards',
      subtitle: 'Embedded Visitor telemetry Tracking',
      desc: 'Evaluate click destinations, layout paths, and form submittal rates through modular graphs so clients track visitor retention maps.',
      stat: 'Instant Telemetries Sync'
    }
  ];

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-50 flex flex-col justify-between transition-colors duration-300 relative selection:bg-[#0fb58c]/20 selection:text-emerald-500">
      {/* Visual background atmospheric mesh */}
      <div className="absolute top-0 left-0 w-full h-[600px] pointer-events-none overflow-hidden select-none z-0">
        <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[70%] rounded-[100%] bg-emerald-500/5 dark:bg-emerald-500/3 blur-[120px]" />
        <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[60%] rounded-[100%] bg-amber-500/5 dark:bg-amber-500/3 blur-[120px]" />
      </div>

      {/* Interactive Cursor Component */}
      <CustomCursor />

      {/* Floating high-end navigation header */}
      <Navbar currentTab={currentTab} setTab={selectTab} darkMode={darkMode} setDarkMode={setDarkMode} />

      {/* View Controller Portals */}
      <main className="flex-grow z-10">
        {currentTab === 'home' && (
          <div className="space-y-24 mt-20" id="landing-home-viewport">
            
            {/* Visual Hero Studio */}
            <section className="mx-auto max-w-7xl px-4 pt-16 pb-8 sm:px-6 lg:px-8 text-center relative" id="hero-heading-landing">
              <div className="relative z-10 max-w-3xl mx-auto space-y-6">
                
                {/* Premium tag */}
                <div className="gsap-hero-badge inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#0fb58c]/10 text-[#0fb58c] font-mono text-[10px] uppercase font-bold tracking-widest border border-[#0fb58c]/20">
                  <Sparkles className="h-3.5 w-3.5 animate-pulse" /> Decoupled Systems Architectures
                </div>

                {/* Main branding tagline */}
                <h1 className="gsap-hero-title font-sans text-4xl sm:text-6xl font-black tracking-tight leading-[1.08] text-zinc-950 dark:text-white uppercase">
                  Let’s Figure Out <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 via-[#0fb58c] to-[#f9a007]">
                    Modern Web Code
                  </span>
                </h1>

                {/* Sub-text summary description */}
                <p className="gsap-hero-desc text-zinc-550 dark:text-zinc-400 text-sm sm:text-base leading-relaxed max-w-xl mx-auto">
                  We are <strong className="text-zinc-800 dark:text-zinc-200">Figure Out</strong>. We engineer high-performance headless portals, interactive canvas coordinate systems, and lightning-fast interfaces supported by embedded telemetries and dedicated support desks.
                </p>

                {/* Hero switches trigger buttons */}
                <div className="gsap-hero-action flex flex-wrap justify-center items-center gap-3.5 pt-4">
                  <button
                    id="hero-explore-projects-btn"
                    onClick={() => selectTab('projects')}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-zinc-900 border border-zinc-900 dark:bg-white dark:border-white text-white dark:text-zinc-950 font-sans font-extrabold text-xs tracking-wider uppercase rounded-xl shadow-md hover:opacity-90 active:scale-97 transition-all cursor-pointer"
                  >
                    Explore Portfolio <ArrowRight className="h-4 w-4 text-[#f9a007]" />
                  </button>

                  <button
                    id="hero-contact-desk-btn"
                    onClick={() => {
                      selectTab('dashboard');
                      analytics.trackClick('hero-contact-support', 'CTA');
                    }}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-white dark:bg-zinc-900 border border-zinc-250 dark:border-zinc-800 text-zinc-700 dark:text-zinc-305 font-sans font-bold text-xs tracking-wider uppercase rounded-xl shadow-sm hover:bg-zinc-100 dark:hover:bg-zinc-800 active:scale-97 transition-all cursor-pointer"
                  >
                    Open Support Desk <Rocket className="h-4 w-4 text-emerald-500" />
                  </button>
                </div>
              </div>

              {/* High fidelity interactive desktop device mockup */}
              <div 
                className="mt-16 max-w-4xl mx-auto rounded-2xl border border-zinc-200/60 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 p-2.5 shadow-xl select-none"
                id="interactive-device-view"
              >
                <div className="bg-zinc-100 dark:bg-zinc-950 rounded-xl overflow-hidden border border-zinc-200/40 dark:border-zinc-803/50 aspect-video flex flex-col">
                  {/* Browser top-bar */}
                  <div className="bg-zinc-200/80 dark:bg-zinc-900/40 px-4 py-2 border-b border-zinc-300/40 dark:border-zinc-800/65 flex items-center justify-between">
                    <div className="flex gap-1.5">
                      <div className="w-2.5 h-2.5 rounded-full bg-rose-455/80 dark:bg-zinc-801" />
                      <div className="w-2.5 h-2.5 rounded-full bg-amber-455/80 dark:bg-zinc-801" />
                      <div className="w-2.5 h-2.5 rounded-full bg-emerald-455/80 dark:bg-zinc-801" />
                    </div>
                    {/* Fake URL bar */}
                    <div className="bg-white/60 dark:bg-zinc-950/60 rounded-md px-12 py-1 text-[9px] font-mono text-zinc-450 dark:text-zinc-500 border border-zinc-300/20">
                      https://secure-console.figout.dev/operations
                    </div>
                    <div className="w-4" />
                  </div>

                  {/* Browser visual live mock display */}
                  <div className="flex-1 p-6 grid grid-cols-12 gap-4 text-left">
                    {/* Console Side Panel */}
                    <div className="col-span-4 bg-zinc-150 dark:bg-zinc-900 rounded-lg p-4 border border-zinc-300/10 flex flex-col justify-between">
                      <div className="space-y-4">
                        <span className="font-mono text-[9px] uppercase font-bold text-emerald-500 block">
                          SYSTEM CONSOLE
                        </span>
                        <div className="space-y-1">
                          <div className="font-mono text-[10px] text-zinc-400">Node: <strong className="text-zinc-750 dark:text-zinc-200">Edge Server Active</strong></div>
                          <div className="font-mono text-[10px] text-zinc-400">FPS: <strong className="text-zinc-750 dark:text-zinc-200">60.0</strong></div>
                          <div className="font-mono text-[10px] text-zinc-400">Sec: <strong className="text-zinc-750 dark:text-zinc-200">SSL decoupled</strong></div>
                        </div>
                      </div>

                      {/* Mock trigger click that feeds actual analytics */}
                      <button 
                        id="hero-mock-ping-btn"
                        onClick={() => {
                          analytics.trackClick('hero-interactive-ping', 'Ping Command');
                          // Create a custom warning alert state change or micro effect
                          alert("Ping success! Interaction recorded on our Telemetry Analytics dashboard. Click 'Live telemetry' on navbar to inspect.");
                        }}
                        className="w-full text-center py-2 bg-[#f9a007] hover:bg-amber-600 text-zinc-950 font-mono text-[9px] font-bold rounded-md shadow-sm cursor-pointer transition-all active:scale-95"
                      >
                        Ping System Core
                      </button>
                    </div>

                    {/* Chart simulated panel */}
                    <div className="col-span-8 bg-zinc-50 dark:bg-[#121214] rounded-lg p-4 border border-zinc-300/10 flex flex-col justify-between">
                      <div className="flex items-center justify-between border-b border-zinc-200 dark:border-zinc-800 pb-2.5">
                        <span className="font-mono text-[9px] uppercase tracking-wider font-extrabold text-zinc-400">
                          Live speed metric
                        </span>
                        <span className="text-[10px] text-[#0fb58c] font-black">99/100 Core speed</span>
                      </div>
                      
                      {/* Graphics mockup lines */}
                      <div className="flex items-end gap-3 h-32 pt-4">
                        {[40, 75, 45, 95, 60, 40, 85, 100].map((h, i) => (
                          <div key={i} className="flex-1 flex flex-col items-center">
                            <div 
                              className="w-full rounded-t-sm bg-gradient-to-t from-[#0fb58c]/40 to-[#0fb58c] transition-all" 
                              style={{ height: `${h}%` }}
                            />
                            <span className="font-mono text-[8px] text-zinc-400 mt-1">S{i+1}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Studio Bento Pillars Services Section */}
            <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10" id="services-grid-landing">
              <div className="text-center max-w-2xl mx-auto mb-16">
                <span className="font-mono text-xs uppercase tracking-widest text-[#0fb58c]">
                  Operational capabilities
                </span>
                <h2 className="font-sans text-2xl sm:text-3xl font-extrabold tracking-tight mt-2.5">
                  How We Figure Out Performance
                </h2>
              </div>

              {/* Bento Grid layout */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6" id="bento-capabilities-grid">
                {bentoServices.map((srv, idx) => (
                  <div
                    key={srv.id}
                    id={`bento-service-${srv.id}`}
                    onClick={() => {
                      analytics.trackClick(`bento-${srv.id}`, srv.title);
                      // Auto route based on clicking
                      if (srv.id === 'headless-service' || srv.id === 'gsap-service') {
                        setTab('projects');
                      } else if (srv.id === 'telemetry-service') {
                        setTab('analytics');
                      }
                    }}
                    className="gsap-bento-item p-6 sm:p-8 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200/50 dark:border-zinc-800/50 rounded-2xl hover:border-emerald-500/25 cursor-pointer shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col justify-between"
                  >
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-[10px] uppercase tracking-widest text-[#f9a007] font-extrabold bg-[#f9a007]/5 px-2.5 py-0.5 rounded border border-[#f9a007]/15">
                          {srv.title}
                        </span>
                        <ChevronRight className="h-4.5 w-4.5 text-zinc-450" />
                      </div>

                      <h3 className="font-sans text-lg font-bold tracking-tight text-zinc-900 dark:text-white">
                        {srv.subtitle}
                      </h3>
                      <p className="text-zinc-550 dark:text-zinc-400 text-xs leading-relaxed">
                        {srv.desc}
                      </p>
                    </div>

                    <div className="pt-5 mt-4 border-t border-zinc-150 dark:border-zinc-800/80 flex items-center justify-between font-mono text-[10px]">
                      <span className="text-zinc-400">KPI Metric:</span>
                      <strong className="text-emerald-500 font-bold uppercase">{srv.stat}</strong>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Direct contact and map section */}
            <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10" id="landing-direct-proposals">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                
                {/* Left pitch and context info */}
                <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-24">
                  <span className="font-mono text-xs uppercase tracking-widest text-[#0fb58c]">
                    Studio Access Ports
                  </span>
                  <h2 className="font-sans text-3xl font-extrabold tracking-tight text-zinc-950 dark:text-white">
                    Submit Project Goals Directly
                  </h2>
                  <p className="text-zinc-550 dark:text-zinc-450 text-xs sm:text-sm leading-relaxed">
                    Have a code blueprint or active system configuration you want us to diagnose or build from the ground up? Use our quick transmission console. We analyze requirements and contact you with structured recommendations.
                  </p>

                  <div className="space-y-3.5 pt-5" id="direct-contact-channels">
                    <div className="flex items-center gap-3">
                      <MapPin className="h-5 w-5 text-emerald-500" />
                      <div className="text-xs">
                        <span className="text-zinc-400 block font-mono uppercase text-[9px]">Location</span>
                        <strong className="text-zinc-800 dark:text-zinc-250 font-sans">Edge Deployment, San Francisco, CA</strong>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <Mail className="h-5 w-5 text-[#f9a007]" />
                      <div className="text-xs">
                        <span className="text-zinc-400 block font-mono uppercase text-[9px]">Primary Support Line</span>
                        <a href="mailto:figureoutstore14@gmail.com" className="text-zinc-800 dark:text-zinc-255 font-bold hover:text-emerald-500 transition-colors">
                          figureoutstore14@gmail.com
                        </a>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right validated contact sheet */}
                <div className="lg:col-span-7">
                  <ContactForm />
                </div>
              </div>
            </section>
          </div>
        )}

        {/* Dynamic Route Switch Cases */}
        {currentTab === 'projects' && (
          <ProjectSection onContactSupportClick={() => selectTab('dashboard')} />
        )}

        {currentTab === 'blog' && (
          <BlogCMS />
        )}

        {currentTab === 'dashboard' && (
          <ClientDashboard />
        )}

        {currentTab === 'analytics' && (
          <AnalyticsView />
        )}
      </main>

      {/* Visual Footer */}
      <footer className="mt-20 border-t border-zinc-250 dark:border-zinc-805 bg-white dark:bg-zinc-950 py-10 z-10" id="portfolio-global-footer">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            
            {/* Branding Column */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <FigureOutLogo size={28} />
                <span className="font-sans text-sm font-bold tracking-tight text-zinc-900 dark:text-white">
                  Figure Out
                </span>
              </div>
              <p className="font-mono text-[10px] text-zinc-400 uppercase tracking-widest">
                Decoupled Frontend Excellence • 2026
              </p>
            </div>

            {/* Actions Links */}
            <div className="flex flex-wrap gap-5 text-xs text-zinc-500 dark:text-zinc-400 font-sans" id="footer-actions-links">
              <button 
                onClick={() => selectTab('home')} 
                className="hover:text-zinc-900 dark:hover:text-white transition-colors cursor-pointer"
              >
                Studio Home
              </button>
              <button 
                onClick={() => selectTab('projects')} 
                className="hover:text-zinc-900 dark:hover:text-white transition-colors cursor-pointer"
              >
                Portfolio Case Studies
              </button>
              <button 
                onClick={() => selectTab('blog')} 
                className="hover:text-zinc-900 dark:hover:text-white transition-colors cursor-pointer"
              >
                Insights Blog
              </button>
              <button 
                onClick={() => selectTab('dashboard')} 
                className="hover:text-zinc-900 dark:hover:text-white transition-colors cursor-pointer"
              >
                Client Dashboard
              </button>
              <button 
                onClick={() => selectTab('analytics')} 
                className="hover:text-zinc-900 dark:hover:text-white transition-colors cursor-pointer"
              >
                Live Telemetry
              </button>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-zinc-200/50 dark:border-zinc-800/50 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-[10px] text-zinc-400">
            <p>
              © 2026 Figure Out. All rights reserved. Designed for optimal speed and SEO visibility.
            </p>
            <p className="font-mono">
              System Support: <a href="mailto:figureoutstore14@gmail.com" className="text-emerald-500 font-semibold hover:underline">figureoutstore14@gmail.com</a>
            </p>
          </div>
        </div>
      </footer>
      <FloatingContactHub />
    </div>
  );
}
