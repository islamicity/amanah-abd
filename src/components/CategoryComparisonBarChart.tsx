import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import {
  BarChart3,
  TrendingUp,
  Clock,
  Radio,
  Layers,
  Sparkles,
  RefreshCw,
  Play,
  Pause,
  Filter,
  CheckCircle2,
  AlertTriangle,
  ArrowUpRight,
  Info,
} from 'lucide-react';
import { Complaint, ComplaintCategory } from '../types';

interface CategoryComparisonBarChartProps {
  complaints?: Complaint[];
  onSelectCategory?: (category: ComplaintCategory) => void;
}

// Category Color Palette & Definitions
export const CATEGORY_CONFIG: Record<
  ComplaintCategory,
  {
    color: string;
    lightColor: string;
    border: string;
    shortLabel: string;
    opdName: string;
  }
> = {
  'Infrastruktur Jalan': {
    color: '#10b981', // emerald-500
    lightColor: 'rgba(16, 185, 129, 0.15)',
    border: '#059669',
    shortLabel: 'Infrastruktur',
    opdName: 'Dinas Bina Marga & Sumber Daya Air',
  },
  'Bansos & Bantuan Sosial': {
    color: '#0ea5e9', // sky-500
    lightColor: 'rgba(14, 165, 233, 0.15)',
    border: '#0284c7',
    shortLabel: 'Bansos',
    opdName: 'Dinas Sosial & Penanggulangan Kemiskinan',
  },
  'Kesehatan & Puskesmas': {
    color: '#f59e0b', // amber-500
    lightColor: 'rgba(245, 158, 11, 0.15)',
    border: '#d97706',
    shortLabel: 'Kesehatan',
    opdName: 'Dinas Kesehatan & RSUD',
  },
  'Perizinan Usaha & UMKM': {
    color: '#a855f7', // purple-500
    lightColor: 'rgba(168, 85, 247, 0.15)',
    border: '#9333ea',
    shortLabel: 'Perizinan',
    opdName: 'DPMPTSP & Koperasi UMKM',
  },
  'Laporan Pungli & Integritas': {
    color: '#f43f5e', // rose-500
    lightColor: 'rgba(244, 63, 94, 0.15)',
    border: '#e11d48',
    shortLabel: 'Pungli',
    opdName: 'Inspektorat Kota & Satgas Saber Pungli',
  },
  'Administrasi Kependudukan': {
    color: '#14b8a6', // teal-500
    lightColor: 'rgba(20, 184, 166, 0.15)',
    border: '#0d9488',
    shortLabel: 'Adminduk',
    opdName: 'Dinas Kependudukan & Catatan Sipil',
  },
};

const ALL_CATEGORIES = Object.keys(CATEGORY_CONFIG) as ComplaintCategory[];

type TimeRangeMode = '7d' | '30d' | '6m' | 'today';
type ChartStyleMode = 'grouped' | 'stacked';

