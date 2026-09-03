import React, { useState, useRef, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext.jsx';
import { useBusiness } from '../context/BusinessContext.jsx';
import { aiService } from '../services/api.js';
import VoiceInputButton from '../components/common/VoiceInputButton.jsx';
import {
  Sparkles,
  Send,
  User,
  Bot,
  Volume2,
  Copy,
  Check,
  TrendingUp,
  HelpCircle,
  Lightbulb,
  Store
} from 'lucide-react';

const Assistant = () => {
  const { t, currentLanguage } = useLanguage();
  const { business, products, sales, expenses } = useBusiness();

  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'ai',
      text: currentLanguage === 'te'
        ? "నమస్కారం! నేను మీ వ్యాపారమిత్ర AI సహాయకుడిని. లక్ష్మి హోమ్‌మేడ్ ఫుడ్స్ అమ్మకాలను పెంచడం, ధరల సమీక్ష, ప్రభుత్వ సబ్సిడీలు లేదా మార్కెటింగ్ గురించి నన్ను ఏదైనా అడగవచ్చు. మాట్లాడటానికి మైక్ బటన్ నొక్కండి."
        : currentLanguage === 'hi'
        ? "नमस्ते! मैं आपका व्यापारमित्र एआई सहायक हूँ। लक्ष्मी होममेड फूड्स की बिक्री बढ़ाने, मूल्य निर्धारण, सरकारी सब्सिडी या प्रचार के बारे में आप मुझसे पूछ सकते हैं।"
        : "Hello! I am your VyaparMitra AI business partner. I have full context of Lakshmi Homemade Foods (₹35,200 monthly sales, ₹13,900 net profit). Ask me how to grow sales, check margins, find loans, or generate marketing copy in your language."
    }
  ]);

  const [inputMessage, setInputMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [copiedId, setCopiedId] = useState(null);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const quickPrompts = [
    t.assistant?.q1 || "How can I increase my mango pickle sales this month?",
    t.assistant?.q2 || "Is my ₹180 selling price profitable with ₹120 cost?",
    t.assistant?.q3 || "Which government subsidy can I get for food packaging machinery?",
    t.assistant?.q4 || "Write a special festival WhatsApp message for my customers.",
    t.assistant?.q5 || "What are 3 practical steps to reduce raw material cost?"
  ];

  const handleSendMessage = async (textToSend) => {
    const query = textToSend || inputMessage;
    if (!query.trim()) return;

    const userMsg = { id: Date.now(), sender: 'user', text: query };
    setMessages(prev => [...prev, userMsg]);
    setInputMessage('');
    setLoading(true);

    try {
      const payload = {
        message: query,
        language: currentLanguage,
        businessContext: {
          name: business?.name || 'Lakshmi Homemade Foods',
          category: business?.category || 'Food Products',
          location: business?.location || 'Tenali, AP',
          monthlySales: business?.monthlySales || 35200,
          monthlyExpenses: business?.monthlyExpenses || 21300,
          monthlyProfit: (business?.monthlySales || 35200) - (business?.monthlyExpenses || 21300),
          products: products.map(p => ({ name: p.name, cost: p.costPrice, selling: p.sellingPrice }))
        }
      };

      const res = await aiService.chat(payload);
      if (res && res.data) {
        setMessages(prev => [
          ...prev,
          { id: Date.now() + 1, sender: 'ai', text: res.data.reply }
        ]);
      }
    } catch (err) {
      setMessages(prev => [
        ...prev,
        { id: Date.now() + 1, sender: 'ai', text: 'Sorry, I could not process that request right now. Please try again.' }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = (id, text) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const speakText = (text) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.9;
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <div className="h-[calc(100vh-8.5rem)] flex flex-col bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
      {/* Assistant Header */}
      <div className="p-4 sm:p-5 border-b border-slate-100 bg-slate-50/70 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-orange-600 to-amber-500 flex items-center justify-center text-white shadow-md shadow-orange-500/20">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <span>{t.assistant?.title || 'AI Business Operating Assistant'}</span>
              <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full">
                Live Advisor
              </span>
            </h2>
            <p className="text-xs text-slate-500">
              {business?.name || 'Lakshmi Homemade Foods'} • Andhra Pradesh
            </p>
          </div>
        </div>
      </div>

      {/* Suggested Quick Question Chips */}
      <div className="p-3 bg-orange-50/50 border-b border-orange-100 overflow-x-auto flex items-center gap-2 no-scrollbar">
        <span className="text-[11px] font-bold uppercase tracking-wider text-orange-700 whitespace-nowrap flex items-center gap-1 pl-1">
          <Lightbulb className="w-3.5 h-3.5" />
          <span>Quick:</span>
        </span>
        {quickPrompts.slice(0, 3).map((prompt, i) => (
          <button
            key={i}
            onClick={() => handleSendMessage(prompt)}
            className="text-xs font-medium bg-white hover:bg-orange-100/60 text-slate-700 hover:text-orange-900 border border-orange-200/80 px-3 py-1 rounded-full whitespace-nowrap transition-colors"
          >
            {prompt}
          </button>
        ))}
      </div>

      {/* Chat Messages Log */}
      <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-4">
        {messages.map((m) => (
          <div
            key={m.id}
            className={`flex items-start gap-3 ${m.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
          >
            <div
              className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 text-xs font-bold ${
                m.sender === 'user'
                  ? 'bg-orange-600 text-white shadow-xs'
                  : 'bg-amber-100 text-amber-900 border border-amber-200'
              }`}
            >
              {m.sender === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4 text-orange-600" />}
            </div>

            <div
              className={`max-w-xl rounded-2xl p-4 text-sm leading-relaxed ${
                m.sender === 'user'
                  ? 'bg-orange-600 text-white rounded-tr-none'
                  : 'bg-slate-50 border border-slate-200/90 text-slate-800 rounded-tl-none'
              }`}
            >
              <div className="whitespace-pre-line">{m.text}</div>

              {m.sender === 'ai' && (
                <div className="mt-3 pt-2 border-t border-slate-200/60 flex items-center justify-end gap-2 text-slate-400">
                  <button
                    onClick={() => speakText(m.text)}
                    className="p-1 hover:text-slate-700 hover:bg-slate-200/60 rounded-md transition-colors"
                    title="Listen in voice"
                  >
                    <Volume2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleCopy(m.id, m.text)}
                    className="p-1 hover:text-slate-700 hover:bg-slate-200/60 rounded-md transition-colors"
                    title="Copy answer"
                  >
                    {copiedId === m.id ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-amber-100 flex items-center justify-center">
              <Bot className="w-4 h-4 text-orange-600" />
            </div>
            <div className="bg-slate-50 border border-slate-200 rounded-2xl rounded-tl-none p-3.5 flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-orange-500 animate-bounce"></div>
              <div className="w-2 h-2 rounded-full bg-orange-500 animate-bounce [animation-delay:0.2s]"></div>
              <div className="w-2 h-2 rounded-full bg-orange-500 animate-bounce [animation-delay:0.4s]"></div>
              <span className="text-xs text-slate-500 font-medium pl-1">Thinking in {currentLanguage.toUpperCase()}...</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input & Voice Input */}
      <div className="p-3 sm:p-4 border-t border-slate-100 bg-white">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="flex items-center gap-2"
        >
          <VoiceInputButton
            onTranscript={(transcript) => {
              setInputMessage(transcript);
            }}
            title={t.assistant?.speakBtn || 'Speak in your language'}
          />

          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder={t.assistant?.placeholder || 'Ask anything about sales, prices, loans, marketing...'}
            className="flex-1 px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm focus:bg-white focus:border-orange-500 focus:outline-none transition-colors"
          />

          <button
            type="submit"
            disabled={!inputMessage.trim() || loading}
            className="p-3 bg-orange-600 hover:bg-orange-700 disabled:opacity-40 text-white rounded-2xl shadow-sm transition-colors"
          >
            <Send className="w-5 h-5" />
          </button>
        </form>
      </div>
    </div>
  );
};

export default Assistant;
