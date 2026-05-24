import { AnalyticsRecord } from '../types';

const METRICS_KEY = 'figure_out_analytics';

const defaultRecord: AnalyticsRecord = {
  pageViews: 0,
  clicks: {},
  formSubmissions: 0,
  sessionTimeline: []
};

function getAnalytics(): AnalyticsRecord {
  try {
    const raw = localStorage.getItem(METRICS_KEY);
    if (!raw) return { ...defaultRecord, pageViews: 1, sessionTimeline: [{ timestamp: new Date().toISOString(), event: 'Session Start', detail: 'User entered Figure Out' }] };
    return JSON.parse(raw);
  } catch {
    return { ...defaultRecord };
  }
}

function saveAnalytics(record: AnalyticsRecord) {
  try {
    localStorage.setItem(METRICS_KEY, JSON.stringify(record));
  } catch (e) {
    console.error('Analytics save error', e);
  }
}

export const analytics = {
  get(): AnalyticsRecord {
    return getAnalytics();
  },

  trackPageView(tabName: string) {
    const data = getAnalytics();
    data.pageViews += 1;
    data.sessionTimeline.push({
      timestamp: new Date().toISOString(),
      event: 'Page Navigation',
      detail: `Navigated to ${tabName}`
    });
    // Cap timeline at 100 entries to prevent localStorage bloating
    if (data.sessionTimeline.length > 100) {
      data.sessionTimeline.shift();
    }
    saveAnalytics(data);
  },

  trackClick(elementId: string, textContext?: string) {
    const data = getAnalytics();
    data.clicks[elementId] = (data.clicks[elementId] || 0) + 1;
    data.sessionTimeline.push({
      timestamp: new Date().toISOString(),
      event: 'Click Event',
      detail: `Clicked ${elementId}${textContext ? ` (${textContext})` : ''}`
    });
    if (data.sessionTimeline.length > 100) {
      data.sessionTimeline.shift();
    }
    saveAnalytics(data);
  },

  trackFormSubmission(formName: string) {
    const data = getAnalytics();
    data.formSubmissions += 1;
    data.sessionTimeline.push({
      timestamp: new Date().toISOString(),
      event: 'Form Submitted',
      detail: `Successfully completed ${formName}`
    });
    if (data.sessionTimeline.length > 100) {
      data.sessionTimeline.shift();
    }
    saveAnalytics(data);
  },

  clear() {
    saveAnalytics({
      pageViews: 1,
      clicks: {},
      formSubmissions: 0,
      sessionTimeline: [{ timestamp: new Date().toISOString(), event: 'Session Cleaned', detail: 'Cleared visitor logs' }]
    });
  }
};
