import React, { useMemo, useState } from 'react';
import { AlertCircle, CheckCircle2, Compass, LocateFixed, MapPin, Navigation, RefreshCw, Search, Sparkles } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext.jsx';
import { detectUserLocation, formatCoordinates } from '../services/locationService.js';
import { analyzeBusinessArea } from '../data/businessOpportunityData.js';
import OpportunityCard from '../components/common/OpportunityCard.jsx';

const STORAGE_KEY = 'vyapar-business-location';
const initialLocation = { town: '', district: '', state: '', pin: '', latitude: null, longitude: null, status: 'idle' };
const locationMessages = {
  denied: 'Location permission was denied. Enter your area manually instead.',
  unavailable: 'We could not find your location right now. Please try again or enter your area manually.',
  timeout: 'Location detection took too long. Please try again or enter your area manually.',
  unsupported: 'This browser does not support location detection. Enter your area manually.'
};

const loadLocation = () => {
  try {
    return { ...initialLocation, ...JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}') };
  } catch {
    return initialLocation;
  }
};

const BusinessOpportunity = () => {
  const { t } = useLanguage();
  const [location, setLocation] = useState(loadLocation);
  const [showManual, setShowManual] = useState(false);
  const [analysis, setAnalysis] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState('');

  const locationLabel = [location.town, location.district, location.state].filter(Boolean).join(', ');
  const hasArea = Boolean(location.town || location.district || location.state || location.pin);
  const locationFormValid = [location.town, location.district, location.state].every((value) => value.trim());
  const statusText = useMemo(() => ({
    detecting: 'Detecting your location...',
    detected: 'Location detected',
    manual: 'Area entered manually',
    idle: 'Location not set'
  }[location.status] || 'Location not set'), [location.status]);

  const saveLocation = (nextLocation) => {
    setLocation(nextLocation);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(nextLocation));
  };

  const detectLocation = async () => {
    setError('');
    setLocation((previous) => ({ ...previous, status: 'detecting' }));
    try {
      const coordinates = await detectUserLocation();
      saveLocation({
        ...location,
        latitude: coordinates.latitude,
        longitude: coordinates.longitude,
        status: 'detected',
        town: location.town || 'Your current area',
        district: location.district || 'Local district',
        state: location.state || 'India'
      });
    } catch (reason) {
      setLocation((previous) => ({ ...previous, status: reason.code }));
      setError(locationMessages[reason.code] || locationMessages.unavailable);
    }
  };

  const saveManualLocation = (event) => {
    event.preventDefault();
    if (!locationFormValid) {
      setError('Add your town, district, and state to analyze this area.');
      return;
    }
    saveLocation({ ...location, status: 'manual' });
    setShowManual(false);
    setError('');
  };

  const analyzeArea = () => {
    if (!hasArea) {
      setError('Detect your location or enter an area before starting analysis.');
      return;
    }
    setError('');
    setIsAnalyzing(true);
    window.setTimeout(() => {
      setAnalysis(analyzeBusinessArea(location));
      setIsAnalyzing(false);
    }, 500);
  };

  return (
    <div className="space-y-6">
      <header className="rounded-3xl bg-gradient-to-r from-orange-600 to-amber-600 p-6 text-white shadow-lg sm:p-8">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-orange-100">{t.discovery?.title || 'Business Opportunity Finder'}</span>
            <h1 className="mt-2 text-2xl font-black sm:text-3xl">AI Business Opportunity Finder</h1>
            <p className="mt-1 max-w-2xl text-sm text-orange-100">Find promising business directions based on your local area.</p>
          </div>
          <div className="inline-flex items-center gap-2 rounded-full bg-white/20 px-3 py-1 text-xs font-bold"><Sparkles className="h-4 w-4" /> Demo analysis</div>
        </div>
      </header>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <section className="space-y-4 rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm" aria-labelledby="location-title">
          <div className="flex items-start gap-3">
            <MapPin className="mt-1 h-5 w-5 text-orange-600" />
            <div><h2 id="location-title" className="text-lg font-bold text-slate-900">Your area</h2><p className="text-sm text-slate-600">Start with a town, district, or your current location.</p></div>
          </div>
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-700"><span className={`h-2.5 w-2.5 rounded-full ${location.status === 'detected' ? 'bg-emerald-500' : 'bg-slate-300'}`} />{statusText}</div>
          {locationLabel && <div className="rounded-xl bg-slate-50 p-3"><strong className="block text-sm text-slate-900">{locationLabel}</strong><span className="text-xs text-slate-600">{location.pin ? `PIN ${location.pin}` : 'General area only'}</span></div>}
          <div className="grid grid-cols-2 gap-3 text-xs"><div className="rounded-xl border border-slate-200 p-3"><span className="block text-slate-600">Latitude</span><strong>{formatCoordinates(location.latitude)}</strong></div><div className="rounded-xl border border-slate-200 p-3"><span className="block text-slate-600">Longitude</span><strong>{formatCoordinates(location.longitude)}</strong></div></div>
          {error && <div className="flex items-start gap-2 rounded-xl border border-rose-200 bg-rose-50 p-3 text-xs font-semibold text-rose-800" role="alert"><AlertCircle className="h-4 w-4 shrink-0" />{error}</div>}
          <div className="flex flex-col gap-2 sm:flex-row"><button type="button" onClick={detectLocation} disabled={location.status === 'detecting'} className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-orange-600 px-4 py-2.5 text-sm font-bold text-white hover:bg-orange-700 disabled:opacity-60"><LocateFixed className="h-4 w-4" />{location.status === 'detecting' ? 'Detecting...' : 'Detect My Location'}</button><button type="button" onClick={() => setShowManual((open) => !open)} className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl border border-slate-300 px-4 py-2.5 text-sm font-bold text-slate-800 hover:bg-slate-50"><Search className="h-4 w-4" />{showManual ? 'Close manual entry' : 'Enter Location Manually'}</button></div>
          <p className="text-xs text-slate-600">Your location is used only for local business insights. We do not continuously track your location.</p>
        </section>

        <section className="space-y-4 rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm" aria-labelledby="analysis-title">
          <div className="flex items-start gap-3"><Compass className="mt-1 h-5 w-5 text-orange-600" /><div><h2 id="analysis-title" className="text-lg font-bold text-slate-900">Analyze your area</h2><p className="text-sm text-slate-600">Explore estimated demand and competition patterns around your area.</p></div></div>
          <p className="text-sm leading-relaxed text-slate-700">This demo uses the selected area to identify promising small-business directions. It is not live market data.</p>
          <button type="button" onClick={analyzeArea} disabled={isAnalyzing || !hasArea} className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-3 text-sm font-bold text-white hover:bg-emerald-700 disabled:opacity-50">{isAnalyzing ? <><RefreshCw className="h-4 w-4 animate-spin" />Analyzing your local market...</> : <><Navigation className="h-4 w-4" />Analyze My Area</>}</button>
        </section>
      </div>

      {showManual && <form onSubmit={saveManualLocation} className="space-y-4 rounded-3xl border border-orange-200 bg-orange-50/60 p-6"><div><span className="text-xs font-bold uppercase tracking-wider text-orange-700">Alternative</span><h2 className="mt-1 text-xl font-bold text-slate-900">Enter your area</h2><p className="text-sm text-slate-700">GPS is optional. We only need a general area for this demo.</p></div><div className="grid grid-cols-1 gap-3 sm:grid-cols-2">{[['town', 'Village / Town', 'Bhimavaram'], ['district', 'District', 'West Godavari'], ['state', 'State', 'Andhra Pradesh'], ['pin', 'PIN Code', '534202']].map(([key, label, placeholder]) => <label key={key} className="text-xs font-bold text-slate-800">{label}<input inputMode={key === 'pin' ? 'numeric' : undefined} value={location[key]} onChange={(event) => setLocation({ ...location, [key]: event.target.value })} placeholder={placeholder} className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm font-medium text-slate-900 outline-none focus:border-orange-500" /></label>)}</div><button type="submit" className="rounded-xl bg-orange-600 px-4 py-2.5 text-sm font-bold text-white hover:bg-orange-700">Save Area</button></form>}

      {!analysis && <section className="rounded-3xl border border-dashed border-slate-300 bg-white p-8 text-center"><Compass className="mx-auto h-8 w-8 text-orange-500" /><h2 className="mt-3 text-xl font-bold text-slate-900">Your local opportunity map starts here</h2><p className="mt-1 text-sm text-slate-600">Set your area above, then run a demo market analysis to compare business ideas.</p></section>}

      {analysis && <>
        <section className="rounded-3xl border border-orange-200 bg-orange-50/60 p-6"><span className="text-xs font-bold uppercase tracking-wider text-orange-700">Analysis complete</span><h2 className="mt-1 text-2xl font-black text-slate-900">Opportunities for {analysis.locationLabel}</h2><p className="mt-1 text-sm text-slate-700">{analysis.sourceNote}</p></section>
        <section className="space-y-4"><div><span className="text-xs font-bold uppercase tracking-wider text-orange-700">Recommendations</span><h2 className="text-xl font-bold text-slate-900">Top recommended businesses</h2><p className="text-sm text-slate-700">Three practical expansion or new-product directions for Lakshmi Foods, based on local demand and a micro-enterprise budget.</p></div><div className="grid grid-cols-1 gap-4 lg:grid-cols-3">{analysis.opportunities.slice(0, 3).map((opportunity, index) => <OpportunityCard key={opportunity.businessName} opportunity={opportunity} rank={index + 1} />)}</div></section>
        <section className="space-y-4"><div><span className="text-xs font-bold uppercase tracking-wider text-orange-700">Local market analyst</span><h2 className="text-xl font-bold text-slate-900">How to validate the opportunities</h2></div><div className="grid grid-cols-1 gap-4 lg:grid-cols-3">{analysis.opportunities.slice(0, 3).map((opportunity) => <article key={`${opportunity.businessName}-analyst`} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><h3 className="font-bold text-slate-900">{opportunity.businessName}</h3><p className="mt-2 text-sm leading-relaxed text-slate-700"><strong>Why here:</strong> {opportunity.whyHere}</p><dl className="mt-4 grid grid-cols-2 gap-3 text-xs"><div className="rounded-xl bg-orange-50 p-3"><dt className="font-semibold text-orange-900">Initial investment</dt><dd className="mt-1 font-bold text-orange-800">{opportunity.investment}</dd></div><div className="rounded-xl bg-emerald-50 p-3"><dt className="font-semibold text-emerald-900">Payback estimate</dt><dd className="mt-1 font-bold text-emerald-800">{opportunity.payback}</dd></div></dl><p className="mt-4 text-sm leading-relaxed text-slate-700"><strong>Step 1:</strong> {opportunity.firstStep}</p></article>)}</div></section>
        <section className="space-y-4"><h2 className="text-xl font-bold text-slate-900">Nearby business overview</h2><div className="grid grid-cols-2 gap-3 sm:grid-cols-4">{analysis.nearbyOverview.map((item) => <div key={item.label} className="rounded-2xl border border-slate-200 bg-white p-4"><strong className="block text-2xl text-orange-700">{item.count}</strong><span className="text-xs font-semibold text-slate-700">{item.label}</span></div>)}</div></section>
        <p className="text-xs text-slate-600"><strong>Important:</strong> Demand and business counts are demo estimates. Connect verified Maps, Places, government, or market data before making business decisions.</p>
      </>}
    </div>
  );
};

export default BusinessOpportunity;
