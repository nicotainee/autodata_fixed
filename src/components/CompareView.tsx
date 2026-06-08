import React, { useState } from 'react';
import { Car, getProxiedImageUrl } from '../types';
import { carsData } from '../carsData';
import { ArrowLeftRight, Check, CheckCircle2, ChevronRight, HelpCircle, Plus, Sparkles, X, Settings, Users, Fuel, Gauge, Zap, Activity, Compass } from 'lucide-react';

interface CompareViewProps {
  cars?: Car[];
}

export const CompareView: React.FC<CompareViewProps> = ({ cars }) => {
  const [slot1, setSlot1] = useState<Car | null>(null);
  const [slot2, setSlot2] = useState<Car | null>(null);
  const [selectingSlot, setSelectingSlot] = useState<1 | 2 | null>(null);
  const [resultsActive, setResultsActive] = useState(false);

  const carList = cars && cars.length > 0 ? cars : carsData;

  const formatIDR = (num: number) => {
    return 'Rp ' + num.toLocaleString('id-ID');
  };

  const handleSelectCar = (car: Car) => {
    if (selectingSlot === 1) {
      setSlot1(car);
    } else if (selectingSlot === 2) {
      setSlot2(car);
    }
    setSelectingSlot(null);
    setResultsActive(false); // reset existing comparison results
  };

  const clearSlot = (slotNum: 1 | 2) => {
    if (slotNum === 1) {
      setSlot1(null);
    } else {
      setSlot2(null);
    }
    setResultsActive(false);
  };

  // Compare helper to see if A wins over B
  const getWinnerClass = (valA: number, valB: number, preferHigher = true) => {
    if (!resultsActive) return '';
    if (valA === valB) return 'bg-amber-100 text-slate-800 font-extrabold border-slate-900';
    if (preferHigher) {
      return valA > valB 
        ? 'bg-emerald-100 text-emerald-900 font-black border-2 border-emerald-500 shadow-sm' 
        : 'text-slate-400 bg-slate-50/50';
    } else {
      return valA < valB 
        ? 'bg-emerald-100 text-emerald-900 font-black border-2 border-emerald-500 shadow-sm' 
        : 'text-slate-400 bg-slate-50/50';
    }
  };

  const getWinnerClassStr = (valA: string, valB: string) => {
    if (!resultsActive) return '';
    return valA === valB 
      ? 'bg-amber-50 text-slate-800' 
      : 'bg-white text-slate-700';
  };

  return (
    <div className="space-y-6">
      {/* Selector Panels Container */}
      <div className="bg-white rounded-3xl border-2 border-slate-900 p-6 shadow-[5px_5px_0px_0px_rgba(15,23,42,1)]">
        <h3 className="font-sans font-black text-slate-900 text-lg flex items-center gap-2 mb-2">
          <ArrowLeftRight className="w-5 h-5 text-orange-600" /> Komparasi Spesifikasi Mobil Objektif
        </h3>

        {/* Dual Slots */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Card Slot 1 */}
          <div className="relative">
            {slot1 ? (
              <div className="relative bg-orange-50/20 border-2 border-slate-900 rounded-2xl p-4 flex items-center gap-4 shadow-[3px_3px_0px_0px_rgba(15,23,42,1)]">
                <button
                  onClick={() => clearSlot(1)}
                  className="absolute top-3 right-3 bg-red-100 text-red-800 border-2 border-slate-950 hover:bg-red-200 p-1.5 rounded-xl transition-all select-none cursor-pointer shadow-sm"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
                <div className="w-20 h-20 bg-white rounded-xl overflow-hidden flex items-center justify-center p-1 border-2 border-slate-900">
                  <img
                    src={getProxiedImageUrl(slot1.image)}
                    alt={slot1.name}
                    referrerPolicy="no-referrer"
                    className="max-h-full max-w-full object-contain"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&q=80&w=400";
                    }}
                  />
                </div>
                <div>
                  <span className="text-[9px] uppercase font-black tracking-widest text-orange-600 bg-orange-100 border border-orange-300 px-2 py-0.5 rounded-md">
                    MOBIL PENANTANG 1
                  </span>
                  <h4 className="font-black text-sm text-slate-900 mt-1 line-clamp-1">{slot1.name}</h4>
                  <p className="text-[10px] text-slate-500 mt-0.5 uppercase tracking-wider font-extrabold">{slot1.brand}</p>
                  <p className="text-xs text-orange-600 font-black mt-1">{formatIDR(slot1.condition === 'used' ? slot1.price_used : slot1.price_new)} ({slot1.condition === 'used' ? 'Bekas' : 'Baru'})</p>
                </div>
              </div>
            ) : (
              <div
                onClick={() => setSelectingSlot(1)}
                className="group border-2 border-dashed border-slate-300 hover:border-orange-500 rounded-2xl p-6 flex flex-col items-center justify-center text-center cursor-pointer min-h-[110px] transition-all bg-slate-50/50 hover:bg-orange-50/10"
              >
                <div className="w-10 h-10 rounded-full bg-slate-200 group-hover:bg-orange-100 flex items-center justify-center text-slate-500 group-hover:text-orange-600 border border-slate-350 transition-colors">
                  <Plus className="w-5 h-5" />
                </div>
                <span className="text-xs font-black text-slate-800 mt-2.5">Pilih Mobil Pertama</span>
                <span className="text-[10px] text-slate-500 font-bold mt-0.5">Mendukung Mobil Baru & Mobil Bekas CSV</span>
              </div>
            )}
          </div>

          {/* Card Slot 2 */}
          <div className="relative">
            {slot2 ? (
              <div className="relative bg-orange-50/20 border-2 border-slate-900 rounded-2xl p-4 flex items-center gap-4 shadow-[3px_3px_0px_0px_rgba(15,23,42,1)]">
                <button
                  onClick={() => clearSlot(2)}
                  className="absolute top-3 right-3 bg-red-100 text-red-800 border-2 border-slate-950 hover:bg-red-200 p-1.5 rounded-xl transition-all select-none cursor-pointer shadow-sm"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
                <div className="w-20 h-20 bg-white rounded-xl overflow-hidden flex items-center justify-center p-1 border-2 border-slate-900">
                  <img
                    src={getProxiedImageUrl(slot2.image)}
                    alt={slot2.name}
                    referrerPolicy="no-referrer"
                    className="max-h-full max-w-full object-contain"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&q=80&w=400";
                    }}
                  />
                </div>
                <div>
                  <span className="text-[9px] uppercase font-black tracking-widest text-orange-600 bg-orange-100 border border-orange-300 px-2 py-0.5 rounded-md">
                    MOBIL PENANTANG 2
                  </span>
                  <h4 className="font-black text-sm text-slate-900 mt-1 line-clamp-1">{slot2.name}</h4>
                  <p className="text-[10px] text-slate-500 mt-0.5 uppercase tracking-wider font-extrabold">{slot2.brand}</p>
                  <p className="text-xs text-orange-600 font-black mt-1">{formatIDR(slot2.condition === 'used' ? slot2.price_used : slot2.price_new)} ({slot2.condition === 'used' ? 'Bekas' : 'Baru'})</p>
                </div>
              </div>
            ) : (
              <div
                onClick={() => setSelectingSlot(2)}
                className="group border-2 border-dashed border-slate-300 hover:border-orange-500 rounded-2xl p-6 flex flex-col items-center justify-center text-center cursor-pointer min-h-[110px] transition-all bg-slate-50/50 hover:bg-orange-50/10"
              >
                <div className="w-10 h-10 rounded-full bg-slate-200 group-hover:bg-orange-100 flex items-center justify-center text-slate-500 group-hover:text-orange-600 border border-slate-350 transition-colors">
                  <Plus className="w-5 h-5" />
                </div>
                <span className="text-xs font-black text-slate-800 mt-2.5">Pilih Mobil Kedua</span>
                <span className="text-[10px] text-slate-500 font-bold mt-0.5">Mendukung Mobil Baru & Mobil Bekas CSV</span>
              </div>
            )}
          </div>
        </div>

        {/* Action Button */}
        <div className="mt-6 flex justify-center">
          <button
            onClick={() => setResultsActive(true)}
            disabled={!slot1 || !slot2}
            className={`w-full md:w-auto px-10 py-3.5 rounded-2xl font-black flex items-center justify-center gap-2 text-sm transition-all border-2 cursor-pointer shadow-[3px_3px_0px_0px_rgba(15,23,42,1)] ${
              slot1 && slot2
                ? 'bg-orange-600 border-slate-900 text-white hover:bg-orange-700 hover:shadow-[4px_4px_0px_0px_rgba(15,23,42,1)]'
                : 'bg-slate-100 text-slate-400 border-slate-200 shadow-none cursor-not-allowed'
            }`}
          >
            📊 Mulai Bandingkan Spesifikasi Objektif
          </button>
        </div>
      </div>

      {/* Selector Modal Overlay */}
      {selectingSlot !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/65 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white w-full max-w-md rounded-3xl border-2 border-slate-900 shadow-[5px_5px_0px_0px_rgba(15,23,42,1)] overflow-hidden max-h-[80vh] flex flex-col animate-in fade-in zoom-in-95 duration-150">
            <div className="p-4 bg-slate-900 text-white flex justify-between items-center border-b-2 border-slate-900">
              <div>
                <h3 className="font-black text-sm">Pilih Mobil Database (Total: {carList.length})</h3>
                <p className="text-[10px] text-orange-200 font-extrabold uppercase tracking-wide mt-0.5">TERMASUK DARI DOKUMEN CSV</p>
              </div>
              <button
                onClick={() => setSelectingSlot(null)}
                className="bg-white/10 p-1.5 rounded-xl text-slate-300 hover:text-white border border-slate-700 select-none cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-3 space-y-2 bg-slate-50">
              {carList.map((car) => (
                <div
                  key={car.id}
                  onClick={() => handleSelectCar(car)}
                  className="flex items-center gap-3 p-2.5 rounded-xl border-2 border-slate-200 bg-white hover:border-orange-500 hover:shadow-[2px_2px_0px_0px_rgba(15,23,42,1)] cursor-pointer transition-all duration-150"
                >
                  <div className="w-14 h-12 bg-white flex items-center justify-center p-0.5 border border-slate-300 rounded-lg shrink-0 overflow-hidden">
                    <img
                      src={getProxiedImageUrl(car.image)}
                      alt={car.name}
                      referrerPolicy="no-referrer"
                      className="max-h-full max-w-full object-contain"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src =
                          "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&q=80&w=400";
                      }}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h5 className="font-black text-xs text-slate-900 truncate">{car.name}</h5>
                    <p className="text-[9px] text-slate-500 font-extrabold uppercase tracking-wider mt-0.5">
                      {car.brand} · {car.type}O
                    </p>
                    <p className="text-[10px] text-orange-650 font-black mt-0.5">{formatIDR(car.condition === 'used' ? car.price_used : car.price_new)}</p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400 shrink-0" />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Comparison results dynamic grid */}
      {resultsActive && slot1 && slot2 && (
        <div className="bg-white rounded-3xl border border-slate-100 overflow-hidden shadow-sm animate-in slide-in-from-bottom-4 duration-300">
          <div className="bg-gradient-to-r from-slate-800 to-slate-900 text-white p-4 grid grid-cols-3 text-center items-center">
            <span className="text-left font-bold text-[11px] text-slate-400 uppercase tracking-widest pl-2">Spesifikasi</span>
            <div className="text-center font-black text-xs px-2 truncate">
              {slot1.name}
            </div>
            <div className="text-center font-black text-xs px-2 truncate">
              {slot2.name}
            </div>
          </div>

          <div className="divide-y divide-slate-100">
            {/* Brand Row */}
            <div className="grid grid-cols-3 text-center">
              <div className="p-3 text-left bg-slate-50/50 text-[11px] font-bold text-slate-500 border-r flex items-center">Merek</div>
              <div className="p-3 text-xs font-bold text-slate-700">{slot1.brand}</div>
              <div className="p-3 text-xs font-bold text-slate-700">{slot2.brand}</div>
            </div>

            {/* Type Row */}
            <div className="grid grid-cols-3 text-center">
              <div className="p-3 text-left bg-slate-50/50 text-[11px] font-bold text-slate-500 border-r flex items-center">Tipe Sasis</div>
              <div className="p-3 text-xs font-semibold text-slate-700">{slot1.type}</div>
              <div className="p-3 text-xs font-semibold text-slate-700">{slot2.type}</div>
            </div>

            {/* Transmission Row */}
            <div className="grid grid-cols-3 text-center">
              <div className="p-3 text-left bg-slate-50/50 text-[11px] font-bold text-slate-500 border-r flex items-center">Transmisi</div>
              <div className="p-3 text-xs font-semibold text-slate-700">{slot1.transmission}</div>
              <div className="p-3 text-xs font-semibold text-slate-700">{slot2.transmission}</div>
            </div>

            {/* Seats Row */}
            <div className="grid grid-cols-3 text-center">
              <div className="p-3 text-left bg-slate-50/50 text-[11px] font-bold text-slate-500 border-r flex items-center">Kapasitas Tempat Duduk</div>
              <div className={`p-3 text-xs border-r ${getWinnerClass(slot1.seats, slot2.seats, true)}`}>
                {slot1.seats} Kursi
              </div>
              <div className={`p-3 text-xs ${getWinnerClass(slot2.seats, slot1.seats, true)}`}>
                {slot2.seats} Kursi
              </div>
            </div>

            {/* Engine CC Row */}
            <div className="grid grid-cols-3 text-center">
              <div className="p-3 text-left bg-slate-50/50 text-[11px] font-bold text-slate-500 border-r flex items-center">Engine CC</div>
              <div className={`p-3 text-xs border-r ${getWinnerClass(slot1.cc, slot2.cc, true)}`}>
                {slot1.cc > 0 ? `${slot1.cc} cc` : 'Murni Listrik (0 cc)'}
              </div>
              <div className={`p-3 text-xs ${getWinnerClass(slot2.cc, slot1.cc, true)}`}>
                {slot2.cc > 0 ? `${slot2.cc} cc` : 'Murni Listrik (0 cc)'}
              </div>
            </div>

            {/* Horsepower Row */}
            <div className="grid grid-cols-3 text-center">
              <div className="p-3 text-left bg-slate-50/50 text-[11px] font-bold text-slate-500 border-r flex items-center">Tenaga Maksimum (hp)</div>
              <div className={`p-3 text-xs border-r ${getWinnerClass(slot1.power, slot2.power, true)}`}>
                {slot1.power} hp
              </div>
              <div className={`p-3 text-xs ${getWinnerClass(slot2.power, slot1.power, true)}`}>
                {slot2.power} hp
              </div>
            </div>

            {/* Torque Row */}
            <div className="grid grid-cols-3 text-center">
              <div className="p-3 text-left bg-slate-50/50 text-[11px] font-bold text-slate-500 border-r flex items-center">Torsi Maksimum (Nm)</div>
              <div className={`p-3 text-xs border-r ${getWinnerClass(slot1.torque, slot2.torque, true)}`}>
                {slot1.torque} Nm
              </div>
              <div className={`p-3 text-xs ${getWinnerClass(slot2.torque, slot1.torque, true)}`}>
                {slot2.torque} Nm
              </div>
            </div>

            {/* Fuel Row */}
            <div className="grid grid-cols-3 text-center">
              <div className="p-3 text-left bg-slate-50/50 text-[11px] font-bold text-slate-500 border-r flex items-center">Teknologi Bahan Bakar</div>
              <div className="p-3 text-xs font-semibold text-slate-700">{slot1.fuel}</div>
              <div className="p-3 text-xs font-semibold text-slate-700">{slot2.fuel}</div>
            </div>

            {/* Drivetrain Row */}
            <div className="grid grid-cols-3 text-center">
              <div className="p-3 text-left bg-slate-50/50 text-[11px] font-bold text-slate-500 border-r flex items-center">Penggerak Roda (Drive)</div>
              <div className="p-3 text-xs font-semibold text-slate-700">{slot1.drive}</div>
              <div className="p-3 text-xs font-semibold text-slate-700">{slot2.drive}</div>
            </div>

            {/* New Price Row */}
            <div className="grid grid-cols-3 text-center">
              <div className="p-3 text-left bg-slate-50/50 text-[11px] font-bold text-slate-500 border-r flex items-center">Harga Jual Baru</div>
              <div className={`p-3 text-xs border-r ${getWinnerClass(slot1.price_new, slot2.price_new, false)}`}>
                {formatIDR(slot1.price_new)}
              </div>
              <div className={`p-3 text-xs ${getWinnerClass(slot2.price_new, slot1.price_new, false)}`}>
                {formatIDR(slot2.price_new)}
              </div>
            </div>

            {/* Used Price Row */}
            <div className="grid grid-cols-3 text-center">
              <div className="p-3 text-left bg-slate-50/50 text-[11px] font-bold text-slate-500 border-r flex items-center">Harga Jual Bekas</div>
              <div className={`p-3 text-xs border-r ${getWinnerClass(slot1.price_used, slot2.price_used, false)}`}>
                {formatIDR(slot1.price_used)}
              </div>
              <div className={`p-3 text-xs ${getWinnerClass(slot2.price_used, slot1.price_used, false)}`}>
                {formatIDR(slot2.price_used)}
              </div>
            </div>
          </div>

          {/* Winning Indicator Banner */}
          <div className="p-4 bg-amber-50 border-t border-slate-100 flex items-center gap-2.5">
            <Sparkles className="w-4 h-4 text-amber-600 animate-pulse shrink-0" />
            <span className="text-[11px] font-bold text-amber-800 leading-normal">
              Informasi: Baris berwarna hijau di atas mengindikasikan keunggulan spek (Tenaga HP & Torsi lebih melimpah, kapasitas tempat duduk lebih besar, atau harga OTR lebih terjangkau).
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
