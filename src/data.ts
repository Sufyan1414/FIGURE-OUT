import { Project, BlogPost, SupportTicket } from './types';

export const INITIAL_PROJECTS: Project[] = [
  {
    id: 'prism-commerce',
    title: 'Prism Commerce',
    subtitle: 'High-performance Headless E-commerce',
    description: 'A lightning-fast modern shopping experience built with React, Tailwind CSS, and headless GraphQL API integration.',
    longDescription: 'Prism Commerce reimagines online retail with instant page updates, sub-100ms transitions, and an ultra-clean minimalist checkout system. It is fully optimized for mobile gestures, features custom tactile feedback on item sheets, and implements a multi-currency layered checkout.',
    category: 'E-Commerce',
    image: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
    technologies: ['React', 'Tailwind', 'GraphQL', 'NextJS', 'GSAP'],
    metrics: [
      { label: 'Lighthouse Score', value: '100/100' },
      { label: 'Conversion Lift', value: '+42%' },
      { label: 'Bounce Rate Reduction', value: '-28%' }
    ],
    client: 'Prism Apparel Ltd.',
    date: 'Dec 2025',
    liveUrl: 'https://prism-example.figout.dev',
    caseStudyContent: 'By decoupling the frontend visual layer from the inventory database, we engineered a completely custom browsing layout. We applied GSAP to orchestrate stagger-entrance animations of product cards upon catalog scroll, leading to a highly fluid experiential shopping grid.'
  },
  {
    id: 'aether-saas',
    title: 'Aether Platform',
    subtitle: 'Next-Gen Financial SaaS & Reporting',
    description: 'An interactive analytical SaaS system monitoring digital currency indexes with custom SVG chart integrations.',
    longDescription: 'Aether is a bespoke financial SaaS crafted for micro-transaction startups. It integrates live event streams, aggregates complex metadata into intuitive visual summaries, and lets users export beautiful visual reports in modern formats inside their workspaces.',
    category: 'SaaS Platform',
    image: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
    technologies: ['React', 'Recharts', 'TypeScript', 'Tailwind', 'Motion'],
    metrics: [
      { label: 'Load Time', value: '0.4s' },
      { label: 'Data Latency', value: '<50ms' },
      { label: 'Active Daily Users', value: '14.8k' }
    ],
    client: 'Aether Analytics Inc.',
    date: 'Feb 2026',
    liveUrl: 'https://aether-example.figout.dev',
    caseStudyContent: 'Building a dynamic data client in React requires extremely meticulous rendering optimizations. We utilized virtualized grids and memoized coordinate streams to feed Recharts paths, enabling flawless interactive exploration of 10,000+ data nodes on hand-held mobile devices.'
  },
  {
    id: 'krypton-web3',
    title: 'Krypton Protocol',
    subtitle: 'Interactive Decentralized Marketplace',
    description: 'A Web3 portal displaying live transactions and asset states on high-contrast black-sand canvas maps.',
    longDescription: 'Krypton replaces rigid grid tables with an organic, interactive canvas map of transactions. Users drag, click, and inspect real-time network activity. The application utilizes physical coordinates and spring motion to give every event an organic weight.',
    category: 'Web3 / Interactive',
    image: 'linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%)',
    technologies: ['React', 'GSAP', 'HTML5 Canvas', 'Tailwind'],
    metrics: [
      { label: 'Visitor CTR', value: '18.4%' },
      { label: 'Session Time', value: '5m 12s' },
      { label: 'Client Feedback', value: '9.8/10' }
    ],
    client: 'Krypton Labs',
    date: 'Apr 2026',
    liveUrl: 'https://krypton-example.figout.dev',
    caseStudyContent: 'We designed custom particle systems inside a responsive viewport container. To prevent mobile battery fatigue during continuous canvas renders, we implemented viewport threshold checks, pausing physics simulation when the block is outside the browser frame.'
  }
];

