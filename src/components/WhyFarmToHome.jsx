import React, { useState } from 'react';
import { WHY_US_FEATURES, COMPARISON_DATA } from '../data/mockData';
import { Users, Leaf, ShieldCheck, Clock, Check, X, Sparkles, HeartHandshake } from 'lucide-react';

const iconMap = {
  Users: Users,
  Leaf: Leaf,
  ShieldCheck: ShieldCheck,
  Clock: Clock
};

export default function WhyFarmToHome() {
  const [showTable, setShowTable] = useState(false);

  return (
    <section id="why-us" className="py-24 bg-[#faf8f2] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#1b4332]/10 text-[#1b4332] text-xs font-bold uppercase tracking-wider mb-3">
            <HeartHandshake className="w-4 h-4 text-[#40916c]" />
            Ethical Agriculture
          </div>
          <h2 className="font-outfit text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#081c15] tracking-tight mb-4">
            Why Farm to Home?
          </h2>
          <p className="text-base sm:text-lg text-[#5c4033]/80 leading-relaxed">
            Rebuilding the bond between local food producers and city families through radical transparency, fair trade ethics, and uncompromised morning freshness.
          </p>
        </div>

        {/* 4 Core Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {WHY_US_FEATURES.map((feature, idx) => {
            const Icon = iconMap[feature.icon] || Leaf;

            return (
              <div
                key={idx}
                className="bg-white rounded-3xl p-7 border border-[#e5e4e7] hover:border-[#74c69d] shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1.5 flex flex-col justify-between"
              >
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-[#d8f3dc] flex items-center justify-center text-[#1b4332] mb-6 shadow-inner">
                    <Icon className="w-6 h-6 text-[#2d6a4f]" />
                  </div>

                  <span className="inline-block px-2.5 py-0.5 rounded-md bg-[#faf8f2] text-[#40916c] text-[11px] font-bold mb-2">
                    {feature.highlight}
                  </span>

                  <h3 className="font-outfit font-bold text-lg text-[#081c15] mb-3 leading-snug">
                    {feature.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-[#5c4033]/70 leading-relaxed">
                    {feature.desc}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-gray-100 flex items-center gap-1.5 text-xs font-semibold text-[#1b4332]">
                  <Check className="w-4 h-4 text-[#52b788]" />
                  <span>Guaranteed Standard</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Comparison Section */}
        <div className="bg-white rounded-3xl border border-[#e5e4e7] p-6 sm:p-10 shadow-lg">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
            <div>
              <span className="text-xs font-bold text-[#40916c] uppercase tracking-wider block mb-1">
                Transparency Benchmark
              </span>
              <h3 className="font-outfit text-2xl sm:text-3xl font-bold text-[#081c15]">
                Farm to Home vs Traditional Supermarkets
              </h3>
            </div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#d8f3dc] text-[#1b4332] text-xs font-bold">
              <Sparkles className="w-4 h-4 text-[#40916c]" />
              Verified Impact
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b-2 border-gray-100 text-xs sm:text-sm font-extrabold uppercase tracking-wider text-gray-400">
                  <th className="py-4 px-4">Standard Metric</th>
                  <th className="py-4 px-4 text-[#1b4332] bg-[#f0fdf4] rounded-t-xl font-black">
                    🌱 Farm to Home
                  </th>
                  <th className="py-4 px-4 text-gray-500">🏬 Typical Supermarket</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-xs sm:text-sm">
                {COMPARISON_DATA.map((row, idx) => (
                  <tr key={idx} className="hover:bg-gray-50/60 transition-colors">
                    <td className="py-4 px-4 font-bold text-[#081c15]">
                      {row.feature}
                    </td>
                    <td className="py-4 px-4 font-bold text-[#1b4332] bg-[#f0fdf4] flex items-center gap-2">
                      <Check className="w-4 h-4 text-[#40916c] shrink-0" />
                      {row.farmToHome}
                    </td>
                    <td className="py-4 px-4 text-gray-500">
                      <div className="flex items-center gap-2">
                        <X className="w-4 h-4 text-red-400 shrink-0" />
                        {row.supermarket}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
}

