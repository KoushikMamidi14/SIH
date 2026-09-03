import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import {
  Compass,
  LayoutDashboard,
  Sparkles,
  Calculator,
  ShieldCheck,
  Languages,
  CheckCircle2,
  ArrowRight,
  TrendingUp,
  Store,
  HeartHandshake,
  Users,
  Mic
} from 'lucide-react';

const Landing = () => {
  const { t } = useLanguage();
  const { isAuthenticated } = useAuth();

  return (
    <div className="space-y-16 py-4">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-orange-600 via-orange-500 to-amber-500 text-white p-8 md:p-14 shadow-xl shadow-orange-500/15">
        <div className="relative z-10 max-w-3xl space-y-6">
          <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md px-4 py-1.5 rounded-full text-xs md:text-sm font-semibold border border-white/30 text-white">
            <Sparkles className="w-4 h-4 text-amber-200" />
            <span>{t.hero?.badge || 'Smart India Hackathon Prototype'}</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight">
            {t.hero?.title || 'Empowering Rural Entrepreneurs with Local AI'}
          </h1>

          <p className="text-base sm:text-xl text-orange-100 font-medium leading-relaxed max-w-2xl">
            {t.hero?.subtitle || 'From choosing the right business in your village to pricing, sales tracking, government schemes, and marketing in your own mother tongue.'}
          </p>

          {/* Action CTAs */}
          <div className="pt-4 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
            <Link
              to="/business-discovery"
              className="px-6 py-3.5 bg-white hover:bg-orange-50 text-orange-600 font-bold rounded-2xl shadow-lg transition-all transform hover:-translate-y-0.5 flex items-center justify-center gap-2 text-base"
            >
              <Compass className="w-5 h-5 text-orange-600" />
              <span>{t.hero?.ctaDiscovery || 'Discover Your Business Idea'}</span>
              <ArrowRight className="w-4 h-4 text-orange-500" />
            </Link>

            <Link
              to="/dashboard"
              className="px-6 py-3.5 bg-orange-700/60 hover:bg-orange-700/80 text-white font-bold rounded-2xl border border-white/20 backdrop-blur-sm transition-all flex items-center justify-center gap-2 text-base"
            >
              <LayoutDashboard className="w-5 h-5 text-amber-300" />
              <span>{t.hero?.ctaDemo || 'View Demo Dashboard'}</span>
            </Link>
          </div>
        </div>

        {/* Decorative background circle */}
        <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-white/10 rounded-full blur-2xl pointer-events-none"></div>
      </section>

      {/* Target Sectors Showcase */}
      <section className="space-y-6">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            Tailored For Rural Micro-Enterprises
          </h2>
          <p className="text-sm sm:text-base text-slate-500">
            Designed specifically for local production, cottage industries, and village commerce in Andhra Pradesh & across India.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 md:gap-4">
          {[
            { label: 'Homemade Pickles & Podis', icon: '🥭', count: 'High Demand' },
            { label: 'Dairy & Milk Farming', icon: '🥛', count: 'Daily Cashflow' },
            { label: 'Tailoring & Garments', icon: '🧵', count: 'Low Capital' },
            { label: 'Handicrafts & Jute Bags', icon: '🧺', count: 'Govt Subsidy' },
            { label: 'Village Kirana & Stores', icon: '🏪', count: 'Essential Retail' },
          ].map((item, i) => (
            <div key={i} className="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-xs hover:border-orange-300 transition-all text-center">
              <span className="text-3xl block mb-2">{item.icon}</span>
              <h4 className="text-sm font-bold text-slate-800">{item.label}</h4>
              <span className="inline-block mt-1 text-[11px] font-semibold text-orange-600 bg-orange-50 px-2 py-0.5 rounded-full">
                {item.count}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* Two Core Phases Explanation */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-8 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4">
          <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-orange-600 bg-orange-50 px-3 py-1 rounded-full">
            <Compass className="w-3.5 h-3.5" />
            <span>Phase 1: Business Starter</span>
          </div>
          <h3 className="text-xl font-bold text-slate-900">
            Before You Start: AI Feasibility & Location Analysis
          </h3>
          <p className="text-sm text-slate-600 leading-relaxed">
            Enter your available budget (e.g. ₹20,000 - ₹1,00,000), location/town, skills, and interests. Our AI recommends practical businesses, breaks down initial equipment costs, operating expenses, and matching government subsidies.
          </p>
          <ul className="space-y-2 text-xs text-slate-600 pt-2">
            <li className="flex items-center gap-2 font-medium">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
              <span>Estimated startup budget & monthly profit calculations</span>
            </li>
            <li className="flex items-center gap-2 font-medium">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
              <span>Location suitability & target market breakdown</span>
            </li>
            <li className="flex items-center gap-2 font-medium">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
              <span>Direct step-by-step starting checklist</span>
            </li>
          </ul>
        </div>

        <div className="p-8 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4">
          <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full">
            <LayoutDashboard className="w-3.5 h-3.5" />
            <span>Phase 2: Business Management</span>
          </div>
          <h3 className="text-xl font-bold text-slate-900">
            After You Start: Daily AI Business Operating System
          </h3>
          <p className="text-sm text-slate-600 leading-relaxed">
            A simplified, voice-enabled assistant designed for first-time digital entrepreneurs. Track daily sales, log expenses, compute exact profit margins, and create regional marketing messages.
          </p>
          <ul className="space-y-2 text-xs text-slate-600 pt-2">
            <li className="flex items-center gap-2 font-medium">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
              <span>Deterministic pricing and break-even calculations (no LLM math errors)</span>
            </li>
            <li className="flex items-center gap-2 font-medium">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
              <span>One-click WhatsApp marketing copy in Telugu, Hindi & English</span>
            </li>
            <li className="flex items-center gap-2 font-medium">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
              <span>Verified Government schemes (PMEGP, MUDRA, Vishwakarma, Udyam)</span>
            </li>
          </ul>
        </div>
      </section>

      {/* Demo Persona Callout */}
      <section className="bg-amber-50/70 border border-amber-200 rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2 text-center md:text-left">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-800 bg-amber-100/80 px-2.5 py-1 rounded-full">
            <Store className="w-3.5 h-3.5 text-orange-600" />
            <span>Featured Demo Persona</span>
          </div>
          <h4 className="text-lg sm:text-xl font-bold text-slate-900">
            Lakshmi Homemade Foods — Tenali, Andhra Pradesh
          </h4>
          <p className="text-xs sm:text-sm text-slate-600 max-w-xl">
            Preloaded with authentic micro-business metrics: ₹120 cost per kg, ₹180 selling price, ₹35,200 monthly sales, and ₹13,900 net profit. Test every feature live without manual data entry.
          </p>
        </div>

        <Link
          to="/dashboard"
          className="px-5 py-3 bg-orange-600 hover:bg-orange-700 text-white font-bold rounded-xl shadow-sm text-sm whitespace-nowrap flex items-center gap-2 transition-colors"
        >
          <span>Open Live Demo</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </section>
    </div>
  );
};

export default Landing;
