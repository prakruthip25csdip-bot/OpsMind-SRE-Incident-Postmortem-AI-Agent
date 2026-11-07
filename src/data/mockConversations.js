// Mock Conversations for MemoraDesk Support Chat

export const MOCK_CONVERSATIONS = [
  {
    id: 'conv_001',
    customerId: 'cust_001',
    customerName: 'Sarah Chen',
    customerCompany: 'FinTech Labs Global',
    title: 'Database connection pool timeout on Supabase',
    lastMessage: 'All clear now! The statement_timeout fix worked reliably.',
    timestamp: '10m ago',
    unread: false,
    status: 'resolved',
    messages: [
      {
        id: 'msg_101',
        sender: 'customer',
        text: "Hi MemoraDesk, our backend API is intermittently dropping database connections during our EU market open. It throws 'connection pool exhausted' after ~15 minutes.",
        timestamp: '10:41 AM'
      },
      {
        id: 'msg_102',
        sender: 'ai',
        text: "Hello Sarah! Good to assist you again. I recall from our previous session on October 28th (Ticket #TICK-0988) that you're running Node.js TypeScript with Prisma on Supabase with AWS us-east-1.\n\nLooking at your architecture history, this is likely related to the pooler mode timeout we adjusted previously when statement_timeout was hit. Here is the verified solution tailored for your setup:",
        codeSnippet: `// In your prisma schema / connection string:
DATABASE_URL="postgres://user:password@aws-0-us-east-1.pooler.supabase.com:6543/postgres?pgbouncer=true&connection_limit=15&statement_timeout=15000&sslmode=require"

// And in your prisma client init:
const prisma = new PrismaClient({
  datasources: {
    db: { url: process.env.DATABASE_URL }
  },
  log: ['warn', 'error'],
});`,
        retrievedMemories: [
          {
            id: 'mem_9012a',
            category: 'Customer Preferences',
            snippet: 'Prefers cURL & Node.js TypeScript snippets; dislikes Python intros'
          },
          {
            id: 'mem_9013b',
            category: 'Successful Solutions',
            snippet: 'Resolved timeout on Supabase pool by statement_timeout=15000 & sslmode=require'
          }
        ],
        model: 'Groq Llama-3.3-70b (Hindsight Enhanced)',
        latency: '342ms',
        timestamp: '10:42 AM'
      },
      {
        id: 'msg_103',
        sender: 'customer',
        text: "Incredible! You remembered the exact connection string format from last month without me needing to explain our Prisma setup again. Applying it now.",
        timestamp: '10:45 AM'
      },
      {
        id: 'msg_104',
        sender: 'ai',
        text: "You're very welcome, Sarah! I've automatically updated your memory profile in Hindsight to mark this recurring connection pool parameter as high priority for future interactions. Let me know if you need any load testing checks!",
        retrievedMemories: [],
        timestamp: '10:46 AM'
      }
    ]
  },
  {
    id: 'conv_002',
    customerId: 'cust_002',
    customerName: 'Alex Rivera',
    customerCompany: 'HyperCommerce',
    title: 'Stripe webhook signature raw body validation',
    lastMessage: 'Configured bodyParser.raw for /webhooks.',
    timestamp: '1h ago',
    unread: true,
    status: 'in_progress',
    messages: [
      {
        id: 'msg_201',
        sender: 'customer',
        text: "Getting HTTP 400 'No signatures found matching the expected signature for payload' on our NestJS Stripe webhook handler.",
        timestamp: '09:12 AM'
      },
      {
        id: 'msg_202',
        sender: 'ai',
        text: "Hi Alex! Checking your stack preferences: I see HyperCommerce runs NestJS with Fastify/Express under GCP europe-west1.\n\nThis error occurs when the raw request payload has already been parsed into JSON by body-parser before Stripe's `stripe.webhooks.constructEvent()` can compute the HMAC SHA-256 signature.",
        codeSnippet: `// main.ts
const app = await NestFactory.create(AppModule, {
  rawBody: true, // Crucial for NestJS 9+
});

// In Stripe controller:
@Post('webhook')
async handleWebhook(
  @Req() req: RawBodyRequest<Request>,
  @Headers('stripe-signature') signature: string
) {
  const event = this.stripeService.constructEventFromPayload(
    req.rawBody, // Pass raw buffer, NOT req.body
    signature
  );
  return { received: true };
}`,
        retrievedMemories: [
          {
            id: 'mem_9014c',
            category: 'Previous Issues',
            snippet: 'Stripe Webhook Signature Verification Failure on NestJS'
          },
          {
            id: 'mem_9015d',
            category: 'Successful Solutions',
            snippet: 'Raw Buffer Middleware for Webhook Endpoints'
          }
        ],
        model: 'Groq Llama-3.3-70b (Hindsight Enhanced)',
        latency: '298ms',
        timestamp: '09:13 AM'
      }
    ]
  },
  {
    id: 'conv_003',
    customerId: 'cust_003',
    customerName: 'Elena Rostova',
    customerCompany: 'NovaBank Digital',
    title: 'GDPR audit & Frankfurt data residency confirmation',
    lastMessage: 'Memory vectors verified at eu-central-1.',
    timestamp: '2h ago',
    unread: false,
    status: 'resolved',
    messages: [
      {
        id: 'msg_301',
        sender: 'customer',
        text: "We are preparing for our BaFin security audit tomorrow. Can you verify where NovaBank's persistent AI memory nodes are physically partitioned?",
        timestamp: '08:15 AM'
      },
      {
        id: 'msg_302',
        sender: 'ai',
        text: "Good morning Elena. I have verified your Hindsight cluster configuration in accordance with your GDPR enterprise profile (Memory ID: mem_9016e).\n\nAll 42 persistent memory vectors belonging to NovaBank Digital are strictly pinned to our Frankfurt (eu-central-1) sovereign cluster with AES-256 at-rest encryption and zero cross-border replication.",
        retrievedMemories: [
          {
            id: 'mem_9016e',
            category: 'Customer Preferences',
            snippet: 'EU-Central Data Residency Requirement (GDPR Banking Compliance)'
          }
        ],
        model: 'Groq Llama-3.3-70b (Hindsight Enhanced)',
        latency: '260ms',
        timestamp: '08:16 AM'
      }
    ]
  }
];

export const SUGGESTED_PROMPTS = [
  "How do I fix connection pooling on Supabase with Prisma?",
  "Why is my Stripe webhook signature verification failing?",
  "Check my past tickets and persistent preferences",
  "How do I resolve Docker build OOMKilled in CI/CD?",
  "What discount code was applied to my Enterprise renewal?"
];
