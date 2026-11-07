// Analytics Mock Data for MemoraDesk

export const ANALYTICS_SUMMARY = {
  totalInteractions: '24,892',
  interactionsTrend: '+18.4%',
  firstContactResolution: '91.8%',
  fcrTrend: '+28.5%',
  avgResponseTimeMs: '340ms',
  responseTimeTrend: '-64.2%',
  hindsightHitRate: '94.6%',
  hitRateTrend: '+12.1%',
  csatScore: '4.92 / 5.0',
  csatTrend: '+0.42',
  repeatedIssuesReduced: '-68.5%',
  totalMemoriesCreated: '14,280'
};

export const INTERACTION_ACTIVITY_DATA = [
  { time: 'Mon', interactions: 240, memoryRetrievals: 210, resolvedWithoutEscalation: 220 },
  { time: 'Tue', interactions: 380, memoryRetrievals: 345, resolvedWithoutEscalation: 360 },
  { time: 'Wed', interactions: 450, memoryRetrievals: 415, resolvedWithoutEscalation: 425 },
  { time: 'Thu', interactions: 520, memoryRetrievals: 490, resolvedWithoutEscalation: 495 },
  { time: 'Fri', interactions: 610, memoryRetrievals: 580, resolvedWithoutEscalation: 590 },
  { time: 'Sat', interactions: 290, memoryRetrievals: 275, resolvedWithoutEscalation: 280 },
  { time: 'Sun', interactions: 210, memoryRetrievals: 198, resolvedWithoutEscalation: 205 },
];

export const MEMORY_RETRIEVAL_TREND = [
  { month: 'Jun', hitRate: 72, memories: 2100 },
  { month: 'Jul', hitRate: 78, memories: 4200 },
  { month: 'Aug', hitRate: 83, memories: 6800 },
  { month: 'Sep', hitRate: 88, memories: 9400 },
  { month: 'Oct', hitRate: 92, memories: 12100 },
  { month: 'Nov', hitRate: 95, memories: 14280 },
];

export const TICKET_CATEGORY_DATA = [
  { name: 'Database & Pooling', value: 34, color: '#3b82f6' },
  { name: 'API & Webhooks', value: 28, color: '#8b5cf6' },
  { name: 'DevOps & Containers', value: 18, color: '#06b6d4' },
  { name: 'Security & GDPR', value: 12, color: '#10b981' },
  { name: 'Billing & Tiers', value: 8, color: '#f59e0b' },
];

export const TOP_RECALLED_TOPICS = [
  { topic: 'Supabase statement_timeout', count: 482, confidence: '98%' },
  { topic: 'Stripe Raw Body HMAC', count: 394, confidence: '96%' },
  { topic: 'Docker max-old-space-size', count: 320, confidence: '94%' },
  { topic: 'Frankfurt EU-Central Pinning', count: 285, confidence: '99%' },
  { topic: 'Redis Sentinel Failover', count: 210, confidence: '95%' },
  { topic: 'JWT Token Expiration Refresh', count: 188, confidence: '93%' }
];
