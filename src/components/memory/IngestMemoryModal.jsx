import React, { useState } from 'react';
import Modal from '../common/Modal';
import { Brain, Sparkles, Send, Database, Tag } from 'lucide-react';
import { MOCK_CUSTOMERS } from '../../data/mockCustomers';

export default function IngestMemoryModal({ isOpen, onClose, onIngest }) {
  const [customerId, setCustomerId] = useState('cust_001');
  const [category, setCategory] = useState('preferences');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tagsInput, setTagsInput] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    setIsSubmitting(true);
    const customer = MOCK_CUSTOMERS.find(c => c.id === customerId) || MOCK_CUSTOMERS[0];
    const tags = tagsInput.split(',').map(t => t.trim()).filter(Boolean);

    setTimeout(() => {
      onIngest({
        customerId,
        customerName: customer.name,
        category,
        title,
        content,
        tags: tags.length ? tags : ['Ingested', 'Manual']
      });
      setIsSubmitting(false);
      setTitle('');
      setContent('');
      setTagsInput('');
      onClose();
    }, 600);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Ingest New Vector Memory (Hindsight)">
      <form onSubmit={handleSubmit} className="space-y-4 text-xs">
        <div>
          <label className="block text-slate-300 mb-1 font-semibold">Select Customer</label>
          <select
            value={customerId}
            onChange={(e) => setCustomerId(e.target.value)}
            className="w-full p-2.5 rounded-xl border bg-dark-card/80 border-white/10 text-slate-200 focus:outline-none focus:ring-1 focus:ring-brand-500"
          >
            {MOCK_CUSTOMERS.map(c => (
              <option key={c.id} value={c.id}>{c.name} ({c.company})</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-slate-300 mb-1 font-semibold">Memory Category</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full p-2.5 rounded-xl border bg-dark-card/80 border-white/10 text-slate-200 focus:outline-none focus:ring-1 focus:ring-brand-500"
          >
            <option value="preferences">Customer Preferences</option>
            <option value="issues">Previous Issues</option>
            <option value="solutions">Successful Solutions</option>
            <option value="history">Conversation History</option>
            <option value="feedback">Customer Feedback</option>
          </select>
        </div>

        <div>
          <label className="block text-slate-300 mb-1 font-semibold">Memory Title</label>
          <input
            type="text"
            placeholder="e.g. Prefers Tailwind v4 with Turbopack"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="w-full p-2.5 rounded-xl border bg-dark-card/80 border-white/10 text-slate-200 focus:outline-none focus:ring-1 focus:ring-brand-500"
          />
        </div>

        <div>
          <label className="block text-slate-300 mb-1 font-semibold">Extracted Knowledge Content</label>
          <textarea
            rows={3}
            placeholder="Describe the exact configuration, stack preference, or verified solution to store in Hindsight..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
            className="w-full p-2.5 rounded-xl border bg-dark-card/80 border-white/10 text-slate-200 focus:outline-none focus:ring-1 focus:ring-brand-500"
          />
        </div>

        <div>
          <label className="block text-slate-300 mb-1 font-semibold">Semantic Tags (Comma separated)</label>
          <input
            type="text"
            placeholder="e.g. Next.js, Tailwind, Turbopack, Frontend"
            value={tagsInput}
            onChange={(e) => setTagsInput(e.target.value)}
            className="w-full p-2.5 rounded-xl border bg-dark-card/80 border-white/10 text-slate-200 focus:outline-none focus:ring-1 focus:ring-brand-500"
          />
        </div>

        <div className="pt-3 border-t border-white/10 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-slate-400 hover:text-white"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 shadow-neon-purple disabled:opacity-50"
          >
            <Sparkles className="w-4 h-4" />
            <span>{isSubmitting ? 'Vectorizing...' : 'Ingest Memory'}</span>
          </button>
        </div>
      </form>
    </Modal>
  );
}
