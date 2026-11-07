import apiClient from './api';
import { MOCK_MEMORIES, MEMORY_STATS } from '../data/mockMemories';

export const memoryService = {
  async getMemories({ category = 'all', searchQuery = '', isLive = false } = {}) {
    if (isLive) {
      try {
        const response = await apiClient.get('/api/memories', {
          params: { category, search: searchQuery }
        });
        return { data: response.data, isLive: true };
      } catch (err) {
        console.warn('Backend unavailable, using demo memory bank');
      }
    }

    let results = [...MOCK_MEMORIES];

    if (category && category !== 'all') {
      results = results.filter(m => m.category === category);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      results = results.filter(m => 
        m.title.toLowerCase().includes(q) ||
        m.content.toLowerCase().includes(q) ||
        m.customerName.toLowerCase().includes(q) ||
        m.tags.some(t => t.toLowerCase().includes(q))
      );
    }

    return { data: results, isLive: false };
  },

  async ingestMemory(newMemory, isLive = false) {
    if (isLive) {
      try {
        const res = await apiClient.post('/api/memories/ingest', newMemory);
        return { data: res.data, isLive: true };
      } catch (err) {
        throw new Error('Could not persist to live Hindsight vector store: Backend unreachable');
      }
    }

    // In demo mode, simulate embedding generation and node indexing
    await new Promise(r => setTimeout(r, 600));
    const created = {
      id: 'mem_' + Math.random().toString(36).substring(2, 7),
      confidence: 0.96,
      similarityScore: 0.92,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      embeddingDim: 1536,
      status: 'active',
      recallCount: 1,
      decayScore: 0.01,
      hindsightNode: {
        x: Math.floor(Math.random() * 500) + 150,
        y: Math.floor(Math.random() * 300) + 100,
        group: 1
      },
      ...newMemory
    };

    return { data: created, isLive: false };
  },

  async getStats(isLive = false) {
    if (isLive) {
      try {
        const res = await apiClient.get('/api/memories/stats');
        return { data: res.data, isLive: true };
      } catch (err) {
        console.warn('Backend stats unavailable, using demo stats');
      }
    }
    return { data: MEMORY_STATS, isLive: false };
  }
};
