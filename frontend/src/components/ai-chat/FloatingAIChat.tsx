import React, { useState } from 'react';
import { useCrisis } from '../../context/CrisisContext';
import { useAuth } from '../../context/AuthContext';
import { aiApi } from '../../api/aiApi';
import { 
  Sparkles, 
  X, 
  Send, 
  Database, 
  ChevronRight,
  ShieldCheck,
  Loader2,
  Trash2
} from 'lucide-react';

interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  citedCases?: Array<{ id: string; label: string; outcome: string }>;
}

export const FloatingAIChat: React.FC = () => {
  const { 
    chatOpen, 
    setChatOpen, 
    activeCrisis,
    setSelectedCaseForModal,
    setDecisionMemoryModalOpen,
    historicalCases,
    showToast
  } = useCrisis();
  const { user } = useAuth();

  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [conversationId] = useState<string>(() => `conv-${Date.now()}`);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'm-1',
      sender: 'assistant',
      text: `Hello ${user?.name || 'there'}. I am CrisisPilot Intelligence, connected to your organization's HindSight organizational memory. Currently reviewing ${activeCrisis?.productName || 'active crisis'}. How can I assist your evaluation?`,
      timestamp: 'Just now'
    }
  ]);

  const exampleQuestions = [
    'Why did you recommend this strategy?',
    'What happened the last time we used this discount?',
    'What if we wait another 30 days?',
    'Which region should receive the excess inventory?',
    'Show me similar historical crises.'
  ];

  const handleSend = async (textToSend?: string) => {
    const query = textToSend || input;
    if (!query.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: `u-${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await aiApi.chat({
        message: query,
        crisis_id: activeCrisis?.id,
        conversation_id: conversationId
      });

      const cited = (response.cited_precedents || []).map((p, idx) => ({
        id: `prec-${idx}`,
        label: p.title || `Precedent #${p.case_number || idx + 1}`,
        outcome: p.lesson || p.content || p.text || 'Historical precedent matched'
      }));

      const assistantMsg: ChatMessage = {
        id: `a-${Date.now()}`,
        sender: 'assistant',
        text: response.reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        citedCases: cited.length > 0 ? cited : undefined
      };

      setMessages(prev => [...prev, assistantMsg]);
    } catch (err: any) {
      showToast('AI Request Error', err?.message || 'Could not communicate with CrisisPilot intelligence.', 'error');
      const errorMsg: ChatMessage = {
        id: `err-${Date.now()}`,
        sender: 'assistant',
        text: 'I encountered an error communicating with the model service. Please try asking again in a moment.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearChat = () => {
    setMessages([
      {
        id: `m-init-${Date.now()}`,
        sender: 'assistant',
        text: `Conversation cleared. I am ready to answer queries regarding ${activeCrisis?.productName || 'current crisis'} and historical decisions.`,
        timestamp: 'Just now'
      }
    ]);
    showToast('Conversation Cleared', 'Chat history reset.', 'info');
  };

  if (!chatOpen) return null;

  return (
    <div className="fixed bottom-6 right-6 w-96 max-w-[calc(100vw-32px)] h-[560px] max-h-[85vh] bg-white rounded-2xl shadow-2xl border border-[#E6EAF0] flex flex-col z-50 animate-in slide-in-from-bottom-5 duration-200 overflow-hidden">
      {/* Header */}
      <div className="px-4 py-3 bg-[#FAFBFD] border-b border-[#E6EAF0] flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-[#E8E6FA] text-[#7567E8] flex items-center justify-center">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-[#17213D] font-heading flex items-center gap-1.5">
              <span>CrisisPilot Intelligence</span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#8BCDB5]"></span>
            </h3>
            <span className="text-[10px] text-[#64748B]">
              Grounded in HindSight Memory & Groq
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={handleClearChat}
            title="Clear conversation"
            className="p-1 rounded-md text-[#94A3B8] hover:text-[#17213D] hover:bg-[#F1F4F9] transition-colors cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setChatOpen(false)}
            className="p-1 rounded-md text-[#94A3B8] hover:text-[#17213D] hover:bg-[#F1F4F9] transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 text-xs">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
          >
            <div
              className={`max-w-[88%] p-3 rounded-xl leading-relaxed whitespace-pre-line ${
                msg.sender === 'user'
                  ? 'bg-[#7567E8] text-white rounded-br-none'
                  : 'bg-[#F8FAFC] text-[#17213D] border border-[#E6EAF0] rounded-bl-none'
              }`}
            >
              {msg.text}

              {msg.citedCases && msg.citedCases.length > 0 && (
                <div className="mt-2.5 pt-2 border-t border-[#E6EAF0] space-y-1">
                  <span className="text-[10px] font-bold text-[#7567E8] uppercase tracking-wider block">
                    Cited Memory Precedents:
                  </span>
                  {msg.citedCases.map((c, i) => (
                    <div
                      key={i}
                      className="p-1.5 rounded bg-white border border-[#E6EAF0] text-[11px] flex items-center justify-between gap-1 text-[#17213D]"
                    >
                      <span className="font-semibold">{c.label}</span>
                      <span className="text-[#64748B] text-[10px] truncate max-w-[120px]">{c.outcome}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <span className="text-[9px] text-[#94A3B8] mt-1 px-1">{msg.timestamp}</span>
          </div>
        ))}

        {isLoading && (
          <div className="flex items-center gap-2 p-3 bg-[#F8FAFC] border border-[#E6EAF0] rounded-xl text-[#7567E8] max-w-[85%]">
            <Loader2 className="w-4 h-4 animate-spin shrink-0" />
            <span className="text-[11px] font-medium">Consulting HindSight Memory Bank & Groq LLM...</span>
          </div>
        )}
      </div>

      {/* Suggested Questions */}
      <div className="px-3 py-1.5 bg-[#FAFBFD] border-t border-[#F1F4F9] flex gap-1.5 overflow-x-auto no-scrollbar">
        {exampleQuestions.map((q, idx) => (
          <button
            key={idx}
            disabled={isLoading}
            onClick={() => handleSend(q)}
            className="text-[10px] px-2 py-1 rounded bg-white hover:bg-[#F3F0FD] border border-[#E6EAF0] text-[#64748B] hover:text-[#7567E8] whitespace-nowrap transition-colors cursor-pointer shrink-0 disabled:opacity-50"
          >
            {q}
          </button>
        ))}
      </div>

      {/* Input */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSend();
        }}
        className="p-3 bg-white border-t border-[#E6EAF0] flex items-center gap-2"
      >
        <input
          type="text"
          value={input}
          disabled={isLoading}
          onChange={(e) => setInput(e.target.value)}
          placeholder={`Ask about ${activeCrisis?.productName || 'this crisis'} or historical memory...`}
          className="flex-1 text-xs text-[#17213D] placeholder-[#94A3B8] px-3 py-2 bg-[#FAFBFD] border border-[#E6EAF0] rounded-xl focus:outline-none focus:border-[#7567E8] focus:bg-white transition-all disabled:opacity-50"
        />
        <button
          type="submit"
          disabled={!input.trim() || isLoading}
          className="w-8 h-8 rounded-xl bg-[#7567E8] hover:bg-[#6658DC] disabled:opacity-50 text-white flex items-center justify-center transition-colors shadow-xs shrink-0 cursor-pointer"
        >
          {isLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
        </button>
      </form>
    </div>
  );
};
