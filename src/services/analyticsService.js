import apiClient from './api';
import {
  ANALYTICS_SUMMARY,
  INTERACTION_ACTIVITY_DATA,
  MEMORY_RETRIEVAL_TREND,
  TICKET_CATEGORY_DATA,
  TOP_RECALLED_TOPICS
} from '../data/mockAnalytics';

export const analyticsService = {
  async getSummary(isLive = false) {
    if (isLive) {
      try {
        const res = await apiClient.get('/api/analytics/summary');
        return { data: res.data, isLive: true };
      } catch (err) {
        console.warn('Backend unavailable, using demo analytics');
      }
    }
    return { data: ANALYTICS_SUMMARY, isLive: false };
  },

  async getActivityData(isLive = false) {
    if (isLive) {
      try {
        const res = await apiClient.get('/api/analytics/activity');
        return { data: res.data, isLive: true };
      } catch (err) {
        console.warn('Backend unavailable, using demo activity data');
      }
    }
    return {
      activity: INTERACTION_ACTIVITY_DATA,
      trend: MEMORY_RETRIEVAL_TREND,
      categories: TICKET_CATEGORY_DATA,
      topTopics: TOP_RECALLED_TOPICS,
      isLive: false
    };
  }
};
