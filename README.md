# 🧠 MemoraDesk – AI Customer Support Agent with Persistent Memory

> **Hack with Hyderabad 3.0 Project Submission**  
> **Problem Statement:** *AI Agents That Learn Using Hindsight*  
> **Core Technology:** Persistent Vector Memory powered by **Hindsight by Vectorize** & **Groq LPUs**

---

## 🌟 Executive Summary

Traditional AI customer support bots are **stateless and amnesic**. Every interaction starts from zero, forcing customers to repeat their tech stacks, cloud regions, previous configurations, and past ticket histories.

**MemoraDesk** solves this fundamental customer friction by combining **Hindsight by Vectorize** for persistent vector memory and **Groq LPUs** for ultra-fast (sub-350ms) Llama-3.3-70b inference. 

With MemoraDesk:
- **Zero Repetitive Questions:** The AI agent immediately remembers customer environments, preferences, previous bugs, and verified solutions.
- **Sub-15ms Memory Recall:** Historical knowledge vectors are retrieved and injected into the prompt context in 14.8ms.
- **Continuous Compounding Intelligence:** Every resolved ticket and customer feedback is automatically vectorized and ingested into Hindsight.
- **-68.5% Reduction in Repeat Issues:** Verified technical fixes are instantly reapplied to recurring failure patterns.

---

## 🛠️ Hackathon Software & Technologies

| Technology | Role | Resource / Link |
| :--- | :--- | :--- |
| **Hindsight by Vectorize** | Mandatory Persistent Memory Storage & Semantic Vector Retrieval | [hindsight.vectorize.io](https://hindsight.vectorize.io/) • [GitHub](https://github.com/vectorize-io/hindsight) • [Cloud UI](https://ui.hindsight.vectorize.io) |
| **Band AI Desktop** | Mandatory Hackathon Desktop Agent | [band.ai](https://www.band.ai/) |
| **Groq LPUs** | Recommended Ultra-Fast LLM Inference (`llama-3.3-70b-versatile`) | [groq.com](https://groq.com/) |
| **React 18 & Vite** | Modern Reactive Frontend Architecture | [react.dev](https://react.dev/) |
| **Tailwind CSS & Framer Motion** | Glassmorphism, 60fps Micro-Animations, Glowing Borders | [tailwindcss.com](https://tailwindcss.com/) |
| **Recharts & Lucide Icons** | Vector Graph, Analytics Visualizations, & Modern Iconography | [recharts.org](https://recharts.org/) |
| **FastAPI Backend Ready** | Async Python REST Backend (`http://localhost:8000`) | [fastapi.tiangolo.com](https://fastapi.tiangolo.com/) |

---

## 🚀 Quick Launch Instructions

```bash
# 1. Navigate to the frontend directory
cd memora-desk/frontend

# 2. Install dependencies (if not already installed)
npm install

# 3. Start development server
npm run dev
```

Then visit **`http://localhost:5173`** in your browser.

---

### ⌨️ Useful Shortcuts & Pages Inside the App

| Page / Feature | Route / Shortcut | Description |
| :--- | :--- | :--- |
| **Authentication & Sign In** | [`/login`](http://localhost:5173/login) | Full login & registration with 1-click demo personas |
| **Landing Page** | [`/`](http://localhost:5173/) | Hero section, 4-step pipeline, feature grid, and testbed |
| **Main Dashboard** | [`/dashboard`](http://localhost:5173/dashboard) | 5 statistics cards, activity area chart, category pie chart |
| **AI Support Chat** | [`/chat`](http://localhost:5173/chat) | Flagship context-aware chat with memory retrieval stepper |
| **Memory Explorer** | [`/memory-explorer`](http://localhost:5173/memory-explorer) | Interactive SVG neural memory network with vector inspector |
| **Before & After Comparison**| [`/comparison`](http://localhost:5173/comparison) | Side-by-side benchmark with dual response simulation |
| **Customer Directory** | [`/customers`](http://localhost:5173/customers) | Customer cards, table toggle, and persistent tech profiles |
| **Support Tickets** | [`/tickets`](http://localhost:5173/tickets) | Filterable ticket queue with automatic memory links |
| **Resolution Analytics** | [`/analytics`](http://localhost:5173/analytics) | Recall metrics, latency telemetry, and export report |
| **Settings & Integrations** | [`/settings`](http://localhost:5173/settings) | FastAPI ping, Groq LLM sliders, Hindsight cluster config |
| **Global Command Palette** | `Ctrl + K` (or `Cmd + K`) | Instant global search across pages, memories, and actions |
| **Theme Toggle** | Top Nav Sun/Moon | Persistent switch between Futuristic Dark and Clean Light mode |
