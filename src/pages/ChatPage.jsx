import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Brain,
  Send,
  Sparkles,
  Paperclip,
  Mic,
  Plus,
  Search,
  CheckCheck,
  Cpu,
  Layers,
  ChevronRight,
  Database,
  Info,
  Clock,
  User,
  PanelRightOpen,
  PanelRightClose
} from 'lucide-react';
import { MOCK_CONVERSATIONS, SUGGESTED_PROMPTS } from '../data/mockConversations';
import { MOCK_CUSTOMERS } from '../data/mockCustomers';
import { MOCK_MEMORIES } from '../data/mockMemories';
import { chatService } from '../services/chatService';
import { useApi } from '../context/ApiContext';
import { useToast } from '../context/ToastContext';
import MemoryRetrievalBanner from '../components/chat/MemoryRetrievalBanner';
import CustomerIntelPanel from '../components/chat/CustomerIntelPanel';
import { playMessagePop, playMemoryChime } from '../utils/soundEffects';

export default function ChatPage() {
  const { isLive, mode } = useApi();
  const { addToast } = useToast();

  const [conversations, setConversations] = useState(MOCK_CONVERSATIONS);
  const [activeConvId, setActiveConvId] = useState('conv_001');
  const [searchQuery, setSearchQuery] = useState('');
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [memoryPipelineStep, setMemoryPipelineStep] = useState(0); // 0: idle, 1: retrieving, 2: found, 3: done
  const [showRightPanel, setShowRightPanel] = useState(true);

  const messagesEndRef = useRef(null);

  const activeConversation = conversations.find(c => c.id === activeConvId) || conversations[0];
  const activeCustomer = MOCK_CUSTOMERS.find(c => c.id === activeConversation.customerId) || MOCK_CUSTOMERS[0];
  const customerMemories = MOCK_MEMORIES.filter(m => m.customerId === activeCustomer.id);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [activeConversation.messages, isTyping, memoryPipelineStep]);

  const handleSendMessage = async (textToSend = inputText) => {
    if (!textToSend.trim() || isTyping) return;

    const userMessage = {
      id: 'msg_' + Date.now(),
      sender: 'customer',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    // Append user message immediately
    const updatedMessages = [...activeConversation.messages, userMessage];
    setConversations(prev =>
      prev.map(c => c.id === activeConvId ? { ...c, messages: updatedMessages, lastMessage: textToSend } : c)
    );
    setInputText('');
    setIsTyping(true);
    playMessagePop();

    // Step 1: Retrieving memories from Hindsight
    setMemoryPipelineStep(1);

    try {
      // Step 2: Hindsight search simulation
      setTimeout(async () => {
        setMemoryPipelineStep(2);
        playMemoryChime();

        // Call chatService (live backend or high-fidelity simulation)
        const result = await chatService.sendMessage({
          conversationId: activeConvId,
          customerId: activeCustomer.id,
          message: textToSend,
          isLive
        });

        // Step 3: Response generated
        setMemoryPipelineStep(3);
        setIsTyping(false);

        // Append AI response
        setConversations(prev =>
          prev.map(c => c.id === activeConvId ? {
            ...c,
            messages: [...c.messages, result.response],
            lastMessage: result.response.text.substring(0, 60) + '...'
          } : c)
        );

        addToast({
          title: 'Memory Recall Complete',
          message: `Retrieved ${result.response.retrievedMemories?.length || 1} relevant memories from Hindsight in 14.8ms`,
          type: 'memory'
        });

        // Reset banner after a short delay
        setTimeout(() => {
          setMemoryPipelineStep(0);
        }, 4000);
      }, 700);

    } catch (err) {
      setIsTyping(false);
      setMemoryPipelineStep(0);
      addToast({
        title: 'Chat Engine Notice',
        message: err.message,
        type: 'warning'
      });
    }
  };

  const handleCreateNewConversation = () => {
    const newId = 'conv_' + Date.now().toString(36);
    const newConv = {
      id: newId,
      customerId: activeCustomer.id,
      customerName: activeCustomer.name,
      customerCompany: activeCustomer.company,
      title: 'New Support Ingestion Session',
      lastMessage: 'Session initiated with persistent memory.',
      timestamp: 'Just now',
      unread: false,
      status: 'in_progress',
      messages: [
        {
          id: 'msg_welcome_' + Date.now(),
          sender: 'ai',
          text: `Hello ${activeCustomer.name}! I have synchronized with your persistent memory bank (Profile ID: ${activeCustomer.id}). How can I assist you with your ${activeCustomer.preferences?.framework || 'stack'} today?`,
          retrievedMemories: customerMemories.slice(0, 2),
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]
    };

    setConversations([newConv, ...conversations]);
    setActiveConvId(newId);
    addToast({
      title: 'New Session Created',
      message: `Synchronized with ${activeCustomer.name}'s Hindsight memory store`,
      type: 'info'
    });
  };

  const filteredConversations = conversations.filter(c =>
    c.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="h-[calc(100vh-112px)] flex flex-col md:flex-row rounded-3xl border border-white/10 dark:border-white/10 light:border-slate-200 overflow-hidden bg-dark-card/40 dark:bg-dark-card/40 light:bg-white shadow-2xl backdrop-blur-xl">
      
      {/* 1. LEFT PANEL: Conversations & Customer Switcher */}
      <div className="w-full md:w-80 border-r border-white/10 dark:border-white/10 light:border-slate-200 flex flex-col bg-[#0b0f19] dark:bg-[#0b0f19] light:bg-slate-50 flex-shrink-0">
        
        {/* Top Header & New Chat button */}
        <div className="p-4 border-b border-white/10 dark:border-white/10 light:border-slate-200 space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="font-bold text-sm text-slate-100 dark:text-slate-100 light:text-slate-900">
              Conversations
            </h2>
            <button
              onClick={handleCreateNewConversation}
              className="p-1.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white shadow-neon-blue transition-all"
              title="Start New Conversation"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          {/* Search bar */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
            <input
              type="text"
              placeholder="Search chats & customers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 text-xs rounded-xl border bg-dark-card/60 dark:bg-dark-card/60 light:bg-white border-white/10 dark:border-white/10 light:border-slate-300 text-slate-200 dark:text-slate-200 light:text-slate-800 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
            />
          </div>
        </div>

        {/* Conversation List */}
        <div className="flex-1 overflow-y-auto p-3 space-y-2">
          {filteredConversations.map((conv) => {
            const isSelected = conv.id === activeConvId;
            return (
              <button
                key={conv.id}
                onClick={() => setActiveConvId(conv.id)}
                className={`w-full text-left p-3 rounded-2xl border transition-all duration-200 ${
                  isSelected
                    ? 'bg-gradient-to-r from-brand-600/20 to-purple-600/20 border-brand-500/40 shadow-sm'
                    : 'bg-white/5 border-white/5 hover:bg-white/10 text-slate-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className={`text-xs font-bold truncate ${isSelected ? 'text-brand-300' : 'text-slate-200'}`}>
                    {conv.customerName}
                  </span>
                  <span className="text-[10px] text-slate-500">{conv.timestamp}</span>
                </div>
                <p className="text-[11px] font-medium text-slate-300 mt-1 truncate">
                  {conv.title}
                </p>
                <p className="text-[10px] text-slate-400 mt-0.5 truncate">
                  {conv.lastMessage}
                </p>
              </button>
            );
          })}
        </div>

        {/* Customer Quick Switcher */}
        <div className="p-3 border-t border-white/10 dark:border-white/10 light:border-slate-200 bg-black/20">
          <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-2">
            Switch Customer Context
          </p>
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            {MOCK_CUSTOMERS.map((cust) => (
              <button
                key={cust.id}
                onClick={() => {
                  const match = conversations.find(c => c.customerId === cust.id);
                  if (match) {
                    setActiveConvId(match.id);
                  }
                }}
                className={`relative p-0.5 rounded-full transition-transform ${
                  activeCustomer.id === cust.id ? 'ring-2 ring-brand-500 scale-105' : 'opacity-70 hover:opacity-100'
                }`}
                title={`${cust.name} (${cust.company})`}
              >
                <img src={cust.avatar} alt={cust.name} className="w-7 h-7 rounded-full object-cover" />
              </button>
            ))}
          </div>
        </div>

      </div>

      {/* 2. MAIN CHAT PANEL */}
      <div className="flex-1 flex flex-col min-w-0 bg-[#0d1220] dark:bg-[#0d1220] light:bg-[#f8fafc]">
        
        {/* Chat Top Banner */}
        <div className="h-14 px-6 border-b border-white/10 dark:border-white/10 light:border-slate-200 flex items-center justify-between bg-black/20">
          <div className="flex items-center gap-3 min-w-0">
            <div className="relative">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-brand-600 to-purple-600 flex items-center justify-center text-white shadow-neon-blue">
                <Brain className="w-4 h-4 animate-pulse" />
              </div>
              <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-[#0d1220]" />
            </div>
            <div className="min-w-0">
              <h3 className="text-xs font-bold text-slate-100 dark:text-slate-100 light:text-slate-900 truncate">
                {activeConversation.title}
              </h3>
              <p className="text-[10px] text-purple-400 font-mono truncate">
                Customer: {activeCustomer.name} • Persistent Memory Active
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="hidden sm:inline-block px-2 py-0.5 rounded-full text-[10px] font-mono bg-white/5 border border-white/10 text-slate-400">
              {isLive ? 'FastAPI Connected' : 'Simulation Mode'}
            </span>
            <button
              onClick={() => setShowRightPanel(!showRightPanel)}
              className="p-1.5 rounded-xl border border-white/10 text-slate-400 hover:text-white transition-colors"
              title="Toggle Customer Intelligence"
            >
              {showRightPanel ? <PanelRightClose className="w-4 h-4" /> : <PanelRightOpen className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Message Feed */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          
          {/* Welcome Card */}
          <div className="p-4 rounded-2xl border border-brand-500/20 bg-brand-950/20 text-xs text-slate-300 max-w-2xl mx-auto flex items-start gap-3">
            <Sparkles className="w-4 h-4 text-brand-400 mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-semibold text-brand-300">
                Persistent AI Memory Context Synchronized
              </p>
              <p className="text-[11px] text-slate-400 mt-0.5 leading-relaxed">
                MemoraDesk has connected to Hindsight for {activeCustomer.name} ({activeCustomer.company}). All previous tickets, tech preferences, and validated configurations are actively loaded.
              </p>
            </div>
          </div>

          {/* Animated Memory Retrieval Banner */}
          <MemoryRetrievalBanner
            step={memoryPipelineStep}
            retrievedCount={customerMemories.length || 2}
            isLive={isLive}
          />

          {/* Messages */}
          {activeConversation.messages.map((msg) => {
            const isUser = msg.sender === 'customer';
            return (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25 }}
                className={`flex items-start gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
              >
                {/* Avatar */}
                {isUser ? (
                  <img
                    src={activeCustomer.avatar}
                    alt={activeCustomer.name}
                    className="w-8 h-8 rounded-full object-cover ring-1 ring-brand-500/50 mt-1 flex-shrink-0"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-brand-600 to-purple-600 flex items-center justify-center text-white mt-1 shadow-neon-blue flex-shrink-0">
                    <Brain className="w-4 h-4" />
                  </div>
                )}

                {/* Message Content Bubble */}
                <div className={`max-w-xl space-y-2 ${isUser ? 'items-end' : 'items-start'}`}>
                  <div
                    className={`p-4 rounded-2xl text-xs leading-relaxed ${
                      isUser
                        ? 'bg-brand-600 text-white rounded-tr-none shadow-md'
                        : 'bg-[#151c2e] dark:bg-[#151c2e] light:bg-white text-slate-100 dark:text-slate-100 light:text-slate-900 border border-white/10 dark:border-white/10 light:border-slate-200 rounded-tl-none shadow-xl'
                    }`}
                  >
                    <p className="whitespace-pre-line">{msg.text}</p>

                    {/* Code Snippet if present */}
                    {msg.codeSnippet && (
                      <div className="mt-3 p-3 rounded-xl bg-[#090c14] border border-white/10 font-mono text-[11px] text-cyan-300 overflow-x-auto">
                        <pre>{msg.codeSnippet}</pre>
                      </div>
                    )}
                  </div>

                  {/* Recalled Memory Metadata Chips (for AI responses) */}
                  {!isUser && msg.retrievedMemories && msg.retrievedMemories.length > 0 && (
                    <div className="p-2.5 rounded-xl border border-purple-500/20 bg-purple-950/20 text-[10px] space-y-1">
                      <span className="font-semibold text-purple-300 flex items-center gap-1">
                        <Database className="w-3 h-3 text-purple-400" />
                        Hindsight Persistent Memories Injected:
                      </span>
                      <div className="flex flex-wrap gap-1.5 mt-1">
                        {msg.retrievedMemories.map((m, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-0.5 rounded-md bg-black/40 border border-purple-500/20 text-purple-200 font-mono"
                          >
                            {m.title || m.snippet || m.id}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className={`flex items-center gap-2 text-[10px] text-slate-500 ${isUser ? 'justify-end' : 'justify-start'}`}>
                    <span>{msg.timestamp}</span>
                    {msg.model && <span>• {msg.model}</span>}
                    {msg.latency && <span className="text-emerald-400">• {msg.latency}</span>}
                  </div>
                </div>
              </motion.div>
            );
          })}

          {/* Typing Indicator */}
          {isTyping && (
            <motion.div
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-3"
            >
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-brand-600 to-purple-600 flex items-center justify-center text-white shadow-neon-blue">
                <Brain className="w-4 h-4 animate-spin-slow" />
              </div>
              <div className="p-3.5 rounded-2xl rounded-tl-none bg-[#151c2e] border border-white/10 flex items-center gap-2 text-xs text-slate-400">
                <span className="w-2 h-2 rounded-full bg-brand-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-2 h-2 rounded-full bg-purple-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-bounce" style={{ animationDelay: '300ms' }} />
                <span className="text-[11px] ml-1 text-slate-400">Synthesizing personalized response via Groq...</span>
              </div>
            </motion.div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Suggested Prompts Bar */}
        <div className="px-4 py-2 border-t border-white/5 bg-black/20 overflow-x-auto flex items-center gap-2">
          <span className="text-[10px] uppercase font-bold text-slate-500 flex-shrink-0">
            Suggested:
          </span>
          {SUGGESTED_PROMPTS.map((prompt, idx) => (
            <button
              key={idx}
              onClick={() => handleSendMessage(prompt)}
              className="px-2.5 py-1 rounded-lg text-[11px] border border-white/10 hover:border-brand-500/40 bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition-colors flex-shrink-0"
            >
              {prompt}
            </button>
          ))}
        </div>

        {/* Message Input Box */}
        <div className="p-4 border-t border-white/10 dark:border-white/10 light:border-slate-200 bg-[#0b0f19]">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center gap-2"
          >
            <div className="relative flex-1">
              <input
                type="text"
                placeholder={`Ask MemoraDesk about ${activeCustomer.name}'s setup or past issues...`}
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                className="w-full pl-4 pr-10 py-3 text-xs sm:text-sm rounded-2xl border bg-dark-card/80 dark:bg-dark-card/80 light:bg-white border-white/10 dark:border-white/10 light:border-slate-300 text-slate-100 dark:text-slate-100 light:text-slate-900 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>

            <button
              type="submit"
              disabled={!inputText.trim() || isTyping}
              className="p-3 rounded-2xl font-semibold text-white bg-gradient-to-r from-brand-600 to-purple-600 hover:from-brand-500 hover:to-purple-500 shadow-neon-blue disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              aria-label="Send message"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>

      </div>

      {/* 3. RIGHT PANEL: Customer Intelligence */}
      {showRightPanel && (
        <div className="hidden lg:block w-80 border-l border-white/10 dark:border-white/10 light:border-slate-200 bg-[#0b0f19] dark:bg-[#0b0f19] light:bg-slate-50 flex-shrink-0">
          <CustomerIntelPanel customer={activeCustomer} memories={customerMemories} />
        </div>
      )}

    </div>
  );
}
