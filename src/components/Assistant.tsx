import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Send, User, Bot, Sparkles, Trash2, Info, ChevronDown, Loader2 } from 'lucide-react';
import { askVoteEaseAssistant } from '../services/aiService';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

const Assistant: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: "Hello! I am your VoteEase AI Assistant. I can help you understand candidate policies, explain how the voting protocol works, or clarify election terminology. How can I help you be a more informed voter today?",
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async (overrideInput?: string) => {
    const messageContent = overrideInput || input;
    if (!messageContent.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: messageContent,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    if (!overrideInput) setInput('');
    setIsLoading(true);

    try {
      const response = await askVoteEaseAssistant(input);
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response || "I'm sorry, I'm having difficulty processing that request.",
        timestamp: new Date()
      };
      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const clearChat = () => {
    setMessages([{
      id: '1',
      role: 'assistant',
      content: "Hello! I am your VoteEase AI Assistant. I can help you understand candidate policies, explain how the voting protocol works, or clarify election terminology. How can I help you be a more informed voter today?",
      timestamp: new Date()
    }]);
  };

  return (
    <div className="max-w-5xl mx-auto h-[calc(100vh-10rem)] flex flex-col space-y-4">
      {/* Header */}
      <div className="flex justify-between items-end px-4">
        <div className="space-y-1">
          <h1 className="text-4xl font-black text-slate-900 dark:text-white flex items-center gap-3 tracking-tight">
            VoteEase Assistant
            <span className="text-[10px] bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 px-3 py-1 rounded-full uppercase tracking-[0.2em] font-black">AI Protocol</span>
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Neutral, fact-based insights for the modern global voter.</p>
        </div>
        <button 
          onClick={clearChat}
          className="p-3 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl text-slate-400 hover:text-red-500 hover:border-red-100 hover:bg-red-50 transition-all shadow-sm"
          title="Clear Conversation"
        >
          <Trash2 size={20} />
        </button>
      </div>

      {/* Chat Container */}
      <div className="flex-1 bg-white/60 dark:bg-slate-900/60 backdrop-blur-3xl border border-white/40 dark:border-slate-800 rounded-[3rem] shadow-2xl flex flex-col overflow-hidden">
        
        {/* Messages */}
        <div 
          ref={scrollRef}
          className="flex-1 overflow-y-auto p-8 space-y-10 scroll-smooth custom-scrollbar"
        >
          {messages.length === 1 && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="max-w-2xl mx-auto mt-12 mb-20 space-y-8"
            >
              <div className="bg-white dark:bg-slate-900 rounded-[3rem] border border-slate-100 dark:border-slate-800 shadow-xl overflow-hidden relative group">
                <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-blue-600 to-indigo-600" />
                
                {/* Neutrality Banner */}
                <div className="px-8 py-4 bg-blue-600 text-white text-[10px] font-black uppercase tracking-[0.3em] flex items-center justify-center gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                  Neutrality Guard Active | Latest Policy Update: May 2026
                </div>

                <div className="p-10 space-y-8">
                  <div className="flex flex-col items-center text-center space-y-4">
                    <div className="w-20 h-20 bg-blue-600 rounded-[2.5rem] flex items-center justify-center text-white shadow-2xl shadow-blue-200 dark:shadow-none">
                      <Bot size={44} strokeWidth={2.5} />
                    </div>
                    <div className="space-y-2">
                      <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">Verified Protocol Insight</h2>
                      <p className="text-slate-500 dark:text-slate-400 text-sm font-medium leading-relaxed max-w-sm">
                        I use the official candidate ledger and protocol documentation to provide objective data.
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col gap-3">
                    {[
                      "Compare Helena Vance & Marcus Thorne", 
                      "How is my vote encrypted?", 
                      "Eligibility for global voters"
                    ].map((s) => (
                      <button 
                        key={s}
                        onClick={() => handleSend(s)}
                        className="w-full flex items-center justify-center px-8 py-5 rounded-[2rem] bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 text-[12px] font-black text-slate-600 dark:text-slate-400 hover:bg-white dark:hover:bg-slate-700 hover:border-blue-600 hover:text-blue-600 hover:shadow-xl transition-all uppercase tracking-widest active:scale-98"
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {messages.map((m) => (
            m.id !== '1' && (
              <motion.div 
                key={m.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`flex gap-6 max-w-[85%] ${m.role === 'user' ? 'flex-row-reverse' : ''}`}>
                  <div className={`w-12 h-12 rounded-[1.25rem] flex items-center justify-center shrink-0 shadow-lg ${
                    m.role === 'user' ? 'bg-slate-900 dark:bg-blue-600 text-white' : 'bg-blue-600 dark:bg-slate-800 text-white'
                  }`}>
                    {m.role === 'user' ? <User size={24} /> : <Bot size={24} />}
                  </div>
                  <div className={`space-y-2 ${m.role === 'user' ? 'text-right' : ''}`}>
                    <div className={`p-6 rounded-[2rem] text-[16px] font-medium leading-relaxed shadow-sm ${
                      m.role === 'user' 
                        ? 'bg-slate-900 dark:bg-blue-600 text-white rounded-tr-none' 
                        : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-tl-none border border-slate-100 dark:border-slate-700'
                    }`}>
                      {m.content}
                    </div>
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">
                      {m.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>
              </motion.div>
            )
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="flex gap-6 max-w-[80%]">
                <div className="w-12 h-12 rounded-[1.25rem] bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-lg">
                  <Sparkles size={24} className="animate-pulse" />
                </div>
                <div className="p-6 rounded-[2rem] rounded-tl-none bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 shadow-sm flex items-center gap-3">
                  <div className="w-2.5 h-2.5 rounded-full bg-blue-100 animate-bounce" />
                  <div className="w-2.5 h-2.5 rounded-full bg-blue-300 animate-bounce [animation-delay:-0.15s]" />
                  <div className="w-2.5 h-2.5 rounded-full bg-blue-500 animate-bounce [animation-delay:-0.3s]" />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Input Area */}
        <div className="p-6 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-t border-slate-100 dark:border-slate-800">
          <div className="relative group">
            <input 
              type="text"
              id="assistant-input-field"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Ask about candidates, platforms, or ballot transparency..."
              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 focus:bg-white dark:focus:bg-slate-700 focus:border-blue-500 rounded-[1.5rem] py-5 pl-8 pr-20 text-slate-800 dark:text-slate-200 focus:ring-8 focus:ring-blue-100/50 dark:focus:ring-blue-900/20 outline-none transition-all shadow-inner text-lg font-medium"
            />
            <button 
              onClick={() => handleSend()}
              disabled={isLoading || !input.trim()}
              aria-label="Send Message"
              className="absolute right-3 top-1/2 -translate-y-1/2 w-14 h-14 rounded-2xl bg-slate-900 dark:bg-blue-600 text-white flex items-center justify-center hover:bg-blue-600 disabled:bg-slate-200 dark:disabled:bg-slate-800 disabled:text-slate-400 disabled:cursor-not-allowed transition-all shadow-xl active:scale-90"
            >
              {isLoading ? <Loader2 size={24} className="animate-spin" /> : <Send size={24} />}
            </button>
          </div>
          <p className="text-center text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-4">
            AI Assistant can make mistakes. Verify critical facts.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Assistant;
