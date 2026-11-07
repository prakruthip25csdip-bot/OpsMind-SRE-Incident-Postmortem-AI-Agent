// Scenarios for Before and After Memory Comparison

export const COMPARISON_SCENARIOS = [
  {
    id: 'scenario_db_timeout',
    title: 'Recurring Database Connection Timeout',
    customer: 'Sarah Chen (FinTech Labs)',
    customerQuery: "Our backend API is timing out on database queries again during high volume spikes.",
    
    withoutMemory: {
      model: 'Generic AI (Zero State)',
      status: 'Amnesic / Stateless',
      responseTime: '4.8s (requires 5 back-and-forth prompts)',
      frustrationScore: '8.5 / 10 (High)',
      repetitiveQuestions: [
        "What database engine are you currently using?",
        "Are you using an ORM like Hibernate, Prisma or TypeORM?",
        "What cloud provider hosts your database?",
        "Can you share your connection string configuration?"
      ],
      aiResponse: "Hello! Database timeouts can happen for many reasons. To help you troubleshoot, could you please tell me what database you are using (e.g. MySQL, PostgreSQL, MongoDB)? Also, are you hosted on AWS, GCP, or a local server? If you are using connection pooling, please share your max pool size and timeout settings.",
      outcome: "Sarah has to re-explain her entire architecture for the 4th time this month, wasting 25 minutes of engineering time."
    },

    withHindsight: {
      model: 'MemoraDesk (Hindsight + Groq)',
      status: 'Persistent Recall Active',
      responseTime: '340ms (Immediate resolution)',
      frustrationScore: '0.2 / 10 (Delighted)',
      recalledMemories: [
        {
          id: 'mem_9012a',
          title: 'Customer Preferences',
          detail: 'Sarah Chen prefers Node.js TypeScript and Prisma; hates repetitive questions.'
        },
        {
          id: 'mem_9013b',
          title: 'Historical Fix (Oct 28)',
          detail: 'Supabase pooler required statement_timeout=15000 and sslmode=require.'
        }
      ],
      aiResponse: "Hi Sarah! Welcome back. I see you're likely encountering the pooler timeout on your Supabase PostgreSQL cluster (AWS us-east-1) that we resolved on October 28th.\n\nSince your volume has surged, your Prisma pooler connection limit needs to be increased from 15 to 25 alongside the statement_timeout=15000 flag we previously tuned. Here is the exact parameter update for your DATABASE_URL:",
      codeSnippet: `// Updated Prisma Supabase pooler connection:
DATABASE_URL="postgres://user:pass@aws-0-us-east-1.pooler.supabase.com:6543/postgres?pgbouncer=true&connection_limit=25&statement_timeout=15000&sslmode=require"`,
      outcome: "Issue resolved in 2 minutes with zero repetitive questions. Customer gave 5/5 stars."
    },

    metrics: {
      timeToResolution: { without: '28 minutes', with: '2 minutes', improvement: '93% faster' },
      questionsAsked: { without: '4 questions', with: '0 questions', improvement: '100% saved' },
      developerEffort: { without: 'High frustration', with: 'Instant delight', improvement: 'Maximum' }
    }
  },
  {
    id: 'scenario_webhook',
    title: 'Stripe Webhook Signature Verification 400',
    customer: 'Alex Rivera (HyperCommerce)',
    customerQuery: "I'm still getting invalid signature 400 errors when handling Stripe charge.succeeded webhooks.",
    
    withoutMemory: {
      model: 'Generic AI (Zero State)',
      status: 'Amnesic / Stateless',
      responseTime: '3.9s',
      frustrationScore: '7.8 / 10',
      repetitiveQuestions: [
        "What framework are you writing your backend in?",
        "Are you using Stripe's official SDK or making manual HTTP calls?",
        "Are you running behind a reverse proxy like NGINX or Cloudflare?"
      ],
      aiResponse: "Invalid signature errors occur when the payload received does not match the signed payload. Make sure your Stripe webhook secret matches the environment key in your dashboard. If you are using Express, remember that bodyParser.json() alters the raw payload.",
      outcome: "Generic response that doesn't account for Alex's NestJS 10 Fastify adapter quirks."
    },

    withHindsight: {
      model: 'MemoraDesk (Hindsight + Groq)',
      status: 'Persistent Recall Active',
      responseTime: '298ms',
      frustrationScore: '0.1 / 10',
      recalledMemories: [
        {
          id: 'mem_9014c',
          title: 'Previous Issue',
          detail: 'HyperCommerce uses NestJS with rawBody: true needed for Stripe HMAC.'
        },
        {
          id: 'mem_9015d',
          title: 'Verified Fix',
          detail: 'Applied RawBodyRequest<Request> type guard to webhook controller.'
        }
      ],
      aiResponse: "Hey Alex! Remembering our setup from Tuesday: HyperCommerce uses NestJS with Fastify on GCP europe-west1.\n\nBecause you recently updated to NestJS 10, the global rawBody flag needs to be explicitly enabled in NestFactory.create() so Stripe's HMAC constructEvent receives the unaltered Uint8Array buffer:",
      codeSnippet: `// In main.ts:
const app = await NestFactory.create(AppModule, { rawBody: true });

// In stripe.controller.ts:
@Post('webhook')
handle(@Req() req: RawBodyRequest<Request>, @Headers('stripe-signature') sig: string) {
  return this.stripeService.constructEvent(req.rawBody, sig);
}`,
      outcome: "Alex pasted the fix and it worked on the first try."
    },

    metrics: {
      timeToResolution: { without: '35 minutes', with: '1.5 minutes', improvement: '95% faster' },
      questionsAsked: { without: '3 questions', with: '0 questions', improvement: '100% saved' },
      developerEffort: { without: 'Tedious debug loop', with: 'Direct copy-paste fix', improvement: 'Seamless' }
    }
  },
  {
    id: 'scenario_compliance',
    title: 'Enterprise GDPR Banking Data Residency',
    customer: 'Elena Rostova (NovaBank)',
    customerQuery: "Can you confirm our storage partitions for the upcoming annual BaFin audit?",
    
    withoutMemory: {
      model: 'Generic AI (Zero State)',
      status: 'Amnesic / Stateless',
      responseTime: '5.2s',
      frustrationScore: '9.0 / 10',
      repetitiveQuestions: [
        "What organization do you represent?",
        "What regulatory tier is your company enrolled in?",
        "What data regions did you request during onboarding?"
      ],
      aiResponse: "Please check your account settings under Organization > Billing & Regions, or contact our sales team to verify your data residency agreement.",
      outcome: "Severe compliance risk and customer dissatisfaction with the support bot."
    },

    withHindsight: {
      model: 'MemoraDesk (Hindsight + Groq)',
      status: 'Persistent Recall Active',
      responseTime: '260ms',
      frustrationScore: '0.0 / 10',
      recalledMemories: [
        {
          id: 'mem_9016e',
          title: 'GDPR Compliance Pin',
          detail: 'NovaBank Digital: Mandatory eu-central-1 Frankfurt pinning with BaFin audit compliance.'
        },
        {
          id: 'mem_9017f',
          title: 'Enterprise Tier',
          detail: 'Dedicated 5M vector cluster with AES-256 encryption at rest.'
        }
      ],
      aiResponse: "Good morning Elena! NovaBank Digital's persistent memory partition (ID: mem_9016e) is locked to the Frankfurt eu-central-1 sovereign cluster under our GDPR Article 28 DPA.\n\nAll 42 active vector embeddings are encrypted with your dedicated KMS key (arn:aws:kms:eu-central-1:...bafin). I have generated the official cryptographic residency audit certificate ready for download in your Settings > Compliance tab.",
      outcome: "Audit compliance verified in seconds. NovaBank VP renewed enterprise contract."
    },

    metrics: {
      timeToResolution: { without: '2 days (support ticket)', with: '10 seconds', improvement: '99.9% faster' },
      questionsAsked: { without: '6 questions', with: '0 questions', improvement: 'Instant verification' },
      developerEffort: { without: 'Legal escalation', with: 'Autonomous compliance cert', improvement: 'Total confidence' }
    }
  }
];
