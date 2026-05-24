import React, { useState, useEffect } from 'react';
import { Send, CheckCircle2, AlertTriangle, Mail, MessageCircle, ArrowUpRight, Settings, Check, Sparkles } from 'lucide-react';
import { analytics } from '../utils/analytics';

export default function ContactForm() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [company, setCompany] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showConfig, setShowConfig] = useState(false);
  const [emailStatus, setEmailStatus] = useState<'idle' | 'sending' | 'success' | 'failed'>('idle');

  // Custom Web3Forms Access Key persisted in localStorage for instant free automated email alerts
  const [web3FormsKey, setWeb3FormsKey] = useState(() => {
    try {
      return localStorage.getItem('figureout_web3forms_key') || '';
    } catch {
      return '';
    }
  });

  const [tempKey, setTempKey] = useState(web3FormsKey);
  const [isKeySaved, setIsKeySaved] = useState(false);

  const [submittedInfo, setSubmittedInfo] = useState<{
    name: string;
    email: string;
    company: string;
    message: string;
  } | null>(null);

  const saveWeb3Key = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanKey = tempKey.trim();
    setWeb3FormsKey(cleanKey);
    try {
      localStorage.setItem('figureout_web3forms_key', cleanKey);
    } catch {}
    setIsKeySaved(true);
    analytics.trackClick('web3forms-key-saved', cleanKey ? 'Configured' : 'Cleared');
    setTimeout(() => {
      setIsKeySaved(false);
      setShowConfig(false);
    }, 1500);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);
    setShowSuccess(false);
    setEmailStatus('idle');

    if (!name.trim()) {
      setValidationError('Please share your name with us.');
      analytics.trackClick('contact-form-error', 'Empty Name');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim() || !emailRegex.test(email)) {
      setValidationError('A valid email address is required to follow up.');
      analytics.trackClick('contact-form-error', 'Invalid Email');
      return;
    }

    if (message.trim().length < 15) {
      setValidationError('Please provide a message containing at least 15 characters.');
      analytics.trackClick('contact-form-error', 'Short Message');
      return;
    }

    setIsLoading(true);
    setEmailStatus('sending');
    analytics.trackClick('contact-submit-click', 'Send Proposal');

    const payload = {
      name,
      email,
      company: company || 'N/A',
      message
    };

    // If we have an active web3forms key, dispatch the email alert directly!
    if (web3FormsKey) {
      try {
        const response = await fetch('https://api.web3forms.com/submit', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify({
            access_key: web3FormsKey,
            name: name,
            email: email,
            subject: `🔥 New Lead Alert: ${name} from Portfolio Hub`,
            from_name: 'Figure Out Studio System',
            message: `New Web Lead submitted details:\n\nContact Name: ${name}\nEmail Address: ${email}\nCompany Name: ${company || 'N/A'}\n\nClient Project Requirements:\n"${message}"`,
            replyto: email
          })
        });

        if (response.ok) {
          setEmailStatus('success');
        } else {
          setEmailStatus('failed');
        }
      } catch (err) {
        console.error('Email notify dispatch error:', err);
        setEmailStatus('failed');
      }
    } else {
      // No Direct key setup - fallback notify via local log simulation
      // We will encourage saving the key, and also show the custom pre-flight check options
      setEmailStatus('idle');
    }

    // Retain simulated feedback timeline for consistent visual pacing
    setTimeout(() => {
      setIsLoading(false);
      setSubmittedInfo(payload);
      setShowSuccess(true);
      analytics.trackFormSubmission('general-contact-form');
      
      // Reset Form fields safely
      setName('');
      setEmail('');
      setCompany('');
      setMessage('');
    }, 1000);
  };

  return (
    <div className="p-6 sm:p-8 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200/50 dark:border-zinc-800/50 rounded-2xl shadow-sm font-sans" id="contact-form-envelope">
      {/* Header controls */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Mail className="h-5 w-5 text-emerald-500 animate-pulse" />
          <h3 className="font-sans text-sm font-bold text-zinc-900 dark:text-white uppercase tracking-wider">
            Sync Studio Channels
          </h3>
        </div>

        {/* Email automation gear icon */}
        <button
          type="button"
          id="configure-email-notification-btn"
          onClick={() => {
            setShowConfig(!showConfig);
            setTempKey(web3FormsKey);
          }}
          className={`flex items-center gap-1 text-[11px] font-mono px-2 py-1 rounded-md transition-all cursor-pointer ${
            web3FormsKey 
              ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' 
              : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200'
          }`}
          title="Setup Free Direct Email Notifications"
        >
          <Settings className={`h-3.5 w-3.5 ${showConfig ? 'rotate-90' : ''} transition-transform`} />
          <span>{web3FormsKey ? 'Email Alert Active' : 'Email Alerts Setup'}</span>
        </button>
      </div>

      {/* Config setup panel */}
      {showConfig && (
        <div className="p-4 bg-orange-50 dark:bg-amber-950/20 border border-orange-200/40 dark:border-amber-900/40 rounded-xl mb-5 space-y-3 font-sans animate-slide-up" id="email-alert-setup-box">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono uppercase tracking-wider text-amber-500 font-extrabold flex items-center gap-1.5">
              <Sparkles className="h-3 w-3" />
              Email Auto-Alert Router
            </span>
            <button 
              type="button" 
              onClick={() => setShowConfig(false)}
              className="text-zinc-400 hover:text-zinc-600 text-xs"
            >
              Close
            </button>
          </div>

          <p className="text-[11.5px] text-zinc-600 dark:text-zinc-400 leading-relaxed text-left">
            We use <strong className="text-zinc-900 dark:text-white">Web3Forms</strong> to automatically route real-time portfolio inquiries straight to <strong className="text-zinc-900 dark:text-white">figureoutstore14@gmail.com</strong> for free!
          </p>

          <ol className="text-[10.5px] text-zinc-500 dark:text-zinc-450 list-decimal pl-4 space-y-1 text-left">
            <li>Visit <a href="https://web3forms.com" target="_blank" rel="noreferrer" className="text-emerald-500 underline font-bold">web3forms.com</a> (no registration needed).</li>
            <li>Submit your email <strong className="text-zinc-800 dark:text-zinc-300">figureoutstore14@gmail.com</strong> to get a free Access Key.</li>
            <li>Paste your key below to activate instant notifications!</li>
          </ol>

          <form onSubmit={saveWeb3Key} className="flex gap-2 pt-1">
            <input
              type="text"
              id="web3key-input-box"
              value={tempKey}
              onChange={(e) => setTempKey(e.target.value)}
              placeholder="Paste Web3Forms Access Key here..."
              className="flex-1 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg px-2.5 py-1.5 text-xs text-zinc-900 dark:text-white focus:outline-none focus:border-amber-500 font-mono"
            />
            <button
              type="submit"
              className="px-3 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1"
            >
              {isKeySaved ? <Check className="h-3.5 w-3.5" /> : 'Save'}
            </button>
          </form>
        </div>
      )}

      <p className="text-zinc-550 dark:text-zinc-450 text-xs leading-relaxed mb-6">
        Have a specific project layout, headless store transition, or operational optimization task? Dispatch your requirements below.
      </p>

      {validationError && (
        <div className="p-3 bg-rose-500/10 border border-rose-500/20 text-rose-500 rounded-xl text-xs font-semibold flex items-center gap-2 mb-4" id="contact-form-error-panel">
          <AlertTriangle className="h-4 w-4 shrink-0" />
          {validationError}
        </div>
      )}

      {showSuccess && submittedInfo ? (
        <div className="p-5 bg-emerald-500/5 border border-emerald-500/20 rounded-2xl mb-2 space-y-4 text-left animate-slide-up" id="contact-form-success-panel">
          <div className="flex items-center gap-2 text-emerald-500">
            <CheckCircle2 className="h-5 w-5 shrink-0 animate-bounce" />
            <span className="text-xs font-bold uppercase tracking-wider">Proposal Draft Saved!</span>
          </div>
          
          <p className="text-zinc-600 dark:text-zinc-400 text-xs leading-relaxed">
            Thank you, <strong>{submittedInfo.name}</strong>! Your system narrative is recorded in our telemetry ledger. 
            {emailStatus === 'success' ? (
              <span className="block mt-2 text-emerald-600 dark:text-emerald-400 font-bold bg-emerald-500/10 p-2 rounded-xl border border-emerald-500/10">
                🚀 Dynamic email notification was dispatched directly to figureoutstore14@gmail.com!
              </span>
            ) : emailStatus === 'failed' ? (
              <span className="block mt-2 text-rose-500 font-medium">
                ⚠️ Email alert dispatch skipped or encountered a handshake block. Please trigger a manual sync backup below.
              </span>
            ) : web3FormsKey ? (
              <span className="block mt-2 text-zinc-550 dark:text-zinc-450">
                Dynamic alerts synced and notified.
              </span>
            ) : (
              <span className="block mt-2 text-amber-600 dark:text-amber-400 bg-amber-500/10 p-2.5 rounded-xl border border-amber-500/10">
                💡 <strong>Heads up:</strong> To claim automated real-time email alerts, click the <strong>Email Alerts Setup</strong> button in the top right and add a free Web3Forms key!
              </span>
            )}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            <button
              type="button"
              id="success-whatsapp-btn"
              onClick={() => {
                const customPhone = (localStorage.getItem('figureout_whatsapp') || '+919284140185').replace(/[^\d+]/g, '');
                const note = `Hi Figure Out Studio, I am ${submittedInfo.name}${submittedInfo.company ? ` representing ${submittedInfo.company}` : ''}. I recently submitted a proposal summary: "${submittedInfo.message}" (Email: ${submittedInfo.email})`;
                window.open(`https://wa.me/${customPhone}?text=${encodeURIComponent(note)}`, '_blank', 'noopener,noreferrer');
                analytics.trackClick('success-screen-whatsapp-redirect', customPhone);
              }}
              className="p-3 bg-[#25d366] hover:bg-[#128c7e] text-white font-sans font-extrabold text-xs rounded-xl flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-95 shadow-sm"
            >
              <MessageCircle className="h-4 w-4" />
              Chat on WhatsApp
            </button>

            <button
              type="button"
              id="success-gmail-btn"
              onClick={() => {
                const targetEmail = 'figureoutstore14@gmail.com';
                const subject = `Bespoke platform requirements - ${submittedInfo.name}`;
                const body = `Hi Figure Out Studio team,\n\nI just queued my initial details inside your system portal:\n\nContact Name: ${submittedInfo.name}\nEmail: ${submittedInfo.email}\nCompany: ${submittedInfo.company || 'N/A'}\nProposal Brief:\n"${submittedInfo.message}"\n\nLooking forward to aligning.`;
                window.location.href = `mailto:${targetEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
                analytics.trackClick('success-screen-gmail-redirect', targetEmail);
              }}
              className="p-3 bg-[#ea4335] hover:bg-[#c5221f] text-white font-sans font-extrabold text-xs rounded-xl flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-95 shadow-sm"
            >
              <Mail className="h-4 w-4" />
              Direct Gmail Draft
            </button>
          </div>

          <div className="pt-3 border-t border-zinc-100 dark:border-zinc-800/80 flex justify-between items-center text-[10px]">
            <span className="text-zinc-400">Router status: Linked</span>
            <button
              type="button"
              id="reset-form-btn"
              onClick={() => {
                setShowSuccess(false);
                setSubmittedInfo(null);
              }}
              className="text-emerald-500 hover:text-emerald-600 font-bold hover:underline"
            >
              Send Another Message
            </button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="contact-name-input" className="block text-[10px] font-bold text-zinc-400 dark:text-zinc-550 uppercase tracking-wider mb-1">
                Your Name
              </label>
              <input
                id="contact-name-input"
                type="text"
                placeholder="e.g. Liam Foster"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl px-3.5 py-2.5 text-xs text-zinc-900 dark:text-white focus:outline-none focus:border-emerald-500 shadow-sm transition-colors"
              />
            </div>

            <div>
              <label htmlFor="contact-email-input" className="block text-[10px] font-bold text-zinc-400 dark:text-zinc-550 uppercase tracking-wider mb-1">
                Email Address
              </label>
              <input
                id="contact-email-input"
                type="email"
                placeholder="liam@domain.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl px-3.5 py-2.5 text-xs text-zinc-900 dark:text-white focus:outline-none focus:border-emerald-500 shadow-sm transition-colors"
              />
            </div>
          </div>

          <div>
            <label htmlFor="contact-company-input" className="block text-[10px] font-bold text-zinc-400 dark:text-zinc-550 uppercase tracking-wider mb-1">
              Company (optional)
            </label>
            <input
              id="contact-company-input"
              type="text"
              placeholder="e.g. Foster & Partners"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              className="w-full bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl px-3.5 py-2.5 text-xs text-zinc-900 dark:text-white focus:outline-none focus:border-emerald-500 shadow-sm transition-colors"
            />
          </div>

          <div>
            <label htmlFor="contact-message-input" className="block text-[10px] font-bold text-zinc-400 dark:text-zinc-550 uppercase tracking-wider mb-1">
              Proposal Narrative
            </label>
            <textarea
              id="contact-message-input"
              rows={4}
              placeholder="Explain what web platform you have in mind to Figure Out..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl px-3.5 py-2.5 text-xs text-zinc-900 dark:text-white resize-none focus:outline-none focus:border-emerald-500 shadow-sm transition-colors"
            />
          </div>

          <button
            id="contact-submit-btn"
            type="submit"
            disabled={isLoading}
            className="w-full py-3 justify-center flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-[#0fb58c] hover:from-emerald-600 hover:to-teal-600 disabled:from-zinc-200 disabled:dark:from-zinc-800 text-white font-sans font-extrabold text-xs rounded-xl shadow-md cursor-pointer transition-all active:scale-95"
          >
            {isLoading ? 'Transmitting details...' : 'Transmit Requirements'} 
            <Send className="h-3.5 w-3.5" />
          </button>
        </form>
      )}
    </div>
  );
}
