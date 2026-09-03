import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext.jsx';
import { GOVERNMENT_SCHEMES } from '../data/schemesData.js';
import Modal from '../components/common/Modal.jsx';
import {
  Landmark,
  ShieldCheck,
  ExternalLink,
  Search,
  CheckCircle2,
  FileText,
  Sparkles,
  Info
} from 'lucide-react';

const Schemes = () => {
  const { t, currentLanguage } = useLanguage();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [activeModalScheme, setActiveModalScheme] = useState(null);
  const [aiExplainText, setAiExplainText] = useState(null);

  const categories = ['All', 'Small Business & Trading', 'Manufacturing & Services', 'Artisans & Craftsmen', 'Women Rural Livelihoods', 'General Business Registration'];

  const filteredSchemes = GOVERNMENT_SCHEMES.filter((s) => {
    const matchCat = selectedCategory === 'All' || s.category === selectedCategory;
    const matchSearch =
      s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.shortName.toLowerCase().includes(searchTerm.toLowerCase());
    return matchCat && matchSearch;
  });

  const handleExplain = (scheme) => {
    setActiveModalScheme(scheme);
    if (currentLanguage === 'te') {
      setAiExplainText(
        `"${scheme.shortName}" అనేది కేంద్ర లేదా రాష్ట్ర ప్రభుత్వ అధికారిక పథకం. దీని ద్వారా ఎలాంటి అధిక వడ్డీలు లేకుండా సులభంగా లోన్ పొందవచ్చు. మీ లక్ష్మి హోమ్‌మేడ్ ఫుడ్స్ వంటి తయారీ యూనిట్‌కు అవసరమైన ఆధార్, పాన్ కార్డ్ మరియు ప్రాజెక్ట్ రిపోర్ట్‌తో మీ సమీప బ్యాంక్ లేదా సేవా కేంద్రాన్ని సంప్రదించవచ్చు.`
      );
    } else {
      setAiExplainText(
        `"${scheme.shortName}" is a government-verified livelihood scheme. It allows rural entrepreneurs to secure collateral-free credit or margin-money subsidies to purchase equipment and scale sales. Bring your Aadhaar, bank passbook, and basic business DPR to your nearest public sector bank or Panchayat office.`
      );
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-600 to-amber-600 rounded-3xl p-6 sm:p-8 text-white shadow-lg shadow-orange-500/10">
        <div className="inline-flex items-center gap-2 bg-white/20 px-3 py-1 rounded-full text-xs font-bold text-white mb-2">
          <ShieldCheck className="w-4 h-4 text-emerald-300" />
          <span>VERIFIED STRUCTURED GOVERNMENT SCHEME LAYER</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
          {t.schemes?.title || 'Verified Government Schemes & Subsidies'}
        </h1>
        <p className="mt-1 text-sm sm:text-base text-orange-100 max-w-2xl">
          {t.schemes?.subtitle || 'Official central and state schemes for micro and small enterprises with verified eligibility criteria.'}
        </p>
      </div>

      {/* Category Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
              selectedCategory === cat
                ? 'bg-orange-600 text-white shadow-xs'
                : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Search Bar */}
      <div className="flex items-center gap-3 bg-white p-3 rounded-2xl border border-slate-200">
        <Search className="w-4 h-4 text-slate-400 ml-2" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder={t.schemes?.searchPlaceholder || 'Search schemes by keyword, trade, or category...'}
          className="flex-1 text-xs sm:text-sm bg-transparent outline-none font-medium"
        />
      </div>

      {/* Schemes Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredSchemes.map((scheme) => (
          <div
            key={scheme._id}
            className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm hover:border-orange-300 transition-all flex flex-col justify-between space-y-4"
          >
            <div className="space-y-3">
              <div className="flex items-start justify-between gap-3">
                <span className="text-[11px] font-bold text-orange-700 bg-orange-50 px-2.5 py-0.5 rounded-full uppercase">
                  {scheme.category}
                </span>
                <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                  {scheme.state}
                </span>
              </div>

              <div>
                <h3 className="text-lg font-black text-slate-900">{scheme.name}</h3>
                <p className="text-xs text-slate-400 font-semibold mt-0.5">{scheme.ministry}</p>
              </div>

              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                {scheme.description}
              </p>

              {/* Key terms */}
              <div className="grid grid-cols-2 gap-2 pt-2">
                <div className="p-3 bg-slate-50 rounded-2xl">
                  <span className="text-[10px] text-slate-400 uppercase font-bold">Max Loan / Grant</span>
                  <p className="text-xs sm:text-sm font-black text-slate-900 mt-0.5">{scheme.maxLoan}</p>
                </div>

                <div className="p-3 bg-amber-50/60 rounded-2xl border border-amber-100">
                  <span className="text-[10px] text-amber-800 uppercase font-bold">Subsidy Support</span>
                  <p className="text-xs sm:text-sm font-bold text-amber-900 mt-0.5">{scheme.subsidy}</p>
                </div>
              </div>

              {/* Eligibility Preview */}
              <div>
                <h4 className="text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                  <span>Key Eligibility</span>
                </h4>
                <ul className="space-y-1 text-xs text-slate-600">
                  {scheme.eligibility.slice(0, 2).map((el, i) => (
                    <li key={i} className="truncate">• {el}</li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => handleExplain(scheme)}
                className="text-xs font-bold text-orange-600 hover:text-orange-700 flex items-center gap-1"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>{t.schemes?.explainWithAi || 'Explain in Simple Words'}</span>
              </button>

              <a
                href={scheme.officialSource}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors"
              >
                <span>{t.schemes?.officialSource || 'Official Portal'}</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        ))}
      </div>

      {/* Detail & AI Explanation Modal */}
      <Modal
        isOpen={Boolean(activeModalScheme)}
        onClose={() => {
          setActiveModalScheme(null);
          setAiExplainText(null);
        }}
        title={activeModalScheme?.name || 'Scheme Details'}
      >
        {activeModalScheme && (
          <div className="space-y-5 text-slate-700 text-xs sm:text-sm">
            {aiExplainText && (
              <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl space-y-1">
                <span className="text-xs font-bold text-amber-900 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-orange-600" />
                  <span>AI Simple Explanation</span>
                </span>
                <p className="text-xs text-slate-700 leading-relaxed">{aiExplainText}</p>
              </div>
            )}

            <div>
              <h4 className="font-bold text-slate-900 mb-1">Required Documents</h4>
              <ul className="list-disc pl-4 space-y-1 text-slate-600">
                {activeModalScheme.documents.map((d, i) => (
                  <li key={i}>{d}</li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-slate-900 mb-1">Benefits & Subsidies</h4>
              <ul className="list-disc pl-4 space-y-1 text-slate-600">
                {activeModalScheme.benefits.map((b, i) => (
                  <li key={i}>{b}</li>
                ))}
              </ul>
            </div>

            <div className="pt-2">
              <a
                href={activeModalScheme.officialSource}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 bg-orange-600 hover:bg-orange-700 text-white font-bold rounded-xl text-center block transition-colors shadow-sm"
              >
                Open Official Portal ({activeModalScheme.shortName})
              </a>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default Schemes;
