import { useState, useEffect, useRef } from 'react';
import { Project } from '../types';
import { INITIAL_PROJECTS } from '../data';
import { analytics } from '../utils/analytics';
import { ArrowLeft, ArrowRight, ExternalLink, Calendar, User, ShieldCheck, CheckCircle2 } from 'lucide-react';
import gsap from 'gsap';

interface ProjectSectionProps {
  onContactSupportClick: () => void;
}

export default function ProjectSection({ onContactSupportClick }: ProjectSectionProps) {
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const flexContainerRef = useRef<HTMLDivElement>(null);
  const detailContainerRef = useRef<HTMLDivElement>(null);

  const activeProject = INITIAL_PROJECTS.find((p) => p.id === selectedProjectId) || null;

  useEffect(() => {
    // Basic structural entrance animation
    if (!selectedProjectId && flexContainerRef.current) {
      gsap.fromTo(
        '.gsap-project-card',
        { opacity: 0, y: 40, scale: 0.95 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.6,
          stagger: 0.15,
          ease: 'power3.out',
        }
      );
    }
  }, [selectedProjectId]);

  useEffect(() => {
    // Animation when a project case study page is mounted
    if (selectedProjectId && detailContainerRef.current) {
      gsap.fromTo(
        detailContainerRef.current,
        { opacity: 0, scale: 0.98 },
        { opacity: 1, scale: 1, duration: 0.4, ease: 'power2.out' }
      );
      gsap.fromTo(
        '.case-animation-element',
        { opacity: 0, x: -20 },
        { opacity: 1, x: 0, duration: 0.5, stagger: 0.1, ease: 'power2.out', delay: 0.15 }
      );
    }
  }, [selectedProjectId]);

  const handleOpenProject = (id: string) => {
    setSelectedProjectId(id);
    analytics.trackClick(`project-open-${id}`, id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCloseProject = () => {
    setSelectedProjectId(null);
    analytics.trackClick('project-close-back-btn', 'Back to Catalog');
  };

  const handleNextProject = () => {
    if (!activeProject) return;
    const currentIndex = INITIAL_PROJECTS.findIndex((p) => p.id === activeProject.id);
    const nextIndex = (currentIndex + 1) % INITIAL_PROJECTS.length;
    const nextProject = INITIAL_PROJECTS[nextIndex];

    gsap.to(detailContainerRef.current, {
      opacity: 0,
      x: -50,
      duration: 0.25,
      ease: 'power2.in',
      onComplete: () => {
        setSelectedProjectId(nextProject.id);
        analytics.trackClick(`project-next-${nextProject.id}`, nextProject.id);
        gsap.fromTo(
          detailContainerRef.current,
          { opacity: 0, x: 50 },
          { opacity: 1, x: 0, duration: 0.35, ease: 'power2.out' }
        );
      },
    });
  };

  const handlePrevProject = () => {
    if (!activeProject) return;
    const currentIndex = INITIAL_PROJECTS.findIndex((p) => p.id === activeProject.id);
    const prevIndex = (currentIndex - 1 + INITIAL_PROJECTS.length) % INITIAL_PROJECTS.length;
    const prevProject = INITIAL_PROJECTS[prevIndex];

    gsap.to(detailContainerRef.current, {
      opacity: 0,
      x: 50,
      duration: 0.25,
      ease: 'power2.in',
      onComplete: () => {
        setSelectedProjectId(prevProject.id);
        analytics.trackClick(`project-prev-${prevProject.id}`, prevProject.id);
        gsap.fromTo(
          detailContainerRef.current,
          { opacity: 0, x: -50 },
          { opacity: 1, x: 0, duration: 0.35, ease: 'power2.out' }
        );
      },
    });
  };

  if (activeProject) {
    return (
      <div
        ref={detailContainerRef}
        className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 mt-20"
        id="project-detail-layout"
      >
        {/* Navigation Actions */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8 border-b border-zinc-200/50 dark:border-zinc-800/50 pb-5">
          <button
            id="close-case-study-btn"
            onClick={handleCloseProject}
            className="group flex items-center gap-2 px-4 py-2 text-sm font-medium text-zinc-650 hover:text-zinc-950 dark:text-zinc-400 dark:hover:text-white transition-colors cursor-pointer"
          >
            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
            Back to Catalog
          </button>

          <div className="flex items-center gap-3">
            <button
              id="prev-project-case-btn"
              onClick={handlePrevProject}
              className="p-2 rounded-lg border border-zinc-200 dark:border-zinc-800 text-zinc-650 hover:text-zinc-950 dark:text-zinc-400 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-all cursor-pointer"
              title="Previous Case Study"
            >
              <ArrowLeft className="h-4.5 w-4.5" />
            </button>
            <span className="font-mono text-xs text-zinc-400 dark:text-zinc-500">
              {INITIAL_PROJECTS.findIndex((p) => p.id === activeProject.id) + 1} / {INITIAL_PROJECTS.length}
            </span>
            <button
              id="next-project-case-btn"
              onClick={handleNextProject}
              className="p-2 rounded-lg border border-zinc-200 dark:border-zinc-800 text-zinc-650 hover:text-zinc-950 dark:text-zinc-400 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-all cursor-pointer"
              title="Next Case Study"
            >
              <ArrowRight className="h-4.5 w-4.5" />
            </button>
          </div>
        </div>

        {/* Hero Section of Project */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-12">
          {/* Visual Presentation Accent card */}
          <div className="lg:col-span-7 rounded-2xl p-8 sm:p-12 text-white flex flex-col justify-between min-h-[340px] relative overflow-hidden shadow-lg"
               style={{ background: activeProject.image }}
               id="case-study-hero-canvas">
            <div className="absolute top-0 right-0 w-80 h-80 bg-white/5 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-60 h-60 bg-black/10 rounded-full blur-2xl -ml-20 -mb-20 pointer-events-none" />
            
            <div className="relative">
              <span className="font-mono text-xs uppercase tracking-widest bg-white/10 backdrop-blur-md px-3 py-1 rounded-full text-white/90">
                {activeProject.category}
              </span>
            </div>

            <div className="relative">
              <h1 className="font-sans text-3xl sm:text-4xl font-bold tracking-tight mb-2">
                {activeProject.title}
              </h1>
              <p className="font-sans text-white/85 text-base max-w-xl">
                {activeProject.subtitle}
              </p>
            </div>
          </div>

          {/* Quick Specifications */}
          <div className="lg:col-span-5 flex flex-col justify-between p-6 sm:p-8 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200/50 dark:border-zinc-800/50 rounded-2xl shadow-sm">
            <div>
              <h2 className="font-sans text-xs uppercase tracking-wider text-zinc-400 dark:text-zinc-500 font-bold mb-4">
                Project Matrix & Deliverables
              </h2>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <User className="h-4.5 w-4.5 text-emerald-500 shrink-0" />
                  <div className="text-sm">
                    <span className="text-zinc-400 dark:text-zinc-500">Client:</span>{' '}
                    <strong className="text-zinc-805 dark:text-zinc-100">{activeProject.client}</strong>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Calendar className="h-4.5 w-4.5 text-emerald-500 shrink-0" />
                  <div className="text-sm">
                    <span className="text-zinc-400 dark:text-zinc-500">Completed:</span>{' '}
                    <strong className="text-zinc-805 dark:text-zinc-100">{activeProject.date}</strong>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <ShieldCheck className="h-4.5 w-4.5 text-emerald-500 shrink-0" />
                  <div className="text-sm">
                    <span className="text-zinc-400 dark:text-zinc-500">Audit Status:</span>{' '}
                    <span className="inline-flex items-center gap-1.5 font-bold text-emerald-500 text-xs">
                      <CheckCircle2 className="h-3 w-3" /> Fully Verified
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-5 border-t border-zinc-200 dark:border-zinc-800">
              <h3 className="font-sans text-xs uppercase tracking-wider text-zinc-400 dark:text-zinc-500 font-bold mb-2.5">
                Target pile
              </h3>
              <div className="flex flex-wrap gap-1.5">
                {activeProject.technologies.map((tech) => (
                  <span
                    key={tech}
                    className="font-mono text-xs px-2.5 py-1 rounded bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border border-zinc-200/50 dark:border-zinc-700/50"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Major impact metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-12">
          {activeProject.metrics.map((m, index) => (
            <div
              key={index}
              className="case-animation-element p-6 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200/50 dark:border-zinc-800/50 rounded-2xl text-center shadow-sm"
            >
              <div className="font-sans text-3xl font-extrabold text-[#0fb58c] mb-1">
                {m.value}
              </div>
              <div className="font-sans text-xs font-semibold text-zinc-450 dark:text-zinc-400 uppercase tracking-widest">
                {m.label}
              </div>
            </div>
          ))}
        </div>

        {/* Narrative Deep Dive */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-12">
          <div className="lg:col-span-8 space-y-6">
            <h2 className="font-sans text-2xl font-bold tracking-tight text-zinc-900 dark:text-white">
              The Architecture Solution
            </h2>
            <p className="text-zinc-650 dark:text-zinc-300 leading-relaxed text-base">
              {activeProject.longDescription}
            </p>
            <div className="p-6 bg-[#0fb58c]/5 border border-[#0fb58c]/20 rounded-2xl">
              <h3 className="font-sans text-lg font-bold text-zinc-900 dark:text-white mb-2.5">
                Interactive Engineering Implementation
              </h3>
              <p className="text-zinc-650 dark:text-zinc-300 text-sm leading-relaxed">
                {activeProject.caseStudyContent}
              </p>
            </div>
          </div>

          <div className="lg:col-span-4 space-y-6">
            <div className="p-6 bg-zinc-900 text-white rounded-2xl shadow-md border border-zinc-800">
              <h3 className="font-sans text-base font-bold mb-2">
                Need similar outcomes?
              </h3>
              <p className="text-zinc-400 text-xs leading-relaxed mb-4">
                We design and support custom high-performance applications designed precisely for conversion, accessibility, and high scores.
              </p>
              <button
                id="case-study-request-cta"
                onClick={onContactSupportClick}
                className="w-full justify-center flex items-center gap-2 py-2.5 px-4 bg-[#f9a007] hover:bg-amber-600 active:scale-95 text-zinc-950 font-sans font-bold text-xs rounded-xl shadow-md transition-all cursor-pointer"
              >
                Inquire Project Support <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 mt-20" id="project-catalog-layout">
      {/* Dynamic Header */}
      <div className="text-center max-w-2xl mx-auto mb-16">
        <span className="font-mono text-xs uppercase tracking-widest text-[#0fb58c] bg-[#0fb58c]/5 px-3 py-1 rounded-full border border-[#0fb58c]/15">
          Case Studies Portfolio
        </span>
        <h1 className="font-sans text-3xl sm:text-4xl font-extrabold tracking-tight text-zinc-900 dark:text-white mt-3 mb-4">
          Decoupled Speed. Organic Motion.
        </h1>
        <p className="text-zinc-550 dark:text-zinc-450 text-sm leading-relaxed">
          Explore catalog of digital experiences we have configured. Click on any block to unlock metrics, blueprints, and implementation details.
        </p>
      </div>

      {/* Grid List */}
      <div
        ref={flexContainerRef}
        className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8"
        id="projects-list-grid"
      >
        {INITIAL_PROJECTS.map((project) => (
          <div
            key={project.id}
            id={`project-card-${project.id}`}
            onClick={() => handleOpenProject(project.id)}
            className="gsap-project-card group relative bg-zinc-50 dark:bg-zinc-900 rounded-2xl overflow-hidden border border-zinc-200/60 dark:border-zinc-800/60 shadow-sm cursor-pointer hover:shadow-xl hover:border-emerald-500/30 transition-all duration-300 flex flex-col justify-between"
          >
            {/* Visual Header Grid Gradient */}
            <div
              className="h-48 relative overflow-hidden transition-all duration-500"
              style={{ background: project.image }}
            >
              <div className="absolute inset-0 bg-black/10 mix-blend-overlay" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              
              {/* Pulse interactive indicator */}
              <div className="absolute top-4 right-4 bg-white/15 backdrop-blur-md px-3 py-1 rounded-full text-white font-mono text-[9px] uppercase tracking-widest border border-white/10">
                {project.category}
              </div>
            </div>

            {/* Inner text information */}
            <div className="p-6 flex-grow flex flex-col justify-between">
              <div>
                <h3 className="font-sans text-xl font-bold tracking-tight text-zinc-900 dark:text-white group-hover:text-emerald-500 transition-colors mb-2">
                  {project.title}
                </h3>
                <p className="text-zinc-550 dark:text-zinc-400 text-xs line-clamp-3 leading-relaxed mb-4">
                  {project.description}
                </p>
              </div>

              <div className="pt-4 border-t border-zinc-100 dark:border-zinc-800/80 flex items-center justify-between">
                <span className="font-mono text-[11px] font-semibold text-emerald-500">
                  {project.metrics[0].label}: {project.metrics[0].value}
                </span>
                <span className="flex items-center gap-1 font-sans text-xs font-semibold text-zinc-900 dark:text-white group-hover:translate-x-1.5 transition-transform duration-300">
                  Case Study <ArrowRight className="h-3.5 w-3.5 text-[#f9a007]" />
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
