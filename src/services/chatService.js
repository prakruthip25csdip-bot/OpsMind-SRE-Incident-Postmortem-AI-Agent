import apiClient from './api';
import { MOCK_CONVERSATIONS } from '../data/mockConversations';
import { MOCK_MEMORIES } from '../data/mockMemories';

export const chatService = {
  // Get all active conversations
  async getConversations(isLive = false) {
    if (isLive) {
      try {
        const response = await apiClient.get('/api/chat/conversations');
        return { data: response.data, isLive: true };
      } catch (err) {
        console.warn('Failed to fetch from live backend, falling back to demo conversations');
      }
    }
    return { data: MOCK_CONVERSATIONS, isLive: false };
  },

  // Send a message and retrieve persistent memory response
  async sendMessage({ conversationId, customerId, message, isLive = false }) {
    if (isLive) {
      try {
        const response = await apiClient.post('/api/chat/message', {
          conversationId,
          customerId,
          message,
        });
        return {
          response: response.data,
          isLive: true,
          notice: 'Live response via FastAPI + Groq + Hindsight'
        };
      } catch (err) {
        throw new Error('Live FastAPI backend unreachable on http://localhost:8000. Switch to Demo Mode or launch the backend.');
      }
    }

    // Demo Mode Simulation with dynamic memory lookup
    await new Promise((resolve) => setTimeout(resolve, 800)); // realistic thinking latency

    const lower = message.toLowerCase();
    let relevantMemories = [];
    let responseText = '';
    let codeSnippet = null;

    if (lower.includes('database') || lower.includes('supabase') || lower.includes('pool') || lower.includes('timeout')) {
      relevantMemories = MOCK_MEMORIES.filter(m => m.tags.includes('PostgreSQL') || m.tags.includes('SSL'));
      responseText = "I recalled from your previous tickets that you're using Prisma with Supabase on AWS us-east-1. The connection pool timeout can be mitigated by adjusting the pooler string statement_timeout and connection limits.";
      codeSnippet = `DATABASE_URL="postgres://user:pass@aws-0-us-east-1.pooler.supabase.com:6543/postgres?pgbouncer=true&connection_limit=25&statement_timeout=15000&sslmode=require"`;
    } else if (lower.includes('stripe') || lower.includes('webhook') || lower.includes('raw') || lower.includes('signature')) {
      relevantMemories = MOCK_MEMORIES.filter(m => m.tags.includes('Stripe') || m.tags.includes('Webhooks'));
      responseText = "Checking your tech preferences: HyperCommerce runs NestJS with Fastify on GCP. You need to enable rawBody in NestFactory and use the raw buffer for constructEvent.";
      codeSnippet = `const app = await NestFactory.create(AppModule, { rawBody: true });\n// Use req.rawBody with Stripe signature`;
    } else if (lower.includes('docker') || lower.includes('oom') || lower.includes('memory') || lower.includes('build')) {
      relevantMemories = MOCK_MEMORIES.filter(m => m.tags.includes('Docker') || m.tags.includes('OOMKilled'));
      responseText = "Your Docker container build is hitting V8 heap exhaustion during Next.js standalone export. Add NODE_OPTIONS to your Dockerfile as tested previously.";
      codeSnippet = `ENV NODE_OPTIONS="--max-old-space-size=4096"\nRUN npm run build`;
    } else {
      relevantMemories = [MOCK_MEMORIES[0]];
      responseText = `Thanks for your query. I've referenced your historical preferences (${relevantMemories[0].title}) in Hindsight to tailor this response. Let me know if you need specific config snippets!`;
    }

    return {
      response: {
        id: 'msg_' + Date.now(),
        sender: 'ai',
        text: responseText,
        codeSnippet,
        retrievedMemories: relevantMemories,
        model: 'Groq Llama-3.3-70b (Simulated Hindsight)',
        latency: '315ms',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      },
      isLive: false,
      notice: 'Demo simulation data (connect FastAPI on port 8000 for live pipeline)'
    };
  }
};