export const CategoryComparisonBarChart: React.FC<CategoryComparisonBarChartProps> = ({
  complaints = [],
  onSelectCategory,
}) => {
  const [timeRange, setTimeRange] = useState<TimeRangeMode>('7d');
  const [chartStyle, setChartStyle] = useState<ChartStyleMode>('grouped');
  const [activeCategories, setActiveCategories] = useState<ComplaintCategory[]>(ALL_CATEGORIES);
  const [isLiveStreaming, setIsLiveStreaming] = useState<boolean>(true);
  const [liveStreamTick, setLiveStreamTick] = useState<number>(0);
  const [lastLiveEvent, setLastLiveEvent] = useState<{
    category: ComplaintCategory;
    time: string;
    increment: number;
  } | null>(null);

  // Dynamic live increments added to the dataset for realistic real-time streaming demonstration
  const [dynamicIncrements, setDynamicIncrements] = useState<Record<string, number>>({});

  // Real-time streaming simulation interval
  useEffect(() => {
    if (!isLiveStreaming) return;

    const interval = setInterval(() => {
      // Pick a random category to receive a new citizen complaint event
      const randomCat = ALL_CATEGORIES[Math.floor(Math.random() * ALL_CATEGORIES.length)];
      const inc = 1;

      setDynamicIncrements((prev) => ({
        ...prev,
        [randomCat]: (prev[randomCat] || 0) + inc,
      }));

      const now = new Date();
      setLastLiveEvent({
        category: randomCat,
        time: now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
        increment: inc,
      });

      setLiveStreamTick((t) => t + 1);
    }, 4500);

    return () => clearInterval(interval);
  }, [isLiveStreaming]);

  // Toggle category in filter
  const toggleCategory = (cat: ComplaintCategory) => {
    setActiveCategories((prev) => {
      if (prev.includes(cat)) {
        if (prev.length === 1) return prev; // Keep at least one
        return prev.filter((c) => c !== cat);
      } else {
        return [...prev, cat];
      }
    });
  };

  const handleSelectAllCategories = () => {
    setActiveCategories(ALL_CATEGORIES);
  };

  // Base generator for multi-timeframe comparison
  const chartData = useMemo(() => {
    if (timeRange === '7d') {
      // 7 Hari Terakhir: Senin s/d Minggu
      const days = [
        { label: 'Senin', date: '02 Okt' },
        { label: 'Selasa', date: '03 Okt' },
        { label: 'Rabu', date: '04 Okt' },
        { label: 'Kamis', date: '05 Okt' },
        { label: 'Jumat', date: '06 Okt' },
        { label: 'Sabtu', date: '07 Okt' },
        { label: 'Hari Ini', date: '08 Okt' },
      ];

      return days.map((day, idx) => {
        const isCurrentDay = idx === days.length - 1;
        const entry: Record<string, any> = {
          period: day.label,
          subLabel: day.date,
          total: 0,
        };

        ALL_CATEGORIES.forEach((cat) => {
          // Base realistic counts
          let baseVal = 0;
          if (cat === 'Infrastruktur Jalan') baseVal = 14 + idx * 3;
          else if (cat === 'Bansos & Bantuan Sosial') baseVal = 9 + ((idx * 4) % 7);
          else if (cat === 'Kesehatan & Puskesmas') baseVal = 6 + (idx % 4);
          else if (cat === 'Perizinan Usaha & UMKM') baseVal = 8 + (idx % 3);
          else if (cat === 'Laporan Pungli & Integritas') baseVal = 3 + ((idx * 2) % 3);
          else if (cat === 'Administrasi Kependudukan') baseVal = 11 + idx * 2;

          // Add real-time dynamic increment to today's count
          const liveBonus = isCurrentDay ? dynamicIncrements[cat] || 0 : 0;
          const finalVal = baseVal + liveBonus;

          entry[cat] = finalVal;
          entry.total += finalVal;
        });

        return entry;
      });
    }

    if (timeRange === '30d') {
      // 4 Minggu Terakhir
      const weeks = [
        { label: 'Minggu I', subLabel: '11 - 17 Sep' },
        { label: 'Minggu II', subLabel: '18 - 24 Sep' },
        { label: 'Minggu III', subLabel: '25 Sep - 01 Okt' },
        { label: 'Minggu Ini (IV)', subLabel: '02 - 08 Okt' },
      ];

      return weeks.map((w, idx) => {
        const isCurrentWeek = idx === weeks.length - 1;
        const entry: Record<string, any> = {
          period: w.label,
          subLabel: w.subLabel,
          total: 0,
        };

        ALL_CATEGORIES.forEach((cat) => {
          let baseVal = 0;
          if (cat === 'Infrastruktur Jalan') baseVal = 85 + idx * 12;
          else if (cat === 'Bansos & Bantuan Sosial') baseVal = 64 + idx * 8;
          else if (cat === 'Kesehatan & Puskesmas') baseVal = 42 + idx * 5;
          else if (cat === 'Perizinan Usaha & UMKM') baseVal = 51 + idx * 7;
          else if (cat === 'Laporan Pungli & Integritas') baseVal = 18 - idx * 2; // menurun berkat sistem anti-pungli
          else if (cat === 'Administrasi Kependudukan') baseVal = 70 + idx * 9;

          const liveBonus = isCurrentWeek ? (dynamicIncrements[cat] || 0) * 3 : 0;
          const finalVal = baseVal + liveBonus;

          entry[cat] = finalVal;
          entry.total += finalVal;
        });

        return entry;
      });
    }

    if (timeRange === '6m') {
      // 6 Bulan Terakhir
      const months = [
        { label: 'Mei', subLabel: '2026' },
        { label: 'Jun', subLabel: '2026' },
        { label: 'Jul', subLabel: '2026' },
        { label: 'Agu', subLabel: '2026' },
        { label: 'Sep', subLabel: '2026' },
        { label: 'Okt', subLabel: 'Berjalan' },
      ];

      return months.map((m, idx) => {
        const isCurrentMonth = idx === months.length - 1;
        const entry: Record<string, any> = {
          period: m.label,
          subLabel: m.subLabel,
          total: 0,
        };

        ALL_CATEGORIES.forEach((cat) => {
          let baseVal = 0;
          if (cat === 'Infrastruktur Jalan') baseVal = 320 + idx * 45;
          else if (cat === 'Bansos & Bantuan Sosial') baseVal = 210 + idx * 25;
          else if (cat === 'Kesehatan & Puskesmas') baseVal = 160 + idx * 18;
          else if (cat === 'Perizinan Usaha & UMKM') baseVal = 195 + idx * 22;
          else if (cat === 'Laporan Pungli & Integritas') baseVal = 85 - idx * 10;
          else if (cat === 'Administrasi Kependudukan') baseVal = 280 + idx * 30;

          const liveBonus = isCurrentMonth ? (dynamicIncrements[cat] || 0) * 8 : 0;
          const finalVal = baseVal + liveBonus;

          entry[cat] = finalVal;
          entry.total += finalVal;
        });

        return entry;
      });
    }

    // Default: 'today' (Per 3 Jam Real-time Stream)
    const hours = [
      { label: '06:00', subLabel: 'Pagi' },
      { label: '09:00', subLabel: 'Pagi' },
      { label: '12:00', subLabel: 'Siang' },
      { label: '15:00', subLabel: 'Sore' },
      { label: '18:00', subLabel: 'Petang' },
      { label: 'Sekarang', subLabel: 'Live Feed' },
    ];

    return hours.map((h, idx) => {
      const isLiveNow = idx === hours.length - 1;
      const entry: Record<string, any> = {
        period: h.label,
        subLabel: h.subLabel,
        total: 0,
      };

      ALL_CATEGORIES.forEach((cat) => {
        let baseVal = 0;
        if (cat === 'Infrastruktur Jalan') baseVal = 4 + idx * 2;
        else if (cat === 'Bansos & Bantuan Sosial') baseVal = 2 + (idx % 3);
        else if (cat === 'Kesehatan & Puskesmas') baseVal = 1 + (idx % 2);
        else if (cat === 'Perizinan Usaha & UMKM') baseVal = 2 + (idx % 2);
        else if (cat === 'Laporan Pungli & Integritas') baseVal = idx === 2 ? 1 : 0;
        else if (cat === 'Administrasi Kependudukan') baseVal = 3 + idx * 1;

        const liveBonus = isLiveNow ? dynamicIncrements[cat] || 0 : 0;
        const finalVal = baseVal + liveBonus;

        entry[cat] = finalVal;
        entry.total += finalVal;
      });

      return entry;
    });
  }, [timeRange, dynamicIncrements]);

  // Aggregate Category Totals for Top Ranking & Statistics
  const categoryStats = useMemo(() => {
    const totals: Record<ComplaintCategory, number> = {
      'Infrastruktur Jalan': 0,
      'Bansos & Bantuan Sosial': 0,
      'Kesehatan & Puskesmas': 0,
      'Perizinan Usaha & UMKM': 0,
      'Laporan Pungli & Integritas': 0,
      'Administrasi Kependudukan': 0,
    };

    chartData.forEach((row) => {
      ALL_CATEGORIES.forEach((cat) => {
        totals[cat] += row[cat] || 0;
      });
    });

    const totalSum = Object.values(totals).reduce((a, b) => a + b, 0);

    const sorted = ALL_CATEGORIES.map((cat) => ({
      category: cat,
      count: totals[cat],
      share: totalSum > 0 ? ((totals[cat] / totalSum) * 100).toFixed(1) : '0.0',
      config: CATEGORY_CONFIG[cat],
    })).sort((a, b) => b.count - a.count);

    return {
      totals,
      totalSum,
      sorted,
      dominant: sorted[0],
      runnerUp: sorted[1],
    };
  }, [chartData]);

  // Reset live streaming data
  const handleResetStreaming = () => {
    setDynamicIncrements({});
    setLastLiveEvent(null);
  };

  // Custom Rich Tooltip for Recharts
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (!active || !payload || !payload.length) return null;

    const rowData = payload[0]?.payload;
    const periodLabel = `${label} (${rowData?.subLabel || ''})`;
    const totalInPeriod = rowData?.total || 0;

    return (
      <div className="bg-slate-900/95 border border-slate-700/80 rounded-xl p-3.5 shadow-2xl backdrop-blur-md text-xs space-y-2 min-w-[240px]">
        <div className="flex items-center justify-between border-b border-slate-800 pb-1.5">
          <div>
            <span className="font-bold text-white text-xs block">{periodLabel}</span>
            <span className="text-[10px] text-slate-400">Total Periode: {totalInPeriod} Aduan</span>
          </div>
          <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800">
            Real-Time
          </span>
        </div>

        <div className="space-y-1.5 max-h-52 overflow-y-auto pr-1">
          {payload.map((item: any) => {
            const catName = item.dataKey as ComplaintCategory;
            const cfg = CATEGORY_CONFIG[catName];
            if (!cfg) return null;
            const val = item.value || 0;
            const pct = totalInPeriod > 0 ? Math.round((val / totalInPeriod) * 100) : 0;

            return (
              <div key={catName} className="flex items-center justify-between gap-3 text-[11px]">
                <div className="flex items-center gap-1.5 truncate">
                  <span
                    className="w-2.5 h-2.5 rounded-full shrink-0"
                    style={{ backgroundColor: cfg.color }}
                  />
                  <span className="text-slate-300 truncate">{cfg.shortLabel}:</span>
                </div>
                <div className="flex items-center gap-2 font-mono shrink-0">
                  <span className="font-bold text-white">{val}</span>
                  <span className="text-slate-500 text-[10px]">({pct}%)</span>
                </div>
              </div>
            );
          })}
        </div>

        <div className="pt-1.5 border-t border-slate-800/80 text-[10px] text-slate-400 flex items-center justify-between">
          <span>Kepatuhan SLA: 98.4%</span>
          <span className="text-emerald-400 font-semibold">Tersinkron On-Chain</span>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-md space-y-5">
      {/* Header with Title and Real-Time Controls */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              <BarChart3 className="w-3.5 h-3.5 text-emerald-400" />
              <span>GRAFIK BATANG INTERAKTIF</span>
            </span>
            <div className="flex items-center gap-1.5 text-[11px] text-slate-400 font-mono">
              <span className="relative flex h-2 w-2">
                {isLiveStreaming && (
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                )}
                <span
                  className={`relative inline-flex rounded-full h-2 w-2 ${
                    isLiveStreaming ? 'bg-emerald-500' : 'bg-slate-500'
                  }`}
                />
              </span>
              <span>{isLiveStreaming ? 'Live Streaming Aktif' : 'Streaming Dijeda'}</span>
            </div>
          </div>

          <h3 className="text-base sm:text-lg font-bold text-white tracking-tight">
            Perbandingan Kategori Aduan dari Waktu ke Waktu (Real-Time)
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Analisis fluktuasi jenis keluhan warga untuk prioritas alokasi Tim Reaksi Cepat (TRC) dan pengawasan SLA.
          </p>
        </div>

        {/* Action Controls Group */}
        <div className="flex items-center gap-2 flex-wrap self-start lg:self-auto">
          {/* Time Range Selector */}
          <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
            <button
              onClick={() => setTimeRange('today')}
              className={`px-2.5 py-1 rounded-lg font-semibold transition-all cursor-pointer ${
                timeRange === 'today'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
              title="Hari Ini (Live Interval 3 Jam)"
            >
              Hari Ini
            </button>
            <button
              onClick={() => setTimeRange('7d')}
              className={`px-2.5 py-1 rounded-lg font-semibold transition-all cursor-pointer ${
                timeRange === '7d'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
              title="7 Hari Terakhir"
            >
              7 Hari
            </button>
            <button
              onClick={() => setTimeRange('30d')}
              className={`px-2.5 py-1 rounded-lg font-semibold transition-all cursor-pointer ${
                timeRange === '30d'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
              title="30 Hari Terakhir (Mingguan)"
            >
              30 Hari
            </button>
            <button
              onClick={() => setTimeRange('6m')}
              className={`px-2.5 py-1 rounded-lg font-semibold transition-all cursor-pointer ${
                timeRange === '6m'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
              title="6 Bulan Terakhir"
            >
              6 Bulan
            </button>
          </div>

          {/* Grouped vs Stacked Style */}
          <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
            <button
              onClick={() => setChartStyle('grouped')}
              className={`px-2.5 py-1 rounded-lg font-semibold transition-all cursor-pointer flex items-center gap-1 ${
                chartStyle === 'grouped'
                  ? 'bg-slate-800 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
              title="Grafik Batang Berdampingan (Grouped Bar)"
            >
              <BarChart3 className="w-3.5 h-3.5" />
              <span>Kelompok</span>
            </button>
            <button
              onClick={() => setChartStyle('stacked')}
              className={`px-2.5 py-1 rounded-lg font-semibold transition-all cursor-pointer flex items-center gap-1 ${
                chartStyle === 'stacked'
                  ? 'bg-slate-800 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
              title="Grafik Batang Bertumpuk (Stacked Bar)"
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Tumpuk</span>
            </button>
          </div>

          {/* Real-time Streaming Simulation Toggle */}
          <button
            onClick={() => setIsLiveStreaming(!isLiveStreaming)}
            className={`p-2 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
              isLiveStreaming
                ? 'bg-emerald-950/70 border-emerald-500/40 text-emerald-300 hover:bg-emerald-900/60'
                : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-white'
            }`}
            title={isLiveStreaming ? 'Jeda Simulasi Aliran Real-time' : 'Nyalakan Simulasi Aliran Real-time'}
            id="btn-toggle-live-chart"
          >
            {isLiveStreaming ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            <span className="hidden sm:inline">{isLiveStreaming ? 'Jeda' : 'Live'}</span>
          </button>

          {/* Reset Increments Button */}
          {Object.keys(dynamicIncrements).length > 0 && (
            <button
              onClick={handleResetStreaming}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white border border-slate-700 transition-colors cursor-pointer"
              title="Reset tambahan simulasi real-time"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Live Stream Ticker Banner (if new event arrived) */}
      {lastLiveEvent && (
        <div className="bg-emerald-950/50 border border-emerald-500/30 rounded-xl px-3.5 py-2 flex items-center justify-between text-xs text-emerald-200 animate-in fade-in duration-300">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
            </span>
            <span className="font-semibold text-white">Event Real-Time Baru:</span>
            <span>
              +{lastLiveEvent.increment} aduan masuk pada kategori{' '}
              <strong className="text-emerald-300">{lastLiveEvent.category}</strong>
            </span>
          </div>
          <span className="font-mono text-[11px] text-emerald-400/80">{lastLiveEvent.time} WIB</span>
        </div>
      )}

      {/* 3 Executive Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
              Total Aduan Periode Ini
            </span>
            <span className="text-xl font-bold font-mono text-white mt-0.5 block">
              {categoryStats.totalSum}{' '}
              <span className="text-xs font-normal text-slate-400">Laporan</span>
            </span>
          </div>
          <div className="w-9 h-9 rounded-xl bg-slate-800/80 text-emerald-400 border border-slate-700 flex items-center justify-center">
            <TrendingUp className="w-5 h-5" />
          </div>
        </div>

        <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
              Kategori Terbanyak (Dominan)
            </span>
            <span className="text-base font-bold text-emerald-300 mt-0.5 truncate block max-w-[170px]">
              {categoryStats.dominant?.config.shortLabel}
            </span>
            <span className="text-[10px] text-slate-400">
              {categoryStats.dominant?.count} aduan ({categoryStats.dominant?.share}%)
            </span>
          </div>
          <div
            className="w-9 h-9 rounded-xl border flex items-center justify-center text-white font-bold text-xs"
            style={{
              backgroundColor: categoryStats.dominant?.config.lightColor,
              borderColor: categoryStats.dominant?.config.border,
            }}
          >
            #1
          </div>
        </div>

        <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
              Pungli Terkendali (Anti-Risywah)
            </span>
            <span className="text-base font-bold text-rose-300 mt-0.5 block">
              {categoryStats.totals['Laporan Pungli & Integritas']}{' '}
              <span className="text-xs font-normal text-slate-400">Kasus</span>
            </span>
            <span className="text-[10px] text-emerald-400 flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" />
              100% Ditindak Inspektorat
            </span>
          </div>
          <div className="w-9 h-9 rounded-xl bg-rose-950/30 text-rose-400 border border-rose-800/50 flex items-center justify-center">
            <Sparkles className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Interactive Category Filter Pills */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs">
          <span className="text-[11px] font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
            <Filter className="w-3.5 h-3.5 text-emerald-400" />
            <span>Pilih Kategori untuk Ditampilkan ({activeCategories.length}/{ALL_CATEGORIES.length}):</span>
          </span>
          {activeCategories.length < ALL_CATEGORIES.length && (
            <button
              onClick={handleSelectAllCategories}
              className="text-[11px] text-emerald-400 hover:text-emerald-300 font-semibold cursor-pointer"
            >
              Tampilkan Semua
            </button>
          )}
        </div>

        <div className="flex flex-wrap gap-2">
          {ALL_CATEGORIES.map((cat) => {
            const isSelected = activeCategories.includes(cat);
            const cfg = CATEGORY_CONFIG[cat];
            const count = categoryStats.totals[cat];

            return (
              <button
                key={cat}
                onClick={() => toggleCategory(cat)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all flex items-center gap-2 cursor-pointer ${
                  isSelected
                    ? 'text-white shadow-sm'
                    : 'bg-slate-950/60 text-slate-500 border-slate-800/80 hover:border-slate-700'
                }`}
                style={{
                  backgroundColor: isSelected ? cfg.lightColor : undefined,
                  borderColor: isSelected ? cfg.border : undefined,
                }}
              >
                <span
                  className="w-2.5 h-2.5 rounded-full"
                  style={{ backgroundColor: cfg.color }}
                />
                <span>{cfg.shortLabel}</span>
                <span
                  className={`text-[10px] font-mono px-1.5 py-0.2 rounded ${
                    isSelected ? 'bg-slate-900/80 text-white' : 'text-slate-600'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Recharts Responsive Container */}
      <div className="h-72 sm:h-80 w-full pt-2">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            margin={{ top: 10, right: 10, left: -15, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.5} />
            <XAxis
              dataKey="period"
              stroke="#94a3b8"
              fontSize={11}
              tickLine={false}
              axisLine={{ stroke: '#475569' }}
            />
            <YAxis
              stroke="#94a3b8"
              fontSize={11}
              tickLine={false}
              axisLine={{ stroke: '#475569' }}
              allowDecimals={false}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend
              wrapperStyle={{ paddingTop: '10px', fontSize: '11px' }}
              formatter={(value) => {
                const cfg = CATEGORY_CONFIG[value as ComplaintCategory];
                return <span className="text-slate-300 font-medium">{cfg ? cfg.shortLabel : value}</span>;
              }}
            />

            {ALL_CATEGORIES.map((cat) => {
              if (!activeCategories.includes(cat)) return null;
              const cfg = CATEGORY_CONFIG[cat];

              return (
                <Bar
                  key={cat}
                  dataKey={cat}
                  name={cat}
                  fill={cfg.color}
                  stackId={chartStyle === 'stacked' ? 'a' : undefined}
                  radius={chartStyle === 'stacked' ? [0, 0, 0, 0] : [4, 4, 0, 0]}
                  isAnimationActive={true}
                  animationDuration={800}
                />
              );
            })}
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Category Performance Breakdown Summary */}
      <div className="pt-3 border-t border-slate-800 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 text-xs">
        {categoryStats.sorted.map((item) => (
          <div
            key={item.category}
            onClick={() => onSelectCategory && onSelectCategory(item.category)}
            className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/80 hover:border-slate-700 transition-all cursor-pointer group"
          >
            <div className="flex items-center gap-1.5 mb-1">
              <span
                className="w-2 h-2 rounded-full shrink-0"
                style={{ backgroundColor: item.config.color }}
              />
              <span className="font-bold text-white text-[11px] truncate group-hover:text-emerald-300 transition-colors">
                {item.config.shortLabel}
              </span>
            </div>
            <div className="flex items-baseline justify-between font-mono">
              <span className="font-bold text-white text-sm">{item.count}</span>
              <span className="text-[10px] text-slate-400">{item.share}%</span>
            </div>
            <p className="text-[9px] text-slate-500 truncate mt-1">{item.config.opdName}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CategoryComparisonBarChart;
