import React from 'react';
import { Car, getProxiedImageUrl } from '../types';
import { Settings, Users, Fuel, Sparkles, Tag, Gauge, Zap, Compass, Activity } from 'lucide-react';

interface CarCardProps {
  car: Car;
  onClick: () => void;
}

const FALLBACK_SVGS: Record<string, string> = {
  EV: `data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 240 130'><rect width='240' height='130' fill='%23f0fdf4'/><rect x='15' y='65' width='210' height='42' rx='8' fill='%2386efac'/><rect x='55' y='32' width='120' height='42' rx='10' fill='%234ade80'/><circle cx='62' cy='107' r='16' fill='%2315803d'/><circle cx='62' cy='107' r='8' fill='%2386efac'/><circle cx='178' cy='107' r='16' fill='%2315803d'/><circle cx='178' cy='107' r='8' fill='%2386efac'/><rect x='60' y='36' width='48' height='30' rx='4' fill='%23bbf7d0' opacity='.8'/><rect x='113' y='36' width='55' height='30' rx='4' fill='%23bbf7d0' opacity='.8'/><text x='120' y='85' font-family='sans-serif' font-size='10' fill='%2315803d' text-anchor='middle' font-weight='bold'>Electric Vehicle</text><path d='M108 58 L116 46 L120 54 L126 42 L134 58Z' fill='%2316a34a'/></svg>`,
  SUV: `data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 240 130'><rect width='240' height='130' fill='%23eff6ff'/><rect x='10' y='58' width='220' height='48' rx='6' fill='%2393c5fd'/><rect x='35' y='28' width='155' height='42' rx='8' fill='%233b82f6'/><circle cx='62' cy='106' r='17' fill='%231d4ed8'/><circle cx='62' cy='106' r='9' fill='%2393c5fd'/><circle cx='178' cy='106' r='17' fill='%231d4ed8'/><circle cx='178' cy='106' r='9' fill='%2393c5fd'/><rect x='40' y='32' width='52' height='30' rx='3' fill='%23bfdbfe' opacity='.8'/><rect x='97' y='32' width='85' height='30' rx='3' fill='%23bfdbfe' opacity='.8'/><text x='120' y='85' font-family='sans-serif' font-size='10' fill='%231e3a5f' text-anchor='middle' font-weight='bold'>SUV</text></svg>`,
  MPV: `data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 240 130'><rect width='240' height='130' fill='%23fffbeb'/><rect x='12' y='60' width='216' height='46' rx='6' fill='%23fcd34d'/><rect x='30' y='26' width='170' height='44' rx='8' fill='%23f59e0b'/><circle cx='62' cy='106' r='16' fill='%2392400e'/><circle cx='62' cy='106' r='8' fill='%23fcd34d'/><circle cx='178' cy='106' r='16' fill='%2392400e'/><circle cx='178' cy='106' r='8' fill='%23fcd34d'/><rect x='35' y='30' width='50' height='32' rx='3' fill='%23fef3c7' opacity='.9'/><rect x='90' y='30' width='50' height='32' rx='3' fill='%23fef3c7' opacity='.9'/><rect x='145' y='30' width='48' height='32' rx='3' fill='%23fef3c7' opacity='.9'/><text x='120' y='85' font-family='sans-serif' font-size='10' fill='%2392400e' text-anchor='middle' font-weight='bold'>MPV</text></svg>`,
  Sedan: `data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 240 130'><rect width='240' height='130' fill='%23fdf4ff'/><rect x='15' y='65' width='210' height='38' rx='6' fill='%23d8b4fe'/><rect x='52' y='34' width='126' height='38' rx='14' fill='%23a855f7'/><circle cx='62' cy='103' r='15' fill='%236b21a8'/><circle cx='62' cy='103' r='8' fill='%23d8b4fe'/><circle cx='178' cy='103' r='15' fill='%236b21a8'/><circle cx='178' cy='103' r='8' fill='%23d8b4fe'/><rect x='58' y='38' width='46' height='26' rx='6' fill='%23f3e8ff' opacity='.8'/><rect x='108' y='38' width='62' height='26' rx='6' fill='%23f3e8ff' opacity='.8'/><text x='120' y='85' font-family='sans-serif' font-size='10' fill='%236b21a8' text-anchor='middle' font-weight='bold'>Sedan</text></svg>`,
  Hatch: `data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 240 130'><rect width='240' height='130' fill='%23fff1f2'/><rect x='20' y='62' width='200' height='40' rx='6' fill='%23fda4af'/><rect x='48' y='30' width='132' height='40' rx='10' fill='%23f43f5e'/><circle cx='65' cy='102' r='15' fill='%239f1239'/><circle cx='65' cy='102' r='8' fill='%23fda4af'/><circle cx='175' cy='102' r='15' fill='%239f1239'/><circle cx='175' cy='102' r='8' fill='%23fda4af'/><rect x='53' y='34' width='52' height='28' rx='5' fill='%23ffe4e6' opacity='.9'/><rect x='110' y='34' width='64' height='28' rx='5' fill='%23ffe4e6' opacity='.9'/><text x='120' y='85' font-family='sans-serif' font-size='10' fill='%239f1239' text-anchor='middle' font-weight='bold'>Hatchback</text></svg>`,
};

