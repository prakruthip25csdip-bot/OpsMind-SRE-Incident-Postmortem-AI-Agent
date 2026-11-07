import apiClient from './api';
import { MOCK_CUSTOMERS } from '../data/mockCustomers';
import { MOCK_MEMORIES } from '../data/mockMemories';

export const customerService = {
  async getCustomers({ search = '', plan = 'all', isLive = false } = {}) {
    if (isLive) {
      try {
        const res = await apiClient.get('/api/customers', { params: { search, plan } });
        return { data: res.data, isLive: true };
      } catch (err) {
        console.warn('Backend unavailable, using demo customers');
      }
    }

    let customers = [...MOCK_CUSTOMERS];
    if (search.trim()) {
      const q = search.toLowerCase();
      customers = customers.filter(c =>
        c.name.toLowerCase().includes(q) ||
        c.email.toLowerCase().includes(q) ||
        c.company.toLowerCase().includes(q)
      );
    }
    if (plan && plan !== 'all') {
      customers = customers.filter(c => c.plan.toLowerCase().includes(plan.toLowerCase()));
    }

    return { data: customers, isLive: false };
  },

  async getCustomerById(id, isLive = false) {
    if (isLive) {
      try {
        const res = await apiClient.get(`/api/customers/${id}`);
        return { data: res.data, isLive: true };
      } catch (err) {
        console.warn('Backend unavailable, using demo customer detail');
      }
    }
    const customer = MOCK_CUSTOMERS.find(c => c.id === id) || MOCK_CUSTOMERS[0];
    const customerMemories = MOCK_MEMORIES.filter(m => m.customerId === id);
    return { data: { ...customer, memories: customerMemories }, isLive: false };
  }
};
