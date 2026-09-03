import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext.jsx';
import { useBusiness } from '../context/BusinessContext.jsx';
import { aiService } from '../services/api.js';
import VoiceInputButton from '../components/common/VoiceInputButton.jsx';
import {
  Megaphone,
  Sparkles,
  Share2,
  Copy,
  Check,
  RefreshCw,
  Send,
  MessageCircle,
  FileText,
  Smartphone
} from 'lucide-react';

const Marketing = () => {
  const { t, currentLanguage, languages } = useLanguage();
  const { business, products } = useBusiness();

  const [product, setProduct] = useState('Avakaya (Mango) Pickle - 1kg');
  const [targetCustomer, setTargetCustomer] = useState('Local households and weekly market shoppers');
  const [tone, setTone] = useState('Friendly & Festive');
  const [discount, setDiscount] = useState('Special Festival Discount: 10% off on 2kg orders!');
  const [targetLanguage, setTargetLanguage] = useState(currentLanguage || 'te');

  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('whatsapp');
  const [content, setContent] = useState({
    whatsappMessage: targetLanguage === 'te'
      ? "రుచికరమైన సాంప్రదాయ మామిడికాయ పచ్చడి ఇప్పుడు మీ ముంగిట! 🌶️🥭\n\nమా స్వచ్ఛమైన నువ్వుల నూనె, గుంటూరు కారంతో ఇంట్లో తయారు చేసిన అసలైన ఆంధ్ర పచ్చడి.\n\n✨ ప్రత్యేక ఆఫర్: పండుగ సందర్భంగా 2kg కొనుగోలుపై 10% రాయితీ!\n📍 ఉచిత లోకల్ డెలివరీ.\n📞 ఆర్డర్ల కోసం ఇప్పుడే సంప్రదించండి: 9876543210\nలక్ష్మి హోమ్‌మేడ్ ఫుడ్స్"
      : "Crispy & Authentic Homemade Avakaya Mango Pickle at your doorstep! 🌶️🥭\n\nPrepared using traditional Andhra recipes, cold-pressed sesame oil, and authentic Guntur red chillies.\n\n✨ Special Offer: Get 10% OFF on 2kg purchase for this festive season!\n📍 Free local doorstep delivery in town.\n📞 WhatsApp / Call to order: 9876543210\nLakshmi Homemade Foods",
    socialPost: "Taste the authentic tradition of homemade Mango Pickle! Made with pure cold-pressed oil and zero chemical preservatives. ❤️\n\nOrder today: Special festive introductory prices!\n#HomemadePickles #VocalForLocal #VyaparMitra #AuthenticFlavours",
    posterText: "🎉 SPECIAL FESTIVAL OFFER! 🎉\n\nFresh Batch of Traditional Mango Pickle\n100% Hygienic • Cold Pressed Oil • Farm Fresh\n\nSpecial Price: Only ₹180 per 1kg Jar\nContact: Lakshmi Homemade Foods - 9876543210"
  });

  const [copied, setCopied] = useState(false);

  const handleGenerate = async (e) => {
    if (e) e.preventDefault();
    setLoading(true);
    try {
      const res = await aiService.generateMarketingContent({
        product,
        targetCustomer,
        tone,
        discount,
        language: targetLanguage
      });
      if (res && res.data) {
        setContent(res.data);
      }
    } catch (err) {
      console.error('Marketing generation error:', err);
    } finally {
      setLoading(false);
    }
  };

  const getActiveText = () => {
    if (activeTab === 'whatsapp') return content.whatsappMessage;
    if (activeTab === 'social') return content.socialPost;
    return content.posterText;
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(getActiveText());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShareWhatsApp = () => {
    const text = encodeURIComponent(content.whatsappMessage);
    window.open(`https://wa.me/?text=${text}`, '_blank');
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-600 to-amber-600 rounded-3xl p-6 sm:p-8 text-white shadow-lg shadow-orange-500/10">
        <div className="inline-flex items-center gap-2 bg-white/20 px-3 py-1 rounded-full text-xs font-bold text-white mb-2">
          <Sparkles className="w-4 h-4 text-amber-200" />
          <span>AI MARKETING GENERATOR</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
          {t.marketing?.title || 'AI Local Marketing Studio'}
        </h1>
        <p className="mt-1 text-sm sm:text-base text-orange-100 max-w-2xl">
          {t.marketing?.subtitle || 'Generate WhatsApp messages, festival offers, and social posts in your regional language.'}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Generator Controls (Left 5 Cols) */}
        <div className="lg:col-span-5 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm space-y-5">
          <h2 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-4">
            Campaign & Offer Details
          </h2>

          <form onSubmit={handleGenerate} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {t.marketing?.product || 'Product'}
              </label>
              <select
                value={product}
                onChange={(e) => setProduct(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:bg-white focus:outline-none"
              >
                {products.map((p) => (
                  <option key={p._id} value={p.name}>{p.name}</option>
                ))}
                <option value="Festival Pickles Gift Hamper">Festival Pickles Gift Hamper (Combo)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center justify-between">
                <span>{t.marketing?.discount || 'Offer / Discount / Festival Details'}</span>
                <VoiceInputButton
                  onTranscript={(text) => setDiscount(text)}
                  className="p-1"
                />
              </label>
              <input
                type="text"
                value={discount}
                onChange={(e) => setDiscount(e.target.value)}
                placeholder="e.g. 10% off for Ugadi / Sankranti!"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:bg-white focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {t.marketing?.tone || 'Tone of Message'}
                </label>
                <select
                  value={tone}
                  onChange={(e) => setTone(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:bg-white focus:outline-none"
                >
                  <option value="Friendly & Festive">Friendly & Festive</option>
                  <option value="Premium Quality">Pure & Authentic</option>
                  <option value="Urgent Limited Offer">Urgent Limited Offer</option>
                  <option value="Wholesale Retailer Offer">Wholesale / Kirana Pitch</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {t.marketing?.language || 'Language'}
                </label>
                <select
                  value={targetLanguage}
                  onChange={(e) => setTargetLanguage(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:bg-white focus:outline-none"
                >
                  {languages.map((l) => (
                    <option key={l.code} value={l.code}>{l.native}</option>
                  ))}
                </select>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-orange-600 hover:bg-orange-700 text-white font-bold rounded-2xl text-sm shadow-md transition-all flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4 text-amber-200" />
              <span>{loading ? 'Writing in Local Language...' : (t.marketing?.generateBtn || 'Generate Marketing Content')}</span>
            </button>
          </form>
        </div>

        {/* Output Preview & Share Center (Right 7 Cols) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm space-y-5">
            {/* Tabs */}
            <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
              <button
                onClick={() => setActiveTab('whatsapp')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors flex items-center gap-2 ${
                  activeTab === 'whatsapp'
                    ? 'bg-emerald-500 text-white shadow-xs'
                    : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
                }`}
              >
                <MessageCircle className="w-4 h-4" />
                <span>{t.marketing?.whatsappTab || 'WhatsApp Message'}</span>
              </button>

              <button
                onClick={() => setActiveTab('social')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors flex items-center gap-2 ${
                  activeTab === 'social'
                    ? 'bg-orange-500 text-white shadow-xs'
                    : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
                }`}
              >
                <Smartphone className="w-4 h-4" />
                <span>{t.marketing?.socialTab || 'Social Post'}</span>
              </button>

              <button
                onClick={() => setActiveTab('poster')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors flex items-center gap-2 ${
                  activeTab === 'poster'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
                }`}
              >
                <FileText className="w-4 h-4" />
                <span>{t.marketing?.posterTab || 'Poster Banner'}</span>
              </button>
            </div>

            {/* Content Preview Box */}
            <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-5 min-h-[200px] flex flex-col justify-between">
              <div className="text-xs sm:text-sm text-slate-800 whitespace-pre-line leading-relaxed font-sans font-medium">
                {getActiveText()}
              </div>

              <div className="mt-4 pt-3 border-t border-slate-200/60 flex items-center justify-between text-xs text-slate-400">
                <span>Optimized for local Indian consumer trust</span>
                <span className="font-bold text-orange-600 uppercase">{targetLanguage}</span>
              </div>
            </div>

            {/* Action Bar */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              {activeTab === 'whatsapp' && (
                <button
                  type="button"
                  onClick={handleShareWhatsApp}
                  className="flex-1 py-3 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-2xl text-xs sm:text-sm shadow-md transition-colors flex items-center justify-center gap-2"
                >
                  <Share2 className="w-4 h-4" />
                  <span>{t.marketing?.shareWhatsapp || 'Share on WhatsApp'}</span>
                </button>
              )}

              <button
                type="button"
                onClick={handleCopy}
                className="py-3 px-5 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 font-bold rounded-2xl text-xs sm:text-sm shadow-xs transition-colors flex items-center justify-center gap-2"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                <span>{copied ? (t.marketing?.copied || 'Copied!') : (t.marketing?.copyText || 'Copy Text')}</span>
              </button>

              <button
                type="button"
                onClick={handleGenerate}
                disabled={loading}
                className="p-3 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 rounded-2xl shadow-xs transition-colors"
                title="Regenerate"
              >
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Marketing;
