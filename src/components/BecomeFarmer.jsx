import React from 'react';
import { FARMER_BENEFITS } from '../data/mockData';
import { Sparkles, CheckCircle2, ArrowRight, TrendingUp, ShieldCheck, Truck, Coins } from 'lucide-react';

export default function BecomeFarmer({ onOpenFarmerModal }) {
  return (
    <section id="become-farmer" className="py-24 bg-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-br from-[#081c15] via-[#133926] to-[#1b4332] rounded-[2.5rem] p-8 sm:p-12 lg:p-16 text-white relative overflow-hidden shadow-2xl border border-[#2d6a4f]/50">
          {/* Decorative ambient elements */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#52b788]/20 rounded-full blur-[100px] pointer-events-none" />
          <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-[#d8a47f]/15 rounded-full blur-[100px] pointer-events-none" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
            {/* Left Content */}
            <div className="lg:col-span-7">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#2d6a4f]/60 backdrop-blur-md text-[#95d5b2] text-xs font-bold uppercase tracking-wider mb-6 border border-[#52b788]/30">
                <Sparkles className="w-4 h-4 text-[#e9d8a6]" />
                Grower Partnership Program
              </div>

              <h2 className="font-outfit text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight mb-6">
                Are You a Grower? <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#95d5b2] via-[#74c69d] to-[#d8f3dc]">
                  Sell Directly to Thousands of Urban Homes.
                </span>
              </h2>

              <p className="text-base sm:text-lg text-[#f3eee3]/90 leading-relaxed mb-8 max-w-xl">
                Eliminate broker deductions and predatory commission rates. List your upcoming harvests on Farm to Home, fix your own transparent farm gate prices, and receive weekly direct bank deposits.
              </p>

              {/* Benefits Checklist */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 mb-10">
                {FARMER_BENEFITS.map((benefit, idx) => (
                  <div key={idx} className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-5 h-5 text-[#52b788] shrink-0 mt-0.5" />
                    <span className="text-xs sm:text-sm text-[#d8f3dc]/90 font-medium">
                      {benefit}
                    </span>
                  </div>
                ))}
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center gap-4">
                <button
                  onClick={onOpenFarmerModal}
                  className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-[#52b788] to-[#40916c] hover:from-[#74c69d] hover:to-[#52b788] text-[#081c15] font-extrabold text-base shadow-xl hover:shadow-2xl hover:shadow-[#52b788]/40 transition-all duration-300 transform hover:-translate-y-1 flex items-center justify-center gap-2 group cursor-pointer"
                >
                  Register as a Farmer
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
                <div className="text-xs text-[#95d5b2] flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-[#52b788]" />
                  <span>Free registration • Verification in 24 hours</span>
                </div>
              </div>
            </div>

            {/* Right Card / Farmer Spotlight Showcase */}
            <div className="lg:col-span-5">
              <div className="bg-[#081c15]/90 border border-[#52b788]/40 rounded-3xl p-6 sm:p-8 backdrop-blur-xl shadow-2xl relative">
                {/* Farmer testimonial card */}
                <div className="flex items-center gap-4 mb-6">
                  <img
                    src="https://images.unsplash.com/photo-1595974482597-4b8da8879bc5?auto=format&fit=crop&w=300&q=80"
                    alt="Farmer Ramesh Patel"
                    className="w-16 h-16 rounded-2xl object-cover border-2 border-[#52b788]"
                  />
                  <div>
                    <h4 className="font-outfit font-bold text-lg text-white">Ramesh Patel</h4>
                    <p className="text-xs text-[#95d5b2]">Green Valley Farms • Joined 2024</p>
                    <div className="flex items-center gap-1 text-[11px] text-[#e9d8a6] mt-0.5">
                      ★★★★★ (4.9 Rating)
                    </div>
                  </div>
                </div>

                <blockquote className="text-sm text-[#f3eee3]/90 italic mb-6 leading-relaxed bg-[#1b4332]/40 p-4 rounded-2xl border border-[#2d6a4f]/50">
                  "Before Farm to Home, wholesale traders took 60% of my harvest value. Now, I receive morning orders directly, send fresh produce by 7 AM, and my family’s income has doubled."
                </blockquote>

                {/* Key stats row */}
                <div className="grid grid-cols-3 gap-2 text-center pt-4 border-t border-[#2d6a4f]/50">
                  <div className="p-2 rounded-xl bg-white/5">
                    <span className="block font-outfit font-extrabold text-base text-[#74c69d]">85%+</span>
                    <span className="text-[10px] text-gray-300">Net Return</span>
                  </div>
                  <div className="p-2 rounded-xl bg-white/5">
                    <span className="block font-outfit font-extrabold text-base text-[#74c69d]">24h</span>
                    <span className="text-[10px] text-gray-300">Doorstep Pickup</span>
                  </div>
                  <div className="p-2 rounded-xl bg-white/5">
                    <span className="block font-outfit font-extrabold text-base text-[#74c69d]">Weekly</span>
                    <span className="text-[10px] text-gray-300">Direct Pay</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

