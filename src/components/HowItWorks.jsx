import React from 'react';
import { HOW_IT_WORKS_STEPS } from '../data/mockData';
import { Sprout, ShoppingBag, Truck, CheckCircle2, ArrowRight } from 'lucide-react';

const iconMap = {
  Tractor: Sprout,
  ShoppingBag: ShoppingBag,
  Truck: Truck
};

export default function HowItWorks() {
  return (
    <section className="py-24 bg-[#081c15] text-white relative overflow-hidden">
      {/* Decorative background glow */}
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-96 h-96 bg-[#2d6a4f]/20 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute top-1/3 right-10 w-80 h-80 bg-[#52b788]/15 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#1b4332] text-[#95d5b2] text-xs font-bold uppercase tracking-wider mb-4 border border-[#52b788]/30">
            <span className="w-2 h-2 rounded-full bg-[#52b788] animate-pulse" />
            Simple & Transparent Journey
          </div>
          <h2 className="font-outfit text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight mb-4">
            How Farm to Home Works
          </h2>
          <p className="text-base sm:text-lg text-[#f3eee3]/80 leading-relaxed">
            We bypass middlemen, speculative brokers, and multi-week cold storages to bring genuine farm-gate freshness right to your doorstep.
          </p>
        </div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {/* Connector line for desktop */}
          <div className="hidden md:block absolute top-1/2 left-1/6 right-1/6 h-0.5 border-t-2 border-dashed border-[#2d6a4f]/60 -translate-y-8 z-0 pointer-events-none" />

          {HOW_IT_WORKS_STEPS.map((step, idx) => {
            const Icon = iconMap[step.icon] || Sprout;

            return (
              <div 
                key={idx}
                className="relative z-10 bg-[#0d281e]/80 border border-[#2d6a4f]/50 rounded-3xl p-8 backdrop-blur-md flex flex-col justify-between group hover:border-[#52b788] transition-all duration-300 hover:-translate-y-2 shadow-xl"
              >
                <div>
                  {/* Top step number and icon */}
                  <div className="flex items-center justify-between mb-6">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#52b788] to-[#1b4332] p-0.5 shadow-lg group-hover:scale-105 transition-transform">
                      <div className="w-full h-full bg-[#081c15] rounded-[14px] flex items-center justify-center">
                        <Icon className="w-7 h-7 text-[#74c69d]" />
                      </div>
                    </div>
                    <span className="font-outfit font-extrabold text-4xl text-[#2d6a4f] group-hover:text-[#52b788] transition-colors">
                      {step.step}
                    </span>
                  </div>

                  {/* Badge */}
                  <div className="inline-block px-3 py-1 rounded-full bg-[#1b4332]/60 text-[#d8f3dc] text-[11px] font-semibold mb-3 border border-[#52b788]/20">
                    {step.badge}
                  </div>

                  {/* Title */}
                  <h3 className="font-outfit text-xl font-bold text-white mb-3 group-hover:text-[#95d5b2] transition-colors">
                    {step.title}
                  </h3>

                  {/* Description */}
                  <p className="text-sm text-[#f3eee3]/80 leading-relaxed">
                    {step.desc}
                  </p>
                </div>

                {/* Bottom feature tick */}
                <div className="mt-6 pt-4 border-t border-[#2d6a4f]/40 flex items-center gap-2 text-xs text-[#95d5b2]">
                  <CheckCircle2 className="w-4 h-4 text-[#52b788]" />
                  <span>Verified & Safe Protocol</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom Banner */}
        <div className="mt-14 p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-[#1b4332] to-[#2d6a4f] border border-[#52b788]/40 shadow-2xl flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center shrink-0">
              <Sprout className="w-6 h-6 text-[#95d5b2]" />
            </div>
            <div>
              <h4 className="font-outfit font-bold text-lg text-white">Our 100% Dawn-Harvest Promise</h4>
              <p className="text-xs sm:text-sm text-[#d8f3dc]">If produce isn’t crisp and garden-fresh upon arrival, we replace it instantly with no questions asked.</p>
            </div>
          </div>
          <button 
            onClick={() => {
              const shop = document.getElementById('shop');
              if (shop) shop.scrollIntoView({ behavior: 'smooth' });
            }}
            className="px-6 py-3 rounded-xl bg-white text-[#081c15] font-extrabold text-sm hover:bg-[#d8f3dc] transition-colors shadow-md whitespace-nowrap flex items-center gap-2 cursor-pointer"
          >
            Start Fresh Order
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </section>
  );
}

