import React, { useState } from 'react';
import { Car, PredictionResult, getProxiedImageUrl } from '../types';
import { X, Cpu, CheckCircle2, AlertTriangle, HelpCircle, Activity } from 'lucide-react';

interface CarModalProps {
  car: Car;
  onClose: () => void;
}

export const CarModal: React.FC<CarModalProps> = ({ car, onClose }) => {
  const [activeSubTab, setActiveSubTab] = useState<'specs' | 'prediction'>('specs');
  const [predictions, setPredictions] = useState<{ lr: PredictionResult; rf: PredictionResult } | null>(null);
  const [loading, setLoading] = useState(false);

  const formatIDR = (num: number) => {
    return 'Rp ' + num.toLocaleString('id-ID');
  };

  const fetchMLPredictions = async () => {
    if (predictions) return; // cache locally
    setLoading(true);
    try {
      const response = await fetch('/api/predict', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          brand: car.brand,
          condition: car.condition,
          year: car.year,
          cc: car.cc,
          power: car.power,
          seats: car.seats,
          mileage: car.mileage,
          fuel: car.fuel
        })
      });
      const resData = await response.json();
      if (resData.status === 'success') {
        setPredictions({
          lr: resData.data.lr,
          rf: resData.data.rf
        });
      }
    } catch (err) {
      console.error("Gagal mengambil prediksi ML untuk mobil modal", err);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    if (activeSubTab === 'prediction') {
      fetchMLPredictions();
    }
  }, [activeSubTab]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
      <div 
        id="car-detail-modal"
        className="relative bg-white w-full max-w-2xl rounded-3xl overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200"
      >
        {/* Head Visual Area */}
        <div className="relative bg-gradient-to-r from-amber-600 via-orange-600 to-amber-700 text-white p-6">
          <div className="flex justify-between items-start pr-10">
            <div>
              <span className="text-xs uppercase font-extrabold tracking-widest text-amber-200 bg-amber-500/30 px-2.5 py-0.5 rounded-md">
                AUTO SPECIFICATIONS
              </span>
              <h2 className="text-xl md:text-2xl font-black mt-2 tracking-tight">{car.name}</h2>
              <p className="text-sm text-amber-100 font-medium mt-1">
                {car.brand} · {car.type} · Tahun {car.year}
              </p>
            </div>
            <button
              onClick={onClose}
              className="absolute top-6 right-6 bg-white/10 hover:bg-white/20 text-white p-2 rounded-full transition-colors duration-150"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Dynamic Image Canvas */}
        <div className="bg-slate-50 flex justify-center items-center p-6 h-56 border-b border-slate-100">
          <img
            src={getProxiedImageUrl(car.image)}
            alt={car.name}
            referrerPolicy="no-referrer"
            className="max-h-full max-w-full object-contain drop-shadow-md"
            onError={(e) => {
              (e.target as HTMLImageElement).src =
                "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&q=80&w=600";
            }}
          />
        </div>

        {/* Navigation Selector */}
        <div className="flex border-b border-slate-100 bg-slate-50/50">
          <button
            onClick={() => setActiveSubTab('specs')}
            className={`flex-1 py-3 text-sm font-bold border-b-2 text-center transition-colors ${
              activeSubTab === 'specs'
                ? 'border-amber-600 text-amber-700 bg-white'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            📋 Detail Spesifikasi
          </button>
          <button
            onClick={() => setActiveSubTab('prediction')}
            className={`flex-1 py-3 text-sm font-bold border-b-2 text-center transition-colors ${
              activeSubTab === 'prediction'
                ? 'border-amber-600 text-amber-700 bg-white'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            🔮 Prediksi Algoritma ML
          </button>
        </div>

        {/* Content Body Area */}
        <div className="p-6 max-h-[50vh] overflow-y-auto">
          {activeSubTab === 'specs' ? (
            <div className="space-y-6">
              {car.description && (
                <p className="text-sm text-slate-600 italic bg-amber-50/50 border border-amber-100 p-4 rounded-2xl">
                  📄 "{car.description}"
                </p>
              )}

              {/* Technical Specifications Grid */}
              <div>
                <h3 className="text-xs uppercase tracking-wider font-extrabold text-slate-400 mb-3">Mesin & Transmisi</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                    <span className="block text-[10px] text-slate-400 font-bold uppercase">Transmisi</span>
                    <span className="block text-sm font-extrabold text-slate-700 mt-0.5">{car.transmission}</span>
                  </div>
                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                    <span className="block text-[10px] text-slate-400 font-bold uppercase">Mesin CC</span>
                    <span className="block text-sm font-extrabold text-slate-700 mt-0.5">{car.cc > 0 ? `${car.cc} cc` : 'Murni Listrik'}</span>
                  </div>
                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                    <span className="block text-[10px] text-slate-400 font-bold uppercase">Tenaga (hp)</span>
                    <span className="block text-sm font-extrabold text-slate-700 mt-0.5">{car.power} hp</span>
                  </div>
                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                    <span className="block text-[10px] text-slate-400 font-bold uppercase">Torsi</span>
                    <span className="block text-sm font-extrabold text-slate-700 mt-0.5">{car.torque} Nm</span>
                  </div>
                </div>
              </div>

              {/* Layout & Dimensions Grid */}
              <div>
                <h3 className="text-xs uppercase tracking-wider font-extrabold text-slate-400 mb-3">Desain & Dimensi</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                    <span className="block text-[10px] text-slate-400 font-bold uppercase">Penggerak</span>
                    <span className="block text-sm font-extrabold text-slate-700 mt-0.5">{car.drive}</span>
                  </div>
                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                    <span className="block text-[10px] text-slate-400 font-bold uppercase">Tempat Duduk</span>
                    <span className="block text-sm font-extrabold text-slate-700 mt-0.5">{car.seats} Kursi</span>
                  </div>
                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                    <span className="block text-[10px] text-slate-400 font-bold uppercase">Bahan Bakar</span>
                    <span className="block text-sm font-extrabold text-slate-700 mt-0.5">{car.fuel}</span>
                  </div>
                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                    <span className="block text-[10px] text-slate-400 font-bold uppercase">Jarak Tempuh</span>
                    <span className="block text-sm font-extrabold text-slate-700 mt-0.5">{car.condition === 'new' ? 'Baru (0 km)' : `${car.mileage.toLocaleString()} km`}</span>
                  </div>
                </div>
              </div>

              {/* Price comparison layout */}
              <div className="bg-gradient-to-br from-slate-800 to-slate-900 text-white rounded-2xl p-5 shadow-inner">
                <h4 className="text-amber-400 font-bold text-xs uppercase tracking-widest mb-3 flex items-center gap-1.5">
                  💰 Informasi Pasar Penjualan Indonesia
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 divide-y md:divide-y-0 md:divide-x divide-slate-700">
                  <div>
                    <span className="text-[10px] text-slate-400 font-bold uppercase">Harga Dealer Baru</span>
                    <span className="block text-lg font-black text-white mt-1">{formatIDR(car.price_new)}</span>
                    <span className="block text-[10px] text-slate-400 mt-0.5">Sudah termasuk pajak OTR Jakarta (Estimasi)</span>
                  </div>
                  <div className="pt-3 md:pt-0 md:pl-4">
                    <span className="text-[10px] text-slate-400 font-bold uppercase">Pasaran Sekunder Bekas</span>
                    <span className="block text-lg font-black text-amber-300 mt-1">{formatIDR(car.price_used)}</span>
                    <span className="block text-[10px] text-slate-400 mt-0.5">Harga fluktuatif tergantung kondisi fisik kendaraan</span>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {loading ? (
                <div className="flex flex-col items-center justify-center py-10 space-y-3">
                  <Cpu className="w-10 h-10 text-amber-500 animate-spin" />
                  <p className="text-xs text-slate-500 font-bold animate-pulse">Menghitung model regresi di server...</p>
                </div>
              ) : predictions ? (
                <div className="space-y-4">
                  <div className="flex items-center gap-2 p-3 bg-blue-50 text-blue-800 rounded-xl border border-blue-100 text-xs font-semibold mb-2">
                    <Activity className="w-4 h-4 text-blue-600 shrink-0" />
                    <span>Prediksi ini dihasilkan secara realtime di server menggunakan basis data AutoData ML Model.</span>
                  </div>

                  {/* Linear Regression */}
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-150">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-extrabold text-slate-800 text-sm">📈 {predictions.lr.model}</h4>
                        <p className="text-[10px] text-slate-400 font-semibold uppercase mt-0.5">Metode: Ordinary Least Squares</p>
                      </div>
                      <span className="px-2.5 py-0.5 text-[10px] font-bold rounded-full bg-blue-100 text-blue-800">
                        {predictions.lr.confidence}% Confidence
                      </span>
                    </div>
                    <div className="mt-3 flex items-baseline gap-1.5">
                      <span className="text-xl font-black text-blue-600">{formatIDR(predictions.lr.predicted_price)}</span>
                      <span className="text-xs text-slate-400">OTR</span>
                    </div>
                    <p className="text-xs text-slate-500 mt-2 leading-relaxed">{predictions.lr.description}</p>
                    <div className="grid grid-cols-2 gap-3 mt-3 border-t border-dashed border-slate-200 pt-2 text-[10px] font-semibold text-slate-400">
                      <span>⚡ Kecepatan: <b className="text-slate-600">{predictions.lr.execution_time_ms} ms</b></span>
                      <span>⚙️ Kompleksitas: <b className="text-slate-600">O(n)</b></span>
                    </div>
                  </div>

                  {/* Random Forest */}
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-150">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-extrabold text-slate-800 text-sm">🌲 {predictions.rf.model}</h4>
                        <p className="text-[10px] text-slate-400 font-semibold uppercase mt-0.5">Ensemble: {predictions.rf.n_trees} Deciders</p>
                      </div>
                      <span className="px-2.5 py-0.5 text-[10px] font-bold rounded-full bg-emerald-100 text-emerald-800">
                        {predictions.rf.confidence}% Confidence
                      </span>
                    </div>
                    <div className="mt-3 flex items-baseline gap-1.5">
                      <span className="text-xl font-black text-emerald-600">{formatIDR(predictions.rf.predicted_price)}</span>
                      <span className="text-xs text-slate-400">OTR</span>
                    </div>
                    <p className="text-xs text-slate-500 mt-2 leading-relaxed">{predictions.rf.description}</p>
                    <div className="grid grid-cols-2 gap-3 mt-3 border-t border-dashed border-slate-200 pt-2 text-[10px] font-semibold text-slate-400">
                      <span>⏱ Kecepatan: <b className="text-slate-600">{predictions.rf.execution_time_ms} ms</b></span>
                      <span>🎯 Std Deviasi: <b className="text-slate-600">{formatIDR(predictions.rf.std_deviation || 0)}</b></span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-6 text-slate-400 text-xs">Gagal mengambil data prediksi ML.</div>
              )}
            </div>
          )}
        </div>

        {/* Foot Action Buttons */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-end gap-3 rounded-b-3xl">
          <button
            onClick={onClose}
            className="px-5 py-2.5 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors duration-150"
          >
            Tutup Windows
          </button>
        </div>
      </div>
    </div>
  );
};
