import React, { useState, useEffect } from 'react';
import { Car, PredictParams, FullPredictionResponse } from './types';
import { carsData as localCars } from './carsData';
import { CarCard } from './components/CarCard';
import { CarModal } from './components/CarModal';
import { CompareView } from './components/CompareView';
import { 
  Car as CarIcon, 
  Search, 
  Cpu, 
  Settings, 
  Sparkles, 
  Tag, 
  Activity, 
  BookOpen, 
  Terminal, 
  GitCompare, 
  FileCode, 
  CheckCircle, 
  AlertTriangle, 
  TrendingUp, 
  Coins, 
  ShieldCheck, 
  Gauge, 
  Globe, 
  Clipboard,
  Check,
  Server
} from 'lucide-react';

export default function App() {
  // Navigation & Filtering States
  const [activeTab, setActiveTab] = useState<'all' | 'new' | 'used' | 'compare' | 'predict'>('all');
  const [currentBrand, setCurrentBrand] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCar, setSelectedCar] = useState<Car | null>(null);
  
  // Cars data loaded dynamically from server
  const [cars, setCars] = useState<Car[]>(localCars);
  const [carsLoading, setCarsLoading] = useState<boolean>(false);

  // Prediction Form States
  const [pBrand, setPBrand] = useState<string>('Toyota');
  const [pCondition, setPCondition] = useState<'new' | 'used'>('new');
  const [pYear, setPYear] = useState<number>(2024);
  const [pCc, setPCc] = useState<number>(1500);
  const [pPower, setPPower] = useState<number>(121);
  const [pSeats, setPSeats] = useState<number>(7);
  const [pMileage, setPMileage] = useState<number>(0);
  const [pFuel, setPFuel] = useState<'Bensin' | 'Electric' | 'Hybrid' | 'Diesel'>('Bensin');
  
  // Prediction result state
  const [predictionResult, setPredictionResult] = useState<FullPredictionResponse | null>(null);
  const [predictLoading, setPredictLoading] = useState<boolean>(false);
  const [predictError, setPredictError] = useState<string | null>(null);

  // Docs sandbox state
  const [docsPlaygroundEndpoint, setDocsPlaygroundEndpoint] = useState<string>('/api/docs');
  const [docsPlaygroundResponse, setDocsPlaygroundResponse] = useState<any>(null);
  const [docsPlaygroundLoading, setDocsPlaygroundLoading] = useState<boolean>(false);
  const [copiedText, setCopiedText] = useState<string>('');

  // Brand Options derived dynamically from dataset
  const brands = ['all', ...Array.from(new Set(cars.map(c => c.brand)))];

  // Fetch cars on start to ensure dynamic database sync
  useEffect(() => {
    const fetchCars = async () => {
      setCarsLoading(true);
      try {
        const res = await fetch('/api/cars');
        const json = await res.json();
        if (json.status === 'success') {
          setCars(json.data);
        }
      } catch (err) {
        console.error("Gagal sinkron data mobil dari server. Menggunakan data lokal.", err);
      } finally {
        setCarsLoading(false);
      }
    };
    fetchCars();
  }, []);

  const formatIDR = (num: number) => {
    return 'Rp ' + num.toLocaleString('id-ID');
  };

  // Filter cars depending on search, brand filter and activeTab
  const getFilteredCars = () => {
    let output = [...cars];
    
    if (activeTab === 'new') {
      output = output.filter(c => c.condition === 'new');
    } else if (activeTab === 'used') {
      output = output.filter(c => c.condition === 'used');
    }

    if (currentBrand !== 'all') {
      output = output.filter(c => c.brand.toLowerCase() === currentBrand.toLowerCase());
    }

    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      output = output.filter(c => 
        c.name.toLowerCase().includes(q) || 
        c.brand.toLowerCase().includes(q) || 
        c.type.toLowerCase().includes(q) ||
        c.fuel.toLowerCase().includes(q)
      );
    }

    return output;
  };

  // Submit prediction params to server endpoint
  const handleCalculateEstimates = async (e: React.FormEvent) => {
    e.preventDefault();
    setPredictLoading(true);
    setPredictError(null);
    setPredictionResult(null);

    const payload: PredictParams = {
      brand: pBrand,
      condition: pCondition,
      year: Number(pYear),
      cc: Number(pCc),
      power: Number(pPower),
      seats: Number(pSeats),
      mileage: pCondition === 'new' ? 0 : Number(pMileage),
      fuel: pFuel
    };

    try {
      const response = await fetch('/api/predict', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const resData = await response.json();
      if (response.ok && resData.status === 'success') {
        setPredictionResult(resData.data);
      } else {
        setPredictError(resData.message || "Gagal menghitung prediksi.");
      }
    } catch (err: any) {
      setPredictError("Koneksi gagal: " + err?.message);
    } finally {
      setPredictLoading(false);
    }
  };

  // Run Sandbox Request in Docs
  const handleTestSandbox = async () => {
    setDocsPlaygroundLoading(true);
    setDocsPlaygroundResponse(null);
    try {
      let res;
      if (docsPlaygroundEndpoint === '/api/predict') {
        res = await fetch('/api/predict', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            brand: 'Toyota',
            condition: 'used',
            year: 2022,
            cc: 1500,
            power: 107,
            seats: 7,
            mileage: 18000,
            fuel: 'Bensin'
          })
        });
      } else {
        res = await fetch(docsPlaygroundEndpoint);
      }
      const json = await res.json();
      setDocsPlaygroundResponse(json);
    } catch (err: any) {
      setDocsPlaygroundResponse({ error: err?.message || "Gagal fetch API" });
    } finally {
      setDocsPlaygroundLoading(false);
    }
  };

  // Copy helper
  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(label);
    setTimeout(() => setCopiedText(''), 2000);
  };

  const filteredCarsList = getFilteredCars();

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-500/10 via-rose-500/5 to-red-600/15 text-slate-900 flex flex-col font-sans transition-all duration-300">
      
      {/* 1. Header Banner */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b-2 border-slate-900 shadow-[0_3px_0_0_#0f172a]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between py-4 gap-4">
            
            {/* Logo and Tagline */}
            <div className="flex items-center gap-3">
              <div className="bg-orange-600 border-2 border-slate-900 p-2 text-white rounded-2xl shadow-[3px_3px_0px_0px_rgba(15,23,42,1)] transform hover:rotate-6 transition-transform flex items-center gap-1">
                <span className="text-xl">🛞</span>
                <span className="text-xs">⚠️</span>
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h1 className="text-2xl font-black tracking-tight text-slate-900">
                    AutoD<span className="text-orange-600 font-extrabold">🛞</span>ta
                  </h1>
                  <span className="bg-orange-100 text-orange-900 text-[9px] font-black px-2 py-0.5 rounded-full border border-orange-400">
                    LAPORAN 1 & 2
                  </span>
                </div>
                <p className="text-[10px] text-slate-600 font-black tracking-widest uppercase">
                  FIND AND COMPARE ALL NEW AND USED CARS SPECS FOR SALE
                </p>
              </div>
            </div>

            {/* Quick Status Info Bar */}
            <div className="flex items-center gap-4 bg-orange-50/50 border-2 border-slate-900 px-4 py-2 rounded-xl text-xs font-black text-slate-800 shadow-[2px_2px_0px_0px_rgba(15,23,42,1)]">
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>Indonesian Used Cars Database Sync</span>
              </div>
              <div className="h-4 w-px bg-slate-900" />
              <div className="flex items-center gap-1.5 text-orange-600">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Interactive Predictions Active</span>
              </div>
            </div>

          </div>
        </div>
      </header>

      {/* 2. Top Navigation Tabs */}
      <nav className="bg-white border-b-2 border-slate-950 sticky top-[73px] md:top-[81px] z-30 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex overflow-x-auto scrollbar-none gap-2 py-3">
            {[
              { id: 'all', label: '🚗 Semua Mobil', badge: cars.length },
              { id: 'new', label: '✨ Mobil Baru' },
              { id: 'used', label: '🔄 Mobil Bekas' },
              { id: 'compare', label: '🔀 Komparator' },
              { id: 'predict', label: '🔮 AI Predictor' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id as any);
                  setSearchQuery('');
                  setCurrentBrand('all');
                }}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-black whitespace-nowrap transition-all duration-150 border-2 select-none cursor-pointer ${
                  activeTab === tab.id
                    ? 'bg-orange-600 text-white border-slate-900 shadow-[3px_3px_0px_0px_rgba(15,23,42,1)]'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:border-slate-900 hover:bg-slate-100'
                }`}
              >
                {tab.label}
                {tab.badge !== undefined && (
                  <span className={`px-1.5 py-0.2 text-[9px] rounded-full font-black ${
                    activeTab === tab.id ? 'bg-slate-950 text-white border border-white/20' : 'bg-slate-200 text-slate-800'
                  }`}>
                    {tab.badge}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* 3. Main Application Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Render catalog filters only for car listing tabs */}
        {(activeTab === 'all' || activeTab === 'new' || activeTab === 'used') && (
          <div className="space-y-6 mb-8">
            
            {/* Search Input Panel */}
            <div className="relative max-w-2xl mx-auto bg-white p-3.5 rounded-2xl border-2 border-slate-900 shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] flex items-center gap-2">
              <div className="pl-3 text-slate-500">
                <Search className="w-5 h-5" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari Mobil...."
                className="w-full bg-transparent border-none text-slate-900 text-sm focus:outline-none placeholder:text-slate-450 font-black tracking-wide"
              />
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery('')}
                  className="px-3 py-1.5 text-xs font-black text-white bg-slate-900 border-2 border-slate-900 hover:bg-orange-600 rounded-xl transition-colors shadow-sm cursor-pointer"
                >
                  CLEAR
                </button>
              )}
            </div>

            {/* Brand Filter Chips Track */}
            <div className="flex flex-col space-y-2">
              <div className="flex overflow-x-auto gap-2 py-1 scrollbar-none">
                {brands.map((b) => (
                  <button
                    key={b}
                    onClick={() => setCurrentBrand(b)}
                    className={`px-4 py-2 rounded-xl text-xs font-black tracking-wide capitalize border-2 transition-all cursor-pointer whitespace-nowrap ${
                      currentBrand === b
                        ? 'bg-orange-600 border-slate-900 text-white shadow-[2px_2px_0px_0px_rgba(15,23,42,1)]'
                        : 'bg-white border-slate-900 text-slate-800 hover:bg-orange-55 hover:border-orange-600'
                    }`}
                  >
                    {b === 'all' ? 'Semua Merek' : b}
                  </button>
                ))}
              </div>
            </div>

          </div>
        )}

        {/* --------------------- TAB: CATALOG LIST --------------------- */}
        {(activeTab === 'all' || activeTab === 'new' || activeTab === 'used') && (
          <div className="space-y-6">
            
            {carsLoading ? (
              <div className="flex flex-col items-center justify-center py-20 space-y-4">
                <div className="w-12 h-12 border-4 border-amber-500 border-t-transparent rounded-full animate-spin" />
                <p className="text-sm text-slate-500 font-bold animate-pulse">Menghubungkan data pasar dari server...</p>
              </div>
            ) : filteredCarsList.length === 0 ? (
              <div className="bg-white border text-center py-20 px-8 rounded-3xl max-w-md mx-auto shadow-xs">
                <div className="text-4xl">🚗</div>
                <h3 className="font-bold text-slate-800 text-base mt-4">Mobil Tidak Ditemukan</h3>
                <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                  Kami tidak faham spesifikasi ini atau coba gunakan filter/kata pencarian lain.
                </p>
                <button 
                  onClick={() => { setSearchQuery(''); setCurrentBrand('all'); }}
                  className="mt-6 px-4 py-2 text-xs font-extrabold text-amber-700 bg-amber-50 border border-amber-200 rounded-xl hover:bg-amber-100 transition-all"
                >
                  Reset Pencarian
                </button>
              </div>
            ) : (
              <div>
                <div className="flex justify-between items-center mb-4">
                  <span className="text-xs text-slate-500 font-bold">
                    Menampilkan <b className="text-slate-800">{filteredCarsList.length}</b> mobil yang terdaftar
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
                  {filteredCarsList.map((car) => (
                    <CarCard
                      key={car.id}
                      car={car}
                      onClick={() => setSelectedCar(car)}
                    />
                  ))}
                </div>
              </div>
            )}

          </div>
        )}

        {/* --------------------- TAB: COMPARE --------------------- */}
        {activeTab === 'compare' && (
          <CompareView cars={cars} />
        )}

        {/* --------------------- TAB: PREDICT (ML & GEMINI) --------------------- */}
        {activeTab === 'predict' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Input Form Column */}
            <div className="lg:col-span-5 bg-white rounded-3xl border border-slate-200/80 p-6 shadow-sm space-y-6">
              
              <div>
                <h3 className="font-sans font-bold text-slate-800 text-lg flex items-center gap-1.5">
                  🔮 AI Price Predictor
                </h3>
                <p className="text-xs text-slate-500 font-medium leading-relaxed mt-1">
                  Masukkan parameter spesifikasi detail untuk menghitung nilai estimasi pasar Indonesia menggunakan model Machine Learning multivariat (Linear Regression & Random Forest) dan feedback Generative Gemini AI.
                </p>
              </div>

              <form onSubmit={handleCalculateEstimates} className="space-y-4">
                
                {/* Brand & Condition */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Merek Mobil</label>
                    <select
                      value={pBrand}
                      onChange={(e) => setPBrand(e.target.value)}
                      className="border border-slate-200 rounded-xl p-2.5 text-xs font-bold text-slate-750 focus:border-amber-500 bg-white"
                    >
                      {brands.filter(b => b !== 'all').map(brand => (
                        <option key={brand} value={brand}>{brand}</option>
                      ))}
                    </select>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Kondisi</label>
                    <select
                      value={pCondition}
                      onChange={(e) => {
                        const val = e.target.value as any;
                        setPCondition(val);
                        if (val === 'new') setPMileage(0);
                      }}
                      className="border border-slate-200 rounded-xl p-2.5 text-xs font-bold text-slate-755 focus:border-amber-500 bg-white"
                    >
                      <option value="new">Baru (New)</option>
                      <option value="used">Bekas (Used/Pre-Owned)</option>
                    </select>
                  </div>
                </div>

                {/* Year & Engine CC */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Tahun Pembuatan</label>
                    <input
                      type="number"
                      value={pYear}
                      onChange={(e) => setPYear(Number(e.target.value))}
                      min={2010}
                      max={2026}
                      className="border border-slate-200 rounded-xl p-2.5 text-xs font-bold text-slate-750 focus:border-amber-500 focus:outline-none"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Kapasitas Mesin CC</label>
                    <input
                      type="number"
                      value={pCc}
                      onChange={(e) => setPCc(Number(e.target.value))}
                      placeholder="Contoh: 1500 (Isi 0 untuk EV)"
                      className="border border-slate-200 rounded-xl p-2.5 text-xs font-bold text-slate-750 focus:border-amber-500 focus:outline-none"
                    />
                  </div>
                </div>

                {/* Power (hp) & Seats */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Tenaga Mesin (hp)</label>
                    <input
                      type="number"
                      value={pPower}
                      onChange={(e) => setPPower(Number(e.target.value))}
                      placeholder="Horsepower (hp)"
                      className="border border-slate-200 rounded-xl p-2.5 text-xs font-bold text-slate-750 focus:border-amber-500 focus:outline-none"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Tempat Duduk (Seat)</label>
                    <input
                      type="number"
                      value={pSeats}
                      onChange={(e) => setPSeats(Number(e.target.value))}
                      min={2}
                      max={9}
                      className="border border-slate-200 rounded-xl p-2.5 text-xs font-bold text-slate-750 focus:border-amber-500 focus:outline-none"
                    />
                  </div>
                </div>

                {/* Fuel & Mileage */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Bahan Bakar</label>
                    <select
                      value={pFuel}
                      onChange={(e) => setPFuel(e.target.value as any)}
                      className="border border-slate-200 rounded-xl p-2.5 text-xs font-bold text-slate-750 focus:border-amber-500 bg-white"
                    >
                      <option value="Bensin">Bensin</option>
                      <option value="Diesel">Diesel</option>
                      <option value="Hybrid">Hybrid</option>
                      <option value="Electric">Electric</option>
                    </select>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 opacity-60">Jarak Tempuh (km)</label>
                    <input
                      type="number"
                      value={pMileage}
                      onChange={(e) => setPMileage(Number(e.target.value))}
                      disabled={pCondition === 'new'}
                      placeholder="Isi 0 untuk Baru"
                      className={`border border-slate-200 rounded-xl p-2.5 text-xs font-bold focus:border-amber-500 focus:outline-none ${
                        pCondition === 'new' ? 'bg-slate-100 text-slate-400 cursor-not-allowed' : 'text-slate-750 bg-white'
                      }`}
                    />
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={predictLoading}
                    className={`w-full py-3.5 rounded-xl text-xs font-black uppercase tracking-widest text-white shadow-md transition-all flex items-center justify-center gap-2 ${
                      predictLoading
                        ? 'bg-amber-600/50 cursor-not-allowed'
                        : 'bg-gradient-to-r from-amber-600 via-orange-600 to-amber-700 hover:shadow-lg hover:-translate-y-0.5'
                    }`}
                  >
                    {predictLoading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Sedang Memprediksi...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4" />
                        Hitung Estimasi Harga
                      </>
                    )}
                  </button>
                </div>

              </form>

              {predictError && (
                <div className="p-3.5 bg-red-50 border border-red-200 text-red-800 rounded-xl flex items-center gap-2 text-xs">
                  <AlertTriangle className="w-4 h-4 text-red-500 shrink-0" />
                  <span>{predictError}</span>
                </div>
              )}

            </div>

            {/* Prediction Results Banner Column */}
            <div className="lg:col-span-7 space-y-5">
              
              {!predictionResult ? (
                <div className="border-2 border-dashed border-slate-200 rounded-3xl p-16 text-center text-slate-400 flex flex-col items-center justify-center min-h-[300px]">
                  <Activity className="w-12 h-12 text-slate-300 animate-pulse mb-3" />
                  <p className="text-xs font-bold text-slate-500">Menunggu Input Form Parameter</p>
                  <p className="text-[10px] text-slate-450 mt-1">Estimasi analisis kualitatif generatif dan kuantitatif ML model akan muncul di sini.</p>
                </div>
              ) : (
                <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-300">
                  
                  {/* Headline: Model Predictions Grid */}
                  <div className="bg-white rounded-3xl border border-slate-250 overflow-hidden shadow-sm">
                    <div className="bg-slate-900 text-white p-4 flex justify-between items-center">
                      <span className="text-[11px] font-extrabold uppercase tracking-widest text-slate-400">Prediksi Harga Mesin ML</span>
                      <span className="bg-amber-600 text-white text-[10px] font-bold px-2 py-0.5 rounded">Real-time</span>
                    </div>

                    <div className="divide-y divide-slate-100">
                      
                      {/* Linear Regression prediction Result */}
                      <div className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-3">
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="text-xs font-extrabold text-slate-800">📈 {predictionResult.lr.model}</span>
                            <span className="bg-blue-100 text-blue-800 text-[9px] font-black px-1.5 py-0.2 rounded">OLS</span>
                          </div>
                          <p className="text-[10px] text-slate-450 font-semibold uppercase tracking-wider mt-0.5">Kecepatan: {predictionResult.lr.execution_time_ms} ms</p>
                          <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">{predictionResult.lr.description}</p>
                        </div>
                        <div className="text-right shrink-0">
                          <span className="text-xs font-bold text-slate-400 block">Prediksi Estimasi</span>
                          <span className="text-xl font-black text-blue-600 block mt-0.5">{formatIDR(predictionResult.lr.predicted_price)}</span>
                        </div>
                      </div>

                      {/* Random Forest prediction Result */}
                      <div className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-3">
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="text-xs font-extrabold text-slate-800">🌲 {predictionResult.rf.model}</span>
                            <span className="bg-emerald-100 text-emerald-800 text-[9px] font-black px-1.5 py-0.2 rounded">ENSEMBLE</span>
                          </div>
                          <p className="text-[10px] text-slate-450 font-semibold uppercase tracking-wider mt-0.5">Kecepatan: {predictionResult.rf.execution_time_ms} ms · Std Deviasi: {formatIDR(predictionResult.rf.std_deviation || 0)}</p>
                          <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">{predictionResult.rf.description}</p>
                        </div>
                        <div className="text-right shrink-0">
                          <span className="text-xs font-bold text-slate-400 block">Prediksi Estimasi (Rekomendasi)</span>
                          <span className="text-xl font-black text-emerald-600 block mt-0.5">{formatIDR(predictionResult.rf.predicted_price)}</span>
                        </div>
                      </div>

                    </div>
                  </div>

                  {/* ----------------- GEMINI AUTOMOTIVE ADVISOR BAR ----------------- */}
                  {predictionResult.gemini && (
                    <div className="bg-amber-50/40 border border-amber-250 rounded-3xl p-6 shadow-xs relative overflow-hidden space-y-6">
                      
                      {/* background ambient decoration */}
                      <div className="absolute -top-12 -right-12 w-32 h-32 bg-amber-500/5 rounded-full blur-2xl pointer-events-none" />

                      {/* Title and Verdict badge */}
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-amber-200/60 pb-4">
                        <div className="flex items-center gap-2.5">
                          <div className="bg-amber-600 p-2 rounded-xl text-white">
                            <Sparkles className="w-5 h-5 animate-pulse" />
                          </div>
                          <div>
                            <h4 className="font-extrabold text-sm text-slate-800">Gemini Intelligent Expert Advisor</h4>
                            <p className="text-[10px] text-slate-450 font-semibold">Bahasa Indonesia Generative Analysis</p>
                          </div>
                        </div>

                        {/* Verdict decoration */}
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] text-slate-450 font-extrabold uppercase">Verdict Analis:</span>
                          <span className={`px-4 py-1.5 rounded-full text-xs font-black shadow-xs tracking-wider border ${
                            predictionResult.gemini.verdict === 'LAYAK_BELI' 
                              ? 'bg-emerald-100 text-emerald-800 border-emerald-300' 
                              : predictionResult.gemini.verdict === 'PERTIMBANGKAN'
                              ? 'bg-amber-100 text-amber-800 border-amber-300'
                              : 'bg-red-100 text-red-800 border-red-300'
                          }`}>
                            {predictionResult.gemini.verdict.replace('_', ' ')}
                          </span>
                        </div>
                      </div>

                      {/* Expert Opinion Text */}
                      <div className="space-y-4">
                        <p className="text-slate-700 text-xs leading-relaxed italic md:text-sm font-medium">
                          " {predictionResult.gemini.expert_text} "
                        </p>

                        {/* Rentang Nilai Adil Fair price */}
                        <div className="flex items-center justify-between p-4 bg-amber-50 border border-amber-200 rounded-2xl">
                          <div>
                            <span className="text-[10px] text-amber-700 font-extrabold uppercase tracking-wider block">Estimasi Rentang Harga Wajar</span>
                            <span className="text-base font-black text-slate-800 mt-1 block tracking-tight">
                              {predictionResult.gemini.estimated_fair_range}
                            </span>
                          </div>
                          
                          {/* Stars Rating */}
                          <div className="text-right">
                            <span className="text-[10px] text-amber-700 font-extrabold uppercase tracking-wider block">Keandalan & Fitur Keselamatan</span>
                            <div className="flex items-center gap-1 mt-1 justify-end">
                              {Array.from({ length: 5 }).map((_, i) => (
                                <span key={i} className={`text-sm ${
                                  i < Math.round(predictionResult.gemini?.safety_rating || 4) ? 'text-amber-500' : 'text-slate-300'
                                }`}>★</span>
                              ))}
                              <span className="text-xs font-bold text-slate-700 ml-1">
                                {predictionResult.gemini.safety_rating}/5
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Detail bullets cards */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          
                          <div className="bg-white/80 p-3 rounded-xl border border-amber-100 flex gap-2.5 items-start">
                            <Gauge className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                            <div>
                              <span className="block text-[10px] text-slate-400 font-bold uppercase">Evaluasi Konsumsi Bahan Bakar</span>
                              <span className="block text-xs font-semibold text-slate-750 mt-1 leading-normal">
                                {predictionResult.gemini.fuel_efficiency_note}
                              </span>
                            </div>
                          </div>

                          <div className="bg-white/80 p-3 rounded-xl border border-amber-100 flex gap-2.5 items-start">
                            <TrendingUp className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                            <div>
                              <span className="block text-[10px] text-slate-400 font-bold uppercase">Tren Pasar & Likuiditas</span>
                              <span className="block text-xs font-semibold text-slate-750 mt-1 leading-normal">
                                {predictionResult.gemini.market_trend}
                              </span>
                            </div>
                          </div>

                        </div>

                      </div>

                    </div>
                  )}

                </div>
              )}

            </div>

          </div>
        )}

      </main>

      {/* 4. Footer */}
      <footer className="bg-slate-900 text-white py-8 border-t border-slate-850 mt-12 select-none">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs">
          <div className="text-slate-400 text-center md:text-left">
            <div className="font-extrabold text-sm text-white">AutoData Indonesia</div>
            <p className="mt-1">© 2026 AutoData. Temukan, bandingkan, dan kalkulasikan secara objektif.</p>
          </div>
          <div className="flex gap-4 text-slate-400 font-medium">
            <span>Sisi Server: Node.js + Express</span>
            <span>·</span>
            <span>Generatif: Gemini 3.5 Flash SDK</span>
            <span>·</span>
            <span>Client: React + Vite + Tailwind 4</span>
          </div>
        </div>
      </footer>

      {/* 5. Modals Container */}
      {selectedCar && (
        <CarModal
          car={selectedCar}
          onClose={() => setSelectedCar(null)}
        />
      )}

    </div>
  );
}
