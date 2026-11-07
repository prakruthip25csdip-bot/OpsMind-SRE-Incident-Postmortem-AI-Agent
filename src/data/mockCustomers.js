// Mock Customer Data for MemoraDesk

export const MOCK_CUSTOMERS = [
  {
    id: 'cust_001',
    name: 'Sarah Chen',
    email: 'sarah.chen@fintechlabs.io',
    company: 'FinTech Labs Global',
    role: 'Lead Cloud Architect',
    plan: 'Enterprise',
    status: 'active',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    sentiment: 98,
    memoryCount: 24,
    ticketsCount: 9,
    joinedDate: '2025-08-14',
    lastActive: '10 mins ago',
    preferences: {
      framework: 'Node.js & Next.js',
      cloud: 'AWS (us-east-1)',
      database: 'PostgreSQL (Supabase)',
      communication: 'Direct, technical snippets, no fluff'
    },
    knownIssues: [
      'PostgreSQL SSL connection pool timeout (resolved)',
      'High latency on Edge lambda cold start (resolved)',
      'GraphQL subscription reconnect loop (investigating)'
    ]
  },
  {
    id: 'cust_002',
    name: 'Alex Rivera',
    email: 'alex.r@hypercommerce.dev',
    company: 'HyperCommerce',
    role: 'CTO & Co-Founder',
    plan: 'Scale',
    status: 'active',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    sentiment: 92,
    memoryCount: 19,
    ticketsCount: 6,
    joinedDate: '2025-11-02',
    lastActive: '1 hour ago',
    preferences: {
      framework: 'NestJS & TypeScript',
      cloud: 'GCP (europe-west1)',
      database: 'MongoDB Atlas + Redis',
      communication: 'Step-by-step terminal commands'
    },
    knownIssues: [
      'Stripe webhook signature raw body validation (resolved)',
      'Redis cluster failover reconnect spike (resolved)'
    ]
  },
  {
    id: 'cust_003',
    name: 'Elena Rostova',
    email: 'elena@novabank.eu',
    company: 'NovaBank Digital',
    role: 'VP of Platform Engineering',
    plan: 'Enterprise VIP',
    status: 'active',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    sentiment: 99,
    memoryCount: 42,
    ticketsCount: 14,
    joinedDate: '2025-04-10',
    lastActive: 'Just now',
    preferences: {
      framework: 'Go & Kubernetes',
      cloud: 'On-premise / eu-central-1 Frankfurt',
      database: 'CockroachDB Dedicated',
      communication: 'Audit-ready reports and security compliance references'
    },
    knownIssues: [
      'GDPR compliance memory region locking (resolved)',
      'Mutual TLS mTLS certificate renewal workflow (resolved)'
    ]
  },
  {
    id: 'cust_004',
    name: 'Marcus Vance',
    email: 'm.vance@vortexai.tech',
    company: 'Vortex AI Systems',
    role: 'DevOps Lead',
    plan: 'Pro',
    status: 'attention',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    sentiment: 84,
    memoryCount: 15,
    ticketsCount: 7,
    joinedDate: '2026-01-20',
    lastActive: '3 hours ago',
    preferences: {
      framework: 'Python & PyTorch',
      cloud: 'Azure (eastus)',
      database: 'Milvus & Qdrant',
      communication: 'Detailed stack traces and benchmark comparisons'
    },
    knownIssues: [
      'Docker build OOMKilled memory limit (resolved)',
      'CUDA driver mismatch in worker image (in progress)'
    ]
  },
  {
    id: 'cust_005',
    name: 'Dr. Aisha Patel',
    email: 'aisha@biogenomics.org',
    company: 'BioGenomics BioTech',
    role: 'Head of Bioinformatics',
    plan: 'Enterprise',
    status: 'active',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    sentiment: 97,
    memoryCount: 31,
    ticketsCount: 5,
    joinedDate: '2025-06-19',
    lastActive: 'Yesterday',
    preferences: {
      framework: 'Python, Nextflow & R',
      cloud: 'AWS GovCloud',
      database: 'Postgres & Parquet Data Lake',
      communication: 'Research-grade citations and reproducibility'
    },
    knownIssues: [
      'Redis sentinel failover during multi-terabyte ingestion (resolved)'
    ]
  }
];
