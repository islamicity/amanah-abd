import React, { useState, useMemo } from 'react';
import {
  Trophy,
  Medal,
  Award,
  Zap,
  Clock,
  ShieldCheck,
  Star,
  TrendingUp,
  ArrowUpRight,
  Filter,
  CheckCircle2,
  Sparkles,
  Flame,
  ChevronRight,
} from 'lucide-react';
import { DepartmentMetric } from '../types';

interface LeaderboardInstansiTerbaikProps {
  metrics: DepartmentMetric[];
  onSelectDepartment?: (departmentName: string) => void;
}

type SortCriteria = 'composite' | 'speed' | 'audit' | 'satisfaction';

export const LeaderboardInstansiTerbaik: React.FC<LeaderboardInstansiTerbaikProps> = ({
  metrics,
  onSelectDepartment,
}) => {
  const [sortCriteria, setSortCriteria] = useState<SortCriteria>('composite');

  // Compute ranking scores for each department
  const rankedDepartments = useMemo(() => {
    // Determine min/max for normalization
    const minHours = Math.min(...metrics.map((m) => m.avgResolutionHours));
    const maxHours = Math.max(...metrics.map((m) => m.avgResolutionHours));

    const scored = metrics.map((dept) => {
      const onTimeRate = (dept.resolvedOnTime / dept.totalHandled) * 100;

      // Speed Score (0-100): lower avgResolutionHours -> higher score
      const speedScore =
        maxHours === minHours
          ? 100
          : 100 - ((dept.avgResolutionHours - minHours) / (maxHours - minHours)) * 50;

      // Audit & Integrity Score (0-100)
      const auditScore = dept.integrityIndex;

      // Satisfaction normalized to 100 (score / 5.0 * 100)
      const satScore = (dept.satisfactionScore / 5.0) * 100;

      // Composite Score: 40% Speed & On-Time, 35% Audit & Integrity, 25% Warga Satisfaction
      const compositeScore =
        speedScore * 0.2 + onTimeRate * 0.2 + auditScore * 0.35 + satScore * 0.25;

      return {
        ...dept,
        onTimeRate,
        speedScore: Math.round(speedScore),
        auditScore,
        satScore,
        compositeScore: Number(compositeScore.toFixed(1)),
      };
    });

    // Sort based on active criteria
    return scored.sort((a, b) => {
      if (sortCriteria === 'speed') {
        return a.avgResolutionHours - b.avgResolutionHours; // Ascending hours = faster
      }
      if (sortCriteria === 'audit') {
        return b.auditScore - a.auditScore;
      }
      if (sortCriteria === 'satisfaction') {
        return b.satisfactionScore - a.satisfactionScore;
      }
      return b.compositeScore - a.compositeScore;
    });
  }, [metrics, sortCriteria]);

  const podium = rankedDepartments.slice(0, 3);
  const remainingList = rankedDepartments.slice(3);

  return (
    <div
      className="bg-slate-900 border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-sm space-y-6"
      id="leaderboard-instansi-terbaik"
    >
      {/* Header with Title and Fastabiqul Khairat Badge */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/15 text-amber-300 border border-amber-500/30 mb-2">
            <Trophy className="w-3.5 h-3.5 text-amber-400" />
            <span>Fastabiqul Khairat: Berlomba-lomba dalam Kebaikan Pelayanan</span>
          </div>
          <h3 className="text-lg sm:text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <span>Leaderboard Instansi Terbaik (OPD Berprestasi)</span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-normal">
              Berdasarkan Kecepatan &amp; Skor Audit
            </span>
          </h3>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl">
            Peringkat berkala Organisasi Perangkat Daerah yang dihitung transparan dari kecepatan penyelesaian laporan, kepatuhan batas waktu SLA, audit integritas tanpa suap, dan indeks kepuasan warga.
          </p>
        </div>

        {/* Sort Filter Tabs */}
        <div className="flex items-center gap-1.5 bg-slate-950 p-1.5 rounded-xl border border-slate-800 self-start lg:self-center overflow-x-auto max-w-full">
          <button
            onClick={() => setSortCriteria('composite')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
              sortCriteria === 'composite'
                ? 'bg-amber-500 text-slate-950 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Skor Komposit</span>
          </button>

          <button
            onClick={() => setSortCriteria('speed')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
              sortCriteria === 'speed'
                ? 'bg-emerald-500 text-slate-950 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>Paling Cepat</span>
          </button>

          <button
            onClick={() => setSortCriteria('audit')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
              sortCriteria === 'audit'
                ? 'bg-indigo-500 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Audit &amp; Integritas</span>
          </button>

          <button
            onClick={() => setSortCriteria('satisfaction')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
              sortCriteria === 'satisfaction'
                ? 'bg-amber-400 text-slate-950 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Star className="w-3.5 h-3.5" />
            <span>Kepuasan Warga</span>
          </button>
        </div>
      </div>

      {/* TOP 3 PODIUM DISPLAY */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
        {/* RANK 2 - PERAK (Left on desktop) */}
        {podium[1] && (
          <div
            onClick={() => onSelectDepartment?.(podium[1].name)}
            className="order-2 md:order-1 bg-gradient-to-b from-slate-800/90 to-slate-900 border border-slate-700/80 rounded-2xl p-5 flex flex-col justify-between relative overflow-hidden group hover:border-slate-500 transition-all cursor-pointer shadow-md"
          >
            <div className="absolute top-0 right-0 w-24 h-24 bg-slate-400/10 rounded-full blur-2xl pointer-events-none" />
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="flex items-center gap-1.5 text-xs font-extrabold text-slate-300 bg-slate-700/80 px-2.5 py-1 rounded-full border border-slate-600">
                  <Medal className="w-4 h-4 text-slate-300" />
                  <span>PERINGKAT 2 (PERAK)</span>
                </span>
                <span className="text-xl font-black font-mono text-slate-200">
                  {sortCriteria === 'speed'
                    ? `${podium[1].avgResolutionHours} jam`
                    : sortCriteria === 'audit'
                    ? `${podium[1].auditScore}%`
                    : sortCriteria === 'satisfaction'
                    ? `${podium[1].satisfactionScore}/5.0`
                    : podium[1].compositeScore}
                </span>
              </div>

              <h4 className="text-base font-bold text-white group-hover:text-slate-200 transition-colors">
                {podium[1].name}
              </h4>
              <p className="text-xs text-slate-400 mt-0.5">{podium[1].category}</p>

              <div className="mt-4 grid grid-cols-2 gap-2 bg-slate-950/60 p-2.5 rounded-xl border border-slate-800 text-[11px]">
                <div>
                  <span className="text-slate-500 block">Rata-rata Waktu</span>
                  <strong className="text-slate-200 font-mono flex items-center gap-1 mt-0.5">
                    <Clock className="w-3 h-3 text-emerald-400" />
                    {podium[1].avgResolutionHours} Jam
                  </strong>
                </div>
                <div>
                  <span className="text-slate-500 block">Skor Audit</span>
                  <strong className="text-indigo-300 font-mono flex items-center gap-1 mt-0.5">
                    <ShieldCheck className="w-3 h-3 text-indigo-400" />
                    {podium[1].integrityIndex}%
                  </strong>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
              <span>{podium[1].totalHandled} Aduan Dituntaskan</span>
              <span className="text-emerald-400 font-semibold">{podium[1].onTimeRate.toFixed(0)}% Tepat Waktu</span>
            </div>
          </div>
        )}

        {/* RANK 1 - EMAS (Center & Highlighted) */}
        {podium[0] && (
          <div
            onClick={() => onSelectDepartment?.(podium[0].name)}
            className="order-1 md:order-2 bg-gradient-to-b from-amber-950/40 via-slate-800/90 to-slate-900 border-2 border-amber-500/80 rounded-2xl p-5 sm:p-6 flex flex-col justify-between relative overflow-hidden group hover:border-amber-400 transition-all cursor-pointer shadow-xl scale-[1.02] z-10"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/20 rounded-full blur-3xl pointer-events-none" />
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="flex items-center gap-1.5 text-xs font-black text-amber-300 bg-amber-500/20 px-3 py-1 rounded-full border border-amber-500/40 shadow-sm animate-pulse">
                  <Trophy className="w-4 h-4 text-amber-400" />
                  <span>JUARA 1 KHADIMUL UMMAH</span>
                </span>
                <span className="text-2xl font-black font-mono text-amber-400">
                  {sortCriteria === 'speed'
                    ? `${podium[0].avgResolutionHours} jam`
                    : sortCriteria === 'audit'
                    ? `${podium[0].auditScore}%`
                    : sortCriteria === 'satisfaction'
                    ? `${podium[0].satisfactionScore}/5.0`
                    : podium[0].compositeScore}
                </span>
              </div>

              <h4 className="text-lg font-extrabold text-white group-hover:text-amber-200 transition-colors">
                {podium[0].name}
              </h4>
              <p className="text-xs text-amber-300/80 mt-0.5">{podium[0].category}</p>

              <div className="mt-4 grid grid-cols-2 gap-2.5 bg-slate-950/80 p-3 rounded-xl border border-amber-500/30 text-xs">
                <div>
                  <span className="text-slate-400 block text-[11px]">Kecepatan Respons</span>
                  <strong className="text-emerald-400 font-mono text-sm flex items-center gap-1 mt-0.5">
                    <Zap className="w-3.5 h-3.5 text-emerald-400" />
                    {podium[0].avgResolutionHours} Jam
                  </strong>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">Skor Audit Kepatuhan</span>
                  <strong className="text-indigo-300 font-mono text-sm flex items-center gap-1 mt-0.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-indigo-400" />
                    {podium[0].integrityIndex}%
                  </strong>
                </div>
              </div>

              <div className="mt-3 flex items-center gap-1 text-[11px] text-amber-300">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                <span>Indeks Kepuasan: <strong>{podium[0].satisfactionScore} / 5.0</strong></span>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-amber-500/30 flex items-center justify-between text-xs text-slate-300">
              <span className="font-semibold text-emerald-400">
                {podium[0].resolvedOnTime} dari {podium[0].totalHandled} Tepat Waktu
              </span>
              <span className="text-amber-400 font-bold flex items-center gap-0.5">
                <span>Teladan Pelayanan</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </span>
            </div>
          </div>
        )}

        {/* RANK 3 - PERUNGGU (Right on desktop) */}
        {podium[2] && (
          <div
            onClick={() => onSelectDepartment?.(podium[2].name)}
            className="order-3 bg-gradient-to-b from-slate-800/90 to-slate-900 border border-slate-700/80 rounded-2xl p-5 flex flex-col justify-between relative overflow-hidden group hover:border-amber-700 transition-all cursor-pointer shadow-md"
          >
            <div className="absolute top-0 right-0 w-24 h-24 bg-amber-700/10 rounded-full blur-2xl pointer-events-none" />
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="flex items-center gap-1.5 text-xs font-extrabold text-amber-500 bg-amber-950/60 px-2.5 py-1 rounded-full border border-amber-800/80">
                  <Medal className="w-4 h-4 text-amber-600" />
                  <span>PERINGKAT 3 (PERUNGGU)</span>
                </span>
                <span className="text-xl font-black font-mono text-amber-500">
                  {sortCriteria === 'speed'
                    ? `${podium[2].avgResolutionHours} jam`
                    : sortCriteria === 'audit'
                    ? `${podium[2].auditScore}%`
                    : sortCriteria === 'satisfaction'
                    ? `${podium[2].satisfactionScore}/5.0`
                    : podium[2].compositeScore}
                </span>
              </div>

              <h4 className="text-base font-bold text-white group-hover:text-amber-300 transition-colors">
                {podium[2].name}
              </h4>
              <p className="text-xs text-slate-400 mt-0.5">{podium[2].category}</p>

              <div className="mt-4 grid grid-cols-2 gap-2 bg-slate-950/60 p-2.5 rounded-xl border border-slate-800 text-[11px]">
                <div>
                  <span className="text-slate-500 block">Rata-rata Waktu</span>
                  <strong className="text-slate-200 font-mono flex items-center gap-1 mt-0.5">
                    <Clock className="w-3 h-3 text-emerald-400" />
                    {podium[2].avgResolutionHours} Jam
                  </strong>
                </div>
                <div>
                  <span className="text-slate-500 block">Skor Audit</span>
                  <strong className="text-indigo-300 font-mono flex items-center gap-1 mt-0.5">
                    <ShieldCheck className="w-3 h-3 text-indigo-400" />
                    {podium[2].integrityIndex}%
                  </strong>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
              <span>{podium[2].totalHandled} Aduan Dituntaskan</span>
              <span className="text-emerald-400 font-semibold">{podium[2].onTimeRate.toFixed(0)}% Tepat Waktu</span>
            </div>
          </div>
        )}
      </div>

      {/* REMAINING OPD RANKINGS TABLE (Rank 4+) */}
      {remainingList.length > 0 && (
        <div className="pt-2">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Peringkat Seluruh Instansi Lainnya
            </h4>
            <span className="text-[11px] text-slate-500 font-mono">
              {metrics.length} Total Organisasi Perangkat Daerah
            </span>
          </div>

          <div className="bg-slate-950/70 border border-slate-800 rounded-xl overflow-hidden divide-y divide-slate-800/80">
            {remainingList.map((dept, index) => {
              const rank = index + 4;
              return (
                <div
                  key={dept.name}
                  onClick={() => onSelectDepartment?.(dept.name)}
                  className="p-3.5 sm:p-4 hover:bg-slate-800/50 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3 cursor-pointer group"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-7 h-7 rounded-lg bg-slate-800 text-slate-300 border border-slate-700 flex items-center justify-center font-black text-xs font-mono shrink-0">
                      #{rank}
                    </span>
                    <div>
                      <h5 className="text-xs sm:text-sm font-bold text-white group-hover:text-emerald-300 transition-colors">
                        {dept.name}
                      </h5>
                      <p className="text-[11px] text-slate-400">{dept.category}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 sm:gap-6 self-end sm:self-center text-xs">
                    <div className="text-right">
                      <span className="text-[10px] text-slate-500 block">Waktu Selesai</span>
                      <span className="font-mono font-bold text-slate-200">
                        {dept.avgResolutionHours} Jam
                      </span>
                    </div>

                    <div className="text-right">
                      <span className="text-[10px] text-slate-500 block">Skor Audit</span>
                      <span className="font-mono font-bold text-indigo-400">
                        {dept.integrityIndex}%
                      </span>
                    </div>

                    <div className="text-right">
                      <span className="text-[10px] text-slate-500 block">Kepuasan</span>
                      <span className="font-mono font-bold text-amber-300">
                        {dept.satisfactionScore} / 5.0
                      </span>
                    </div>

                    <div className="text-right min-w-[70px]">
                      <span className="text-[10px] text-slate-500 block">Skor Akhir</span>
                      <span className="font-mono font-black text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-800/80">
                        {dept.compositeScore}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Islamic Ethical Motivation Note */}
      <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-slate-400 text-[11px] flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Award className="w-4 h-4 text-amber-400 shrink-0" />
          <span>
            Kompetisi sehat ini mengacu pada hadits: <em>"Sebaik-baik manusia adalah yang paling bermanfaat bagi manusia lainnya."</em> (HR. Ahmad).
          </span>
        </div>
        <span className="text-slate-500 hidden sm:inline font-mono">Pembaruan On-Chain: Otomatis</span>
      </div>
    </div>
  );
};
