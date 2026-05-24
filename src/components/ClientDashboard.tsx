import React, { useState, useEffect } from 'react';
import { SupportTicket } from '../types';
import { INITIAL_TICKETS } from '../data';
import { analytics } from '../utils/analytics';
import { 
  Send, Plus, CheckCircle2, AlertTriangle, MessageSquare, Clock, Filter, 
  HelpCircle, ChevronRight, User, Terminal, BadgeAlert, ArrowLeft 
} from 'lucide-react';

const LOCAL_STORAGE_KEY = 'figure_out_tickets';

export default function ClientDashboard() {
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [selectedTicketId, setSelectedTicketId] = useState<string | null>(null);
  
  // Form States
  const [showForm, setShowForm] = useState(false);
  const [clientName, setClientName] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [category, setCategory] = useState<SupportTicket['category']>('New Build');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<SupportTicket['priority']>('medium');
  const [validationError, setValidationError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Filter State
  const [filterCategory, setFilterCategory] = useState<string>('all');

  // Messenger State
  const [chatInput, setChatInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  // Load Tickets on mount
  useEffect(() => {
    try {
      const persisted = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (persisted) {
        setTickets(JSON.parse(persisted));
      } else {
        setTickets(INITIAL_TICKETS);
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(INITIAL_TICKETS));
      }
    } catch {
      setTickets(INITIAL_TICKETS);
    }
  }, []);

  const saveTicketsToStorage = (updated: SupportTicket[]) => {
    setTickets(updated);
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
    } catch (e) {
      console.error('Failed to save tickets locally', e);
    }
  };

  const activeTicket = tickets.find((t) => t.id === selectedTicketId) || null;

  // Contact supports submission
  const handleSubmitTicket = (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);
    setSuccessMessage(null);

    // Dynamic verification rules
    if (!clientName.trim()) {
      setValidationError('Please specify your name so we know who to address.');
      analytics.trackClick('ticket-form-error', 'Empty Name');
      return;
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!clientEmail.trim() || !emailRegex.test(clientEmail)) {
      setValidationError('A valid email address is required to dispatch tickets updates.');
      analytics.trackClick('ticket-form-error', 'Invalid Email');
      return;
    }

    if (subject.trim().length < 5) {
      setValidationError('Please provide a descriptive subject headers (minimum 5 characters).');
      analytics.trackClick('ticket-form-error', 'Short Subject');
      return;
    }

    if (description.trim().length < 15) {
      setValidationError('Please describe the support task in greater detail (minimum 15 characters).');
      analytics.trackClick('ticket-form-error', 'Short Description');
      return;
    }

    // Build ticket structure
    const newTicket: SupportTicket = {
      id: `TKT-${Math.floor(1000 + Math.random() * 9000)}`,
      clientName,
      clientEmail,
      subject,
      category,
      description,
      priority,
      createdAt: new Date().toISOString(),
      status: 'Pending',
      timeline: [
        {
          status: 'Pending',
          date: new Date().toISOString(),
          comment: 'Ticket opened. Our standard response limit is < 3 hours.'
        }
      ],
      messages: [
        {
          sender: 'support',
          text: `Hi ${clientName}! Thanks for contacting Figure Out. We have created ticket for your request on "${category}". Our engineers are reviewing your instructions.`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]
    };

    const updated = [newTicket, ...tickets];
    saveTicketsToStorage(updated);
    analytics.trackFormSubmission(`support-request-${category}`);
    
    setSuccessMessage(`Ticket ${newTicket.id} registered! Our team has been notified.`);
    
    // Reset Form Input
    setClientName('');
    setClientEmail('');
    setSubject('');
    setDescription('');
    setPriority('medium');
    
    // Transition
    setTimeout(() => {
      setShowForm(false);
      setSuccessMessage(null);
      setSelectedTicketId(newTicket.id); // Auto-open the newly created ticket
    }, 2200);
  };

  // Chat sender simulated interaction
  const handleSendChatMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim() || !activeTicket) return;

    analytics.trackClick('ticket-chat-send', activeTicket.id);

    const clientMsg = {
      sender: 'client' as const,
      text: chatInput,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    const updatedMessages = [...activeTicket.messages, clientMsg];
    const updatedTicket: SupportTicket = {
      ...activeTicket,
      messages: updatedMessages
    };

    const updatedTickets = tickets.map((t) => (t.id === activeTicket.id ? updatedTicket : t));
    saveTicketsToStorage(updatedTickets);
    setChatInput('');

    // Trigger AI support simulated feedback loop after 1.5s
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      const replyText = getAutomatedReply(chatInput, activeTicket);
      const hostMsg = {
        sender: 'support' as const,
        text: replyText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      // Auto upgrade status from Pending to Reviewing on dialog
      let nextStatus = activeTicket.status;
      let nextTimeline = [...activeTicket.timeline];
      if (activeTicket.status === 'Pending') {
        nextStatus = 'Reviewing';
        nextTimeline.push({
          status: 'Reviewing',
          date: new Date().toISOString(),
          comment: 'Consultant joined the stream following message interaction'
        });
      }

      const replyUpdatedTicket: SupportTicket = {
        ...activeTicket,
        messages: [...updatedMessages, hostMsg],
        status: nextStatus,
        timeline: nextTimeline
      };

      const finalTickets = tickets.map((t) => (t.id === activeTicket.id ? replyUpdatedTicket : t));
      saveTicketsToStorage(finalTickets);
    }, 1500);
  };

  const getAutomatedReply = (input: string, ticket: SupportTicket): string => {
    const text = input.toLowerCase();
    if (text.includes('urgent') || text.includes('asap') || text.includes('broken')) {
      return `Understood the urgency. I have requested our lead engineer to review ticket ${ticket.id} on priority mode. Let's look into the system console metrics together.`;
    }
    if (text.includes('cost') || text.includes('price') || text.includes('billing')) {
      return `Our default retainer package covers up to 10 development hours monthly for regular deployments. Let me fetch the support estimate breakdown for your requested adjustments.`;
    }
    if (text.includes('thanks') || text.includes('thank you') || text.includes('perfect')) {
      return `My absolute pleasure! We are committed to making "${ticket.subject}" stellar. I will update this screen soon.`;
    }
    return `Excellent point. We have logged this directly into our diagnostic server files. We are running local integration tests now and will update you shortly.`;
  };

  const filteredTickets = filterCategory === 'all' 
    ? tickets 
    : tickets.filter(t => t.category === filterCategory);

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 mt-20" id="client-dashboard-main">
      
      {/* Visual Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-10 border-b border-zinc-200/50 dark:border-zinc-800/50 pb-8">
        <div>
          <span className="font-mono text-xs uppercase tracking-widest text-[#0fb58c] bg-[#0fb58c]/5 px-3 py-1 rounded-full">
            Technical Support Suite
          </span>
          <h1 className="font-sans text-3xl font-extrabold tracking-tight text-zinc-950 dark:text-white mt-2.5">
            Client Support Board
          </h1>
          <p className="text-zinc-550 dark:text-zinc-450 text-xs mt-1">
            Track support tickets, submit web development code tasks, and chat with technical engineers in real-time.
          </p>
        </div>

        <div>
          {!showForm && !selectedTicketId && (
            <button
              id="open-new-ticket-form-btn"
              onClick={() => {
                setShowForm(true);
                analytics.trackClick('open-new-support-ticket-form', 'Plus Click');
              }}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 font-sans font-bold text-xs text-white shadow-md active:scale-95 transition-all cursor-pointer"
            >
              <Plus className="h-4.5 w-4.5" /> File Support Request
            </button>
          )}
        </div>
      </div>

      {/* Ticket Details Detailed Modal View */}
      {selectedTicketId && activeTicket ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8" id="ticket-inspection-layout">
          {/* Main Info Columns */}
          <div className="lg:col-span-8 space-y-6">
            {/* Header / Meta */}
            <div className="p-6 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200/60 dark:border-zinc-800/60 rounded-2xl shadow-sm">
              <div className="flex items-center gap-2 mb-3">
                <button
                  id="exit-ticket-scr-btn"
                  onClick={() => {
                    setSelectedTicketId(null);
                    analytics.trackClick('back-to-dashboard-list', 'Back');
                  }}
                  className="p-1 px-2.5 hover:bg-zinc-205 dark:hover:bg-zinc-801 text-zinc-500 dark:text-zinc-400 hover:text-zinc-950 text-xs rounded-lg flex items-center gap-1 cursor-pointer mr-2.5 transition-colors"
                >
                  <ArrowLeft className="h-3.5 w-3.5" /> Back to List
                </button>
                <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-zinc-200 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300">
                  {activeTicket.id}
                </span>
                <span className={`font-mono text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                  activeTicket.priority === 'high' 
                    ? 'bg-rose-500/10 text-rose-500 border border-rose-500/25' 
                    : activeTicket.priority === 'medium'
                    ? 'bg-amber-500/10 text-amber-500 border border-amber-500/25'
                    : 'bg-zinc-450/10 text-zinc-500 border border-zinc-500/22'
                }`}>
                  {activeTicket.priority} priority
                </span>
              </div>

              <h2 className="font-sans text-xl font-bold tracking-tight text- जिंक-950 dark:text-white">
                {activeTicket.subject}
              </h2>
              <div className="flex flex-wrap items-center gap-4 text-xs text-zinc-450 dark:text-zinc-500 mt-2.5">
                <span className="flex items-center gap-1.5 font-sans">
                  <User className="h-3.5 w-3.5 text-[#0fb58c]" /> {activeTicket.clientName}
                </span>
                <span>•</span>
                <span className="font-sans">Category: <strong className="text-zinc-700 dark:text-zinc-300">{activeTicket.category}</strong></span>
              </div>
              <p className="text-zinc-650 dark:text-zinc-350 text-xs leading-relaxed mt-4 pt-4 border-t border-zinc-200/50 dark:border-zinc-800/50">
                {activeTicket.description}
              </p>
            </div>

            {/* Dynamic Status Progress Stepper */}
            <div className="p-6 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200/60 dark:border-zinc-800/60 rounded-2xl shadow-sm">
              <h3 className="font-sans text-xs uppercase tracking-wider text-zinc-400 dark:text-zinc-500 font-bold mb-5">
                Resolution Roadmap Progress
              </h3>

              <div className="grid grid-cols-4 relative" id="ticket-status-stepper-progress">
                {/* Horizontal Tracking Line */}
                <div className="absolute top-[18px] left-[12.5%] right-[12.5%] h-0.5 bg-zinc-200 dark:bg-zinc-800 pointer-events-none" />
                
                {/* Simulated fills */}
                <div 
                  className="absolute top-[18px] left-[12.5%] h-0.5 bg-emerald-500 transition-all duration-500 pointer-events-none" 
                  style={{
                    width: activeTicket.status === 'Pending' ? '0%' :
                           activeTicket.status === 'Reviewing' ? '33.33%' :
                           activeTicket.status === 'In Progress' ? '66.66%' : '100%'
                  }}
                />

                {/* Individual Circles */}
                {['Pending', 'Reviewing', 'In Progress', 'Ready'].map((phase, idx) => {
                  const phases = ['Pending', 'Reviewing', 'In Progress', 'Ready'];
                  const valIndex = phases.indexOf(activeTicket.status);
                  const isFinished = valIndex >= idx;
                  const isCurrent = activeTicket.status === phase;

                  return (
                    <div key={phase} className="flex flex-col items-center text-center relative z-10">
                      <div className={`w-9 h-9 rounded-full flex items-center justify-center border transition-all ${
                        isFinished 
                          ? 'bg-emerald-500 border-emerald-500 text-white shadow-md shadow-emerald-500/20' 
                          : 'bg-white dark:bg-zinc-950 border-zinc-300 dark:border-zinc-800 text-zinc-400'
                      } ${isCurrent ? 'ring-4 ring-emerald-500/20 scale-110' : ''}`}>
                        {isFinished ? (
                          <CheckCircle2 className="h-4.5 w-4.5" />
                        ) : (
                          <Clock className="h-4 w-4" />
                        )}
                      </div>
                      <span className={`text-[10px] font-sans font-bold mt-2.5 uppercase tracking-wider ${
                        isCurrent 
                          ? 'text-emerald-500 font-semibold' 
                          : 'text-zinc-400 dark:text-zinc-500'
                      }`}>
                        {phase}
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* Recent Status comment detail */}
              <div className="p-4 bg-zinc-100/60 dark:bg-zinc-800/40 rounded-xl mt-6 border border-zinc-200/45 dark:border-zinc-700/45">
                <span className="font-mono text-[9px] uppercase tracking-widest text-[#f9a007] font-extrabold flex items-center gap-1.5">
                  <Terminal className="h-3 w-3" /> Latest Auditor Status Log
                </span>
                <p className="font-sans text-xs text-zinc-600 dark:text-zinc-350 mt-1">
                  {activeTicket.timeline[activeTicket.timeline.length - 1]?.comment || 'Ticket queued.'}
                </p>
                <span className="text-[10px] text-zinc-400 dark:text-zinc-500 font-mono inline-block mt-2">
                  Stamped at: {new Date(activeTicket.timeline[activeTicket.timeline.length - 1]?.date || activeTicket.createdAt).toLocaleString()}
                </span>
              </div>
            </div>
          </div>

          {/* Messenger Sidebar */}
          <div className="lg:col-span-4 flex flex-col h-[520px] bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-sm overflow-hidden" id="ticket-chat-sidebar">
            <div className="p-4 border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 flex items-center gap-2">
              <MessageSquare className="h-4.5 w-4.5 text-emerald-500" />
              <div>
                <h3 className="font-sans text-xs font-bold text-zinc-900 dark:text-white">
                  Developer Dialogue
                </h3>
                <span className="font-sans text-[10px] text-emerald-500 font-semibold flex items-center gap-1 animate-pulse">
                  <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full inline-block" /> Active Operator Online
                </span>
              </div>
            </div>

            {/* Message streams */}
            <div className="flex-1 p-4 overflow-y-auto space-y-3.5 bg-zinc-100/50 dark:bg-zinc-950/40" id="dialogue-scroll-box">
              {activeTicket.messages.map((m, idx) => {
                const isSupport = m.sender === 'support';
                return (
                  <div key={idx} className={`flex flex-col ${isSupport ? 'items-start' : 'items-end'}`}>
                    <div className={`max-w-[85%] rounded-2xl p-3.5 shadow-sm text-xs ${
                      isSupport 
                        ? 'bg-zinc-800 text-white dark:bg-zinc-800 max-w-xs rounded-tl-sm' 
                        : 'bg-emerald-500 text-white max-w-xs rounded-tr-sm'
                    }`}>
                      <p className="line-relaxed leading-relaxed break-words">{m.text}</p>
                    </div>
                    <span className="text-[9px] text-zinc-400 dark:text-zinc-500 font-mono mt-1 px-1">
                      {isSupport ? 'Eng. Support' : 'You'} • {m.timestamp}
                    </span>
                  </div>
                );
              })}

              {isTyping && (
                <div className="flex items-center gap-1.5 text-zinc-400 text-[11px] font-mono p-1">
                  <span className="w-1.5 h-1.5 bg-[#f9a007] rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-1.5 h-1.5 bg-[#f9a007] rounded-full animate-bounce" style={{ animationDelay: '200ms' }} />
                  <span className="w-1.5 h-1.5 bg-[#f9a007] rounded-full animate-bounce" style={{ animationDelay: '400ms' }} />
                  <span>Support is typing advisory...</span>
                </div>
              )}
            </div>

            {/* Chat entry field */}
            <form onSubmit={handleSendChatMessage} className="p-3.5 border-t border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 flex gap-2">
              <input
                id="chat-whisper-input"
                type="text"
                placeholder="Reply to the engineer..."
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                disabled={isTyping}
                className="flex-1 bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl px-3 py-2 text-xs text-zinc-800 dark:text-zinc-200 focus:outline-none focus:border-emerald-500/50"
              />
              <button
                id="chat-send-icon-btn"
                type="submit"
                disabled={!chatInput.trim() || isTyping}
                className="p-2 bg-emerald-500 hover:bg-emerald-600 disabled:bg-zinc-200 disabled:dark:bg-zinc-800 disabled:text-zinc-400 text-white rounded-xl transition-colors cursor-pointer"
              >
                <Send className="h-4 w-4" />
              </button>
            </form>
          </div>
        </div>
      ) : showForm ? (
        /* Create New Ticket Form Screen */
        <div className="max-w-2xl mx-auto p-6 sm:p-8 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200/50 dark:border-zinc-800/50 rounded-2xl shadow-md" id="ticket-generation-screen">
          <div className="flex items-center justify-between mb-6 border-b border-zinc-200/55 dark:border-zinc-800/55 pb-4">
            <h2 className="font-sans text-lg font-bold text-zinc-900 dark:text-white flex items-center gap-2">
              <BadgeAlert className="h-5 w-5 text-emerald-500" /> New Support Dispatch
            </h2>
            <button
              id="cancel-ticket-creation-btn"
              onClick={() => setShowForm(false)}
              className="text-xs text-zinc-400 hover:text-zinc-900 dark:hover:text-white cursor-pointer"
            >
              Cancel
            </button>
          </div>

          <form onSubmit={handleSubmitTicket} className="space-y-4">
            {validationError && (
              <div className="p-3.5 bg-rose-500/10 border border-rose-500/20 text-rose-500 rounded-xl text-xs font-semibold flex items-center gap-2" id="ticket-validation-error-box">
                <AlertTriangle className="h-4.5 w-4.5 shrink-0" />
                {validationError}
              </div>
            )}

            {successMessage && (
              <div className="p-3.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 rounded-xl text-xs font-semibold flex items-center gap-2" id="ticket-validation-success-box">
                <CheckCircle2 className="h-4.5 w-4.5 shrink-0 animate-bounce" />
                {successMessage}
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-zinc-450 dark:text-zinc-400 uppercase tracking-wider mb-1.5">
                  Visitor Name
                </label>
                <input
                  id="ticket-author-name"
                  type="text"
                  placeholder="e.g. Liam Foster"
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  className="w-full bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl px-3.5 py-2.5 text-xs text-zinc-900 dark:text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-455 dark:text-zinc-400 uppercase tracking-wider mb-1.5">
                  Support Email Address
                </label>
                <input
                  id="ticket-author-email"
                  type="email"
                  placeholder="name@organization.com"
                  value={clientEmail}
                  onChange={(e) => setClientEmail(e.target.value)}
                  className="w-full bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl px-3.5 py-2.5 text-xs text-zinc-900 dark:text-white focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-zinc-455 dark:text-zinc-405 uppercase tracking-wider mb-1.5">
                  Support Category
                </label>
                <select
                  id="ticket-task-category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value as SupportTicket['category'])}
                  className="w-full bg-white dark:bg-zinc-955 border border-zinc-20d dark:border-zinc-800 rounded-xl px-3.5 py-2.5 text-xs text-zinc-900 dark:text-white focus:outline-none focus:border-emerald-500"
                >
                  <option value="New Build">New Custom Build</option>
                  <option value="Maintenance">Maintenance & Retainer</option>
                  <option value="UI/UX Redesign">UX / Interactive Redesign</option>
                  <option value="Bug Fix">Emergency Bug Fix</option>
                  <option value="Speed Optimization">Performance / Load Times</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-455 dark:text-zinc-405 uppercase tracking-wider mb-1.5">
                  Assigned Urgency
                </label>
                <div className="flex gap-2">
                  {(['low', 'medium', 'high'] as const).map((p) => (
                    <button
                      key={p}
                      id={`priority-${p}-selector-btn`}
                      type="button"
                      onClick={() => setPriority(p)}
                      className={`flex-1 py-2 text-xs font-sans font-bold capitalize rounded-xl border transition-all cursor-pointer ${
                        priority === p 
                          ? p === 'high' 
                            ? 'bg-rose-500 border-rose-500 text-white' 
                            : p === 'medium'
                            ? 'bg-amber-500 border-amber-500 text-white'
                            : 'bg-zinc-650 border-zinc-650 text-white'
                          : 'bg-white dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800 text-zinc-400 dark:text-zinc-500'
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-zinc-455 dark:text-zinc-400 uppercase tracking-wider mb-1.5">
                Support Case Headline
              </label>
              <input
                id="ticket-task-subject"
                type="text"
                placeholder="Describe your request in 1 sentence..."
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full bg-white dark:bg-zinc-950 border border-zinc-20d dark:border-zinc-800 rounded-xl px-3.5 py-2.5 text-xs text-zinc-900 dark:text-white focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-zinc-455 dark:text-zinc-400 uppercase tracking-wider mb-1.5">
                Detailed Diagnostic Outline
              </label>
              <textarea
                id="ticket-task-description"
                rows={4}
                placeholder="Provide details of files, browsers, errors, or custom assets to help our team address your request."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl px-3.5 py-2.5 text-xs text-zinc-900 dark:text-white focus:outline-none focus:border-emerald-500 resize-none"
              />
            </div>

            <button
              id="ticket-submit-dispatch-btn"
              type="submit"
              className="w-full justify-center flex items-center gap-2 py-3 bg-emerald-500 hover:bg-emerald-600 font-sans font-bold text-xs text-white rounded-xl shadow-md transition-all active:scale-98 cursor-pointer"
            >
              Dispatch Technical Ticket <Send className="h-4 w-4" />
            </button>
          </form>
        </div>
      ) : (
        /* Main Dashboard Queue Layout */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8" id="client-dashboard-grid">
          {/* Info Side Rail */}
          <div className="lg:col-span-4 space-y-6">
            <div className="p-6 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-sm">
              <h3 className="font-sans text-sm font-extrabold text-zinc-900 dark:text-white mb-2.5">
                Operational Status Logs
              </h3>
              <p className="text-zinc-550 dark:text-zinc-450 text-xs leading-relaxed mb-4">
                We manage live operations on our client’s repositories. Check average parameters here:
              </p>

              <div className="space-y-3.5" id="support-health-spec-sheet">
                <div className="flex items-center justify-between p-3 bg-white dark:bg-zinc-950 rounded-xl border border-zinc-205/60 dark:border-zinc-802/60">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4.5 w-4.5 text-[#0fb58c]" />
                    <span className="font-sans text-xs text-zinc-700 dark:text-zinc-300">Engine Systems</span>
                  </div>
                  <span className="font-mono text-[10px] font-bold text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-full select-none">
                    99.98%
                  </span>
                </div>

                <div className="flex items-center justify-between p-3 bg-white dark:bg-zinc-950 rounded-xl border border-zinc-205/60 dark:border-zinc-802/60">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4.5 w-4.5 text-[#f9a007]" />
                    <span className="font-sans text-xs text-zinc-700 dark:text-zinc-300">Pending Limit</span>
                  </div>
                  <span className="font-mono text-[10px] text-zinc-500 border border-zinc-200 dark:border-zinc-800 px-2 py-0.5 rounded-full">
                    &lt; 3.2 Hrs
                  </span>
                </div>
              </div>
            </div>

            <div className="p-6 bg-[#0fb58c]/5 border border-[#0fb58c]/15 rounded-2xl">
              <h4 className="font-sans text-xs uppercase tracking-wider text-emerald-500 font-bold mb-1.5">
                Audited Integrations
              </h4>
              <p className="text-zinc-600 dark:text-zinc-300 text-xs leading-relaxed">
                All tickets automatically pull diagnostic details. When typing inside the dialog messenger pane, our simulated supervisor registers context to advise instantly.
              </p>
            </div>
          </div>

          {/* Main Tickets Queue List Column */}
          <div className="lg:col-span-8 space-y-4">
            {/* Filter controls Bar */}
            <div className="flex items-center justify-between p-3 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl">
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-zinc-400" />
                <span className="font-mono text-[10px] uppercase tracking-wider text-zinc-400 font-bold">
                  Queue Filters
                </span>
              </div>

              <div className="flex gap-1">
                {['all', 'New Build', 'Bug Fix', 'Speed Optimization'].map((cat) => (
                  <button
                    key={cat}
                    id={`filter-${cat.toLowerCase().replace(/\s+/g, '-')}-btn`}
                    onClick={() => setFilterCategory(cat)}
                    className={`px-3 py-1 text-[10px] font-sans font-bold rounded-lg cursor-pointer transition-all ${
                      filterCategory === cat
                        ? 'bg-zinc-900 dark:bg-white text-white dark:text-zinc-950'
                        : 'text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100 dark:hover:bg-zinc-800'
                    }`}
                  >
                    {cat === 'all' ? 'All Tickets' : cat}
                  </button>
                ))}
              </div>
            </div>

            {/* List Stream */}
            <div className="space-y-3" id="tickets-queue-container">
              {filteredTickets.length === 0 ? (
                <div className="p-12 text-center bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl">
                  <HelpCircle className="h-8 w-8 text-zinc-400 mx-auto mb-2" />
                  <p className="text-zinc-500 font-sans text-xs">
                    No active support requests found itemizing this category filter.
                  </p>
                </div>
              ) : (
                filteredTickets.map((ticket) => {
                  return (
                    <div
                      key={ticket.id}
                      id={`ticket-row-${ticket.id}`}
                      onClick={() => {
                        setSelectedTicketId(ticket.id);
                        analytics.trackClick(`view-support-ticket-${ticket.id}`, ticket.id);
                      }}
                      className="group p-5 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 hover:border-emerald-500/40 rounded-2xl shadow-sm hover:shadow-md cursor-pointer transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                    >
                      <div className="space-y-1.5 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="font-mono text-[10px] bg-zinc-200 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 px-2 py-0.5 rounded font-extrabold">
                            {ticket.id}
                          </span>
                          <span className="font-sans text-[11px] text-zinc-400 font-medium">
                            Category: <strong className="text-zinc-650 dark:text-zinc-400">{ticket.category}</strong>
                          </span>
                          <span className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded ${
                            ticket.priority === 'high' 
                              ? 'bg-rose-500/10 text-rose-500' 
                              : ticket.priority === 'medium'
                              ? 'bg-amber-500/10 text-amber-500'
                              : 'bg-zinc-500/10 text-zinc-400'
                          }`}>
                            {ticket.priority} priority
                          </span>
                        </div>

                        <h3 className="font-sans text-sm font-bold text-zinc-900 dark:text-white group-hover:text-emerald-500 transition-colors">
                          {ticket.subject}
                        </h3>

                        <div className="flex items-center gap-1.5 text-xs text-zinc-450 dark:text-zinc-500">
                          <span className="font-medium text-zinc-600 dark:text-gray-350">{ticket.clientName}</span>
                          <span>•</span>
                          <span className="font-mono text-[10px]">{new Date(ticket.createdAt).toLocaleDateString()}</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0 border-t sm:border-0 border-zinc-200 pt-3 sm:pt-0">
                        <div className="flex items-center gap-2">
                          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                          <span className="font-sans text-xs font-semibold text-zinc-800 dark:text-zinc-205">
                            {ticket.status}
                          </span>
                        </div>
                        <ChevronRight className="h-4.5 w-4.5 text-zinc-400 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
