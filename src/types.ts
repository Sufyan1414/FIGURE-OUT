export interface Project {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  longDescription: string;
  category: string;
  image: string;
  technologies: string[];
  metrics: { label: string; value: string }[];
  client: string;
  date: string;
  liveUrl?: string;
  caseStudyContent?: string;
}

export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  date: string;
  readTime: string;
  coverImage: string;
  tags: string[];
  published: boolean;
}

export interface SupportTicket {
  id: string;
  clientName: string;
  clientEmail: string;
  subject: string;
  category: 'New Build' | 'Maintenance' | 'UI/UX Redesign' | 'Bug Fix' | 'Speed Optimization';
  description: string;
  priority: 'low' | 'medium' | 'high';
  createdAt: string;
  status: 'Pending' | 'Reviewing' | 'In Progress' | 'Ready';
  timeline: { status: string; date: string; comment: string }[];
  messages: { sender: 'client' | 'support'; text: string; timestamp: string }[];
}

export interface AnalyticsRecord {
  pageViews: number;
  clicks: { [elementId: string]: number };
  formSubmissions: number;
  sessionTimeline: { timestamp: string; event: string; detail?: string }[];
}

export type ViewTab = 'home' | 'projects' | 'blog' | 'dashboard' | 'analytics';