const getFallback = (type: string) => FALLBACK_SVGS[type] || FALLBACK_SVGS['SUV'];

export const CarCard: React.FC<CarCardProps> = ({ car, onClick }) => {
  const displayPrice = car.condition === 'used' ? car.price_used : car.price_new;
  const conditionLabel = car.condition === 'used' ? 'Bekas' : 'Baru';

  const formatIDR = (num: number) => {
    return 'Rp ' + num.toLocaleString('id-ID');
  };

  const getBadgeStyles = (type: string) => {
    switch (type) {
      case 'EV':
        return 'bg-emerald-100 text-emerald-800 border-emerald-300';
      case 'SUV':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'MPV':
        return 'bg-amber-100 text-amber-800 border-amber-300';
      case 'Sedan':
        return 'bg-purple-100 text-purple-800 border-purple-300';
      default:
        return 'bg-slate-100 text-slate-800 border-slate-300';
    }
  };

  return (
    <div
      onClick={onClick}
      id={`car-card-${car.id}`}
      className="group bg-white rounded-2xl border-2 border-slate-900 overflow-hidden shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] hover:shadow-[6px_6px_0px_0px_rgba(234,88,12,1)] hover:-translate-y-0.5 transition-all duration-200 cursor-pointer"
    >
      <div className="relative w-full h-40 bg-slate-50 overflow-hidden flex items-center justify-center p-3 border-b-2 border-slate-900">
        <img
          src={getProxiedImageUrl(car.image)}
          alt={car.name}
          referrerPolicy="no-referrer"
          className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-300"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            if (!target.dataset.fallback) {
              target.dataset.fallback = 'true';
              target.src = getFallback(car.type);
            }
          }}
        />
        <div className="absolute top-2 left-2 flex flex-wrap gap-1 max-w-full">
          <span className={`px-2 py-0.5 text-[10px] font-black rounded-lg border uppercase tracking-wider shadow-sm ${getBadgeStyles(car.type)}`}>
            {car.type}
          </span>
          {car.fuel === 'Hybrid' && (
            <span className="px-2 py-0.5 text-[10px] font-black rounded-lg bg-teal-100 text-teal-850 border border-teal-300 shadow-sm flex items-center gap-0.5">
              <Sparkles className="w-3 h-3 text-teal-600" /> Hybrid
            </span>
          )}
        </div>
        <div className="absolute top-2 right-2">
          <span className={`px-2 py-0.5 text-[10px] font-black rounded-lg border shadow-sm ${
            car.condition === 'new'
              ? 'bg-orange-100 text-orange-800 border-orange-300'
              : 'bg-slate-100 text-slate-700 border-slate-300'
          }`}>
            {conditionLabel}
          </span>
        </div>
      </div>

      <div className="p-4 space-y-3">
        <div>
          <h3 className="font-black text-sm text-slate-900 leading-tight line-clamp-2">{car.name}</h3>
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mt-0.5">{car.brand}</p>
        </div>

        <div className="grid grid-cols-2 gap-x-3 gap-y-1.5">
          <div className="flex items-center gap-1.5 text-[11px] text-slate-600">
            <Settings className="w-3 h-3 text-slate-400 shrink-0" />
            <span className="truncate font-semibold">{car.transmission.split(' ').slice(0, 2).join(' ')}</span>
          </div>
          <div className="flex items-center gap-1.5 text-[11px] text-slate-600">
            <Users className="w-3 h-3 text-slate-400 shrink-0" />
            <span className="font-semibold">{car.seats} Kursi</span>
          </div>
          <div className="flex items-center gap-1.5 text-[11px] text-slate-600">
            <Fuel className="w-3 h-3 text-slate-400 shrink-0" />
            <span className="font-semibold">{car.fuel}</span>
          </div>
          <div className="flex items-center gap-1.5 text-[11px] text-slate-600">
            <Zap className="w-3 h-3 text-orange-400 shrink-0" />
            <span className="font-semibold">{car.power} HP</span>
          </div>
          {car.cc > 0 && (
            <div className="flex items-center gap-1.5 text-[11px] text-slate-600">
              <Activity className="w-3 h-3 text-slate-400 shrink-0" />
              <span className="font-semibold">{car.cc.toLocaleString('id-ID')} cc</span>
            </div>
          )}
          <div className="flex items-center gap-1.5 text-[11px] text-slate-600">
            <Compass className="w-3 h-3 text-slate-400 shrink-0" />
            <span className="font-semibold">{car.drive}</span>
          </div>
        </div>

        <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-1 text-[9px] font-black uppercase tracking-wider text-orange-600">
              <Tag className="w-2.5 h-2.5" />
              <span>HARGA {conditionLabel.toUpperCase()}</span>
            </div>
            <p className="text-base font-black text-slate-900 mt-0.5">{formatIDR(displayPrice)}</p>
          </div>
          <span className={`text-[10px] font-black px-3 py-1.5 rounded-xl border-2 border-slate-900 shadow-[2px_2px_0px_0px_rgba(15,23,42,1)] ${
            car.condition === 'new' ? 'bg-orange-500 text-white' : 'bg-slate-100 text-slate-800'
          }`}>
            {conditionLabel.toUpperCase()}
          </span>
        </div>
      </div>
    </div>
  );
};