export const INITIAL_BLOGS: BlogPost[] = [
  {
    id: 'blog-micro-animations',
    title: 'The Art of Micro-Animations: Keeping Visitors Engaged',
    excerpt: 'How subtle physical feedback, hover translations, and deliberate transitions double your app user retention.',
    content: `In the pursuit of visual novelty, web developers often over-animate. They bombard the viewport with spinning logos, scrolling starfields, and sliding grids before a user has even read the primary hero header. This is a common design anti-pattern.

True digital craftsmanship values subtle restraint. Micro-animations should respect the physics of real objects:
1. **Inertia**: Elements should decelerate naturally.
2. **Weight**: Large structural cards should transition slower than toggle buttons.
3. **Intent**: Only animate elements centered on the user's focus (such as checking a box, hovering a link, or opening a panel).

By implementing tactile scale downstrokes (e.g. \`scale-98\` on active clicks) and gentle, springy hover transitions, we bridge the gap between flat virtual screen grids and tangible manual buttons. In our test suites for Prism Commerce, adding these tiny interactive cues elevated session depth by over 15% and reduced premature form dropouts.`,
    category: 'Design & UX',
    date: '2026-05-18',
    readTime: '4 min read',
    coverImage: 'linear-gradient(135deg, #ec4899 0%, #be185d 100%)',
    tags: ['UX Design', 'Micro-interactions', 'GSAP', 'Tailwind'],
    published: true
  },
  {
    id: 'blog-seo-speeds',
    title: 'SEO in 2026: Designing for Instant Page Speeds and Performance',
    excerpt: 'Search engine algorithms have undergone a massive shift toward pure user latency. Here is how we hit 100 on Core Web Vitals.',
    content: `SEO is no longer just a matching game of keyword density and link profiles. Major search indices now rank websites directly based on layout transitions and interaction delays, punishing jittery, layout-shifting layouts.

### Core Architecture Pillars:
- **No Unused CSS**: Tailwind v4 compiles highly focused utility style definitions.
- **Static DOM Hydration**: Pre-render text structures so crawler bots acquire structured headlines instantly, bypassing slow JS execution pipelines.
- **Lazy Initializers**: Delay third-party tracking scripts until domestic assets have rendered and the interactive canvas is completely stable.

During our redesign of "Figure Out", we implemented an asynchronous tracking event loops queue. By delaying analytics execution until after the DOM completes rendering, we preserved sub-second visual interactivity on slow mobile networks while tracking robust user interaction logs.`,
    category: 'SEO & Performance',
    date: '2026-05-22',
    readTime: '6 min read',
    coverImage: 'linear-gradient(135deg, #eab308 0%, #ca8a04 100%)',
    tags: ['SEO', 'Page Speed', 'Core Web Vitals', 'Performance'],
    published: true
  },
  {
    id: 'blog-headless-state',
    title: 'State of Headless Commerce: What Next.js Brings to the Table',
    excerpt: 'The architecture behind sub-second page loads, decoupled content management, and bulletproof security.',
    content: `Traditional monolithic web storefronts are inherently fragile. A single custom script failure can crash the entire payment funnel, and heavy server-side templates delay essential paints.

By decoupling the frontend layout into a reactive React bundle served by globally distributed edge networks, we build high-availability portals that cannot easily fail.

### Why Headless wins:
1. **Bulletproof Security**: There is no database server directly exposed to public HTTP queries. The checkout and user secrets are handled by localized APIs.
2. **Infinite Visual Freedom**: We are not restricted by rigid template systems. We craft custom SVG canvases, complex page slides, and beautiful transitions that reinforce brand identity.

At Figure Out, we create custom headless systems that let clients edit text contents inside a beautiful CMS, while the site compiles to responsive static static pages on the fly, keeping load times instant.`,
    category: 'Dev Architecture',
    date: '2026-05-23',
    readTime: '5 min read',
    coverImage: 'linear-gradient(135deg, #14b8a6 0%, #0d9488 100%)',
    tags: ['Headless', 'React', 'APIs', 'NodeJS'],
    published: true
  }
];

export const INITIAL_TICKETS: SupportTicket[] = [
  {
    id: 'TKT-9481',
    clientName: 'Sarah Jenkins',
    clientEmail: 'sjenkins@prism.com',
    subject: 'Speed Optimization for Prism catalog pages',
    category: 'Speed Optimization',
    description: 'We are experiencing a slight lag when scrolling through the 5,000+ item dynamic catalog grid on older Safari devices. We need some custom debouncing or layout viewport virtualization.',
    priority: 'high',
    createdAt: '2026-05-23T14:32:00Z',
    status: 'In Progress',
    timeline: [
      { status: 'Pending', date: '2026-05-23T14:32:00Z', comment: 'Ticket submitted automatically from support dashboard' },
      { status: 'Reviewing', date: '2026-05-23T16:00:00Z', comment: 'Assigned to our Lead Performance Architect to analyze heap allocations' },
      { status: 'In Progress', date: '2026-05-24T08:15:00Z', comment: 'Refactoring scroll events to utilize Passive Event Listeners' }
    ],
    messages: [
      { sender: 'client', text: 'Hello FigOut team, I noticed minor stutter on iOS Safari. Our bounce rate is slightly higher because of it.', timestamp: '14:32' },
      { sender: 'support', text: 'Hi Sarah! We are on it. We are implementing a React virtualized scroll grid to pool dynamic elements. This will keep memory under 15MB even on standard mobile hardware.', timestamp: '16:05' }
    ]
  },
  {
    id: 'TKT-1082',
    clientName: 'Marcus Chen',
    clientEmail: 'marcus@aetherplatform.io',
    subject: 'Add CSV export to Aether reporting panel',
    category: 'New Build',
    description: 'We want to add a direct download button that allows premium users to export the aggregated dashboard tables directly as organized CSV documents.',
    priority: 'medium',
    createdAt: '2026-05-24T01:10:00Z',
    status: 'Reviewing',
    timeline: [
      { status: 'Pending', date: '2026-05-24T01:10:00Z', comment: 'Feature request captured from Support Interface' },
      { status: 'Reviewing', date: '2026-05-24T09:00:00Z', comment: 'Preparing architectural outline for client review' }
    ],
    messages: [
      { sender: 'client', text: 'An export-to-CSV capability would greatly assist our enterprise cohort.', timestamp: '01:10' }
    ]
  }
];
