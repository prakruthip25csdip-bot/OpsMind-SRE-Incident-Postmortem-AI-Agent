import apiClient from './api';
import { MOCK_TICKETS } from '../data/mockTickets';

export const ticketService = {
  async getTickets({ status = 'all', priority = 'all', search = '', isLive = false } = {}) {
    if (isLive) {
      try {
        const res = await apiClient.get('/api/tickets', { params: { status, priority, search } });
        return { data: res.data, isLive: true };
      } catch (err) {
        console.warn('Backend unavailable, using demo tickets');
      }
    }

    let tickets = [...MOCK_TICKETS];
    if (status && status !== 'all') {
      tickets = tickets.filter(t => t.status === status);
    }
    if (priority && priority !== 'all') {
      tickets = tickets.filter(t => t.priority === priority);
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      tickets = tickets.filter(t => 
        t.title.toLowerCase().includes(q) ||
        t.customerName.toLowerCase().includes(q) ||
        t.id.toLowerCase().includes(q)
      );
    }

    return { data: tickets, isLive: false };
  },

  async createTicket(newTicket, isLive = false) {
    if (isLive) {
      try {
        const res = await apiClient.post('/api/tickets', newTicket);
        return { data: res.data, isLive: true };
      } catch (err) {
        throw new Error('Backend unavailable to create live ticket');
      }
    }

    await new Promise(r => setTimeout(r, 400));
    const created = {
      id: `TICK-${Math.floor(1080 + Math.random() * 50)}`,
      status: 'open',
      createdAt: 'Just now',
      assignedAgent: 'AI Agent (MemoraBot)',
      memoryUsed: false,
      messagesCount: 1,
      ...newTicket
    };
    return { data: created, isLive: false };
  }
};
