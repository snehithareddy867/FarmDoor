import React, { useState } from 'react';
import { 
  Sprout, 
  Mail, 
  Phone, 
  MapPin, 
  ArrowRight, 
  ShieldCheck, 
  CheckCircle2 
} from 'lucide-react';

export default function Footer({ onOpenFarmerModal, onSelectCategory }) {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setTimeout(() => {
        setEmail('');
        setSubscribed(false);
      }, 3500);
    }
  };

  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <footer className="bg-[#05140f] text-[#f3eee3] pt-20 pb-12 border-t border-[#1b4332]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Newsletter Card */}
        <div className="bg-gradient-to-r from-[#0d281e] to-[#1b4332] rounded-3xl p-8 sm:p-10 mb-16 border border-[#2d6a4f]/50 shadow-2xl flex flex-col lg:flex-row items-center justify-between gap-8">
          <div className="max-w-xl">
            <span className="text-xs font-bold uppercase tracking-wider text-[#74c69d] block mb-2">
              Weekly Harvest Bulletin
            </span>
            <h3 className="font-outfit text-2xl sm:text-3xl font-extrabold text-white mb-2">
              Get Notified When Fresh Crops Arrive
            </h3>
            <p className="text-sm text-[#d8f3dc]/80">
              Subscribe to receive weekly dawn-harvest alerts, seasonal specials, and farmer stories. No spam ever.
            </p>
          </div>

          <form onSubmit={handleSubscribe} className="w-full lg:w-auto flex-1 max-w-md">
            {subscribed ? (
              <div className="flex items-center gap-2 p-3 bg-[#52b788]/20 border border-[#52b788] rounded-2xl text-[#95d5b2] text-sm font-semibold">
                <CheckCircle2 className="w-5 h-5" />
                <span>Thank you! You’re subscribed to harvest alerts.</span>
              </div>
            ) : (
              <div className="flex items-center gap-2 bg-[#081c15] p-1.5 rounded-2xl border border-[#2d6a4f]">
                <Mail className="w-5 h-5 text-gray-400 ml-3 shrink-0" />
                <input
                  type="email"
                  required
                  placeholder="Enter your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-transparent px-2 py-2 text-sm text-white placeholder-gray-500 focus:outline-none"
                />
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-[#52b788] hover:bg-[#74c69d] text-[#081c15] font-bold text-xs sm:text-sm whitespace-nowrap transition-colors flex items-center gap-1 cursor-pointer"
                >
                  Join Club
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </form>
        </div>

        {/* Main Footer Links Columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 mb-16">
          {/* Brand Info */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3 mb-5 cursor-pointer" onClick={() => scrollTo('hero')}>
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#52b788] to-[#1b4332] p-0.5">
                <div className="w-full h-full bg-[#081c15] rounded-[10px] flex items-center justify-center">
                  <Sprout className="w-6 h-6 text-[#52b788]" />
                </div>
              </div>
              <span className="font-outfit font-extrabold text-2xl text-white tracking-tight">
                Farm to Home
              </span>
            </div>

            <p className="text-sm text-[#95d5b2]/80 leading-relaxed mb-6 max-w-sm">
              Empowering regional agricultural communities by delivering freshly harvested produce directly to urban doorsteps. Better health for consumers, equitable livelihood for farmers.
            </p>

            {/* Social SVGs */}
            <div className="flex items-center gap-3">
              <a href="#instagram" aria-label="Instagram" className="w-9 h-9 rounded-xl bg-white/5 hover:bg-[#52b788]/20 hover:text-[#52b788] flex items-center justify-center text-gray-400 transition-colors">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </a>
              <a href="#facebook" aria-label="Facebook" className="w-9 h-9 rounded-xl bg-white/5 hover:bg-[#52b788]/20 hover:text-[#52b788] flex items-center justify-center text-gray-400 transition-colors">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M9 8H6v4h3v12h5V12h3.642L18 8h-4V6.333C14 5.374 14.5 5 15.6 5H18V0h-3.808C10.595 0 9 1.583 9 4.615V8z"/>
                </svg>
              </a>
              <a href="#twitter" aria-label="Twitter / X" className="w-9 h-9 rounded-xl bg-white/5 hover:bg-[#52b788]/20 hover:text-[#52b788] flex items-center justify-center text-gray-400 transition-colors">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
              </a>
              <a href="#linkedin" aria-label="LinkedIn" className="w-9 h-9 rounded-xl bg-white/5 hover:bg-[#52b788]/20 hover:text-[#52b788] flex items-center justify-center text-gray-400 transition-colors">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                </svg>
              </a>
              <a href="#youtube" aria-label="YouTube" className="w-9 h-9 rounded-xl bg-white/5 hover:bg-[#52b788]/20 hover:text-[#52b788] flex items-center justify-center text-gray-400 transition-colors">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-outfit font-bold text-base text-white mb-4">Quick Navigation</h4>
            <ul className="flex flex-col gap-2.5 text-sm text-gray-400">
              <li>
                <button onClick={() => scrollTo('hero')} className="hover:text-[#74c69d] transition-colors">Home Page</button>
              </li>
              <li>
                <button onClick={() => scrollTo('shop')} className="hover:text-[#74c69d] transition-colors">Shop Marketplace</button>
              </li>
              <li>
                <button onClick={() => scrollTo('categories')} className="hover:text-[#74c69d] transition-colors">All Harvest Categories</button>
              </li>
              <li>
                <button onClick={() => scrollTo('why-us')} className="hover:text-[#74c69d] transition-colors">About & Verification</button>
              </li>
              <li>
                <button onClick={onOpenFarmerModal} className="text-[#52b788] hover:text-[#74c69d] font-semibold transition-colors">
                  Join as a Farmer
                </button>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 className="font-outfit font-bold text-base text-white mb-4">Crop Categories</h4>
            <ul className="flex flex-col gap-2.5 text-sm text-gray-400">
              <li>
                <button onClick={() => onSelectCategory('vegetables')} className="hover:text-[#74c69d] transition-colors">Organic Vegetables</button>
              </li>
              <li>
                <button onClick={() => onSelectCategory('fruits')} className="hover:text-[#74c69d] transition-colors">Orchard Fresh Fruits</button>
              </li>
              <li>
                <button onClick={() => onSelectCategory('dairy')} className="hover:text-[#74c69d] transition-colors">Grass-Fed Dairy & Butter</button>
              </li>
              <li>
                <button onClick={() => onSelectCategory('grains')} className="hover:text-[#74c69d] transition-colors">Ancient Grains & Flours</button>
              </li>
              <li>
                <button onClick={() => onSelectCategory('other')} className="hover:text-[#74c69d] transition-colors">Forest Honey & Cold Oils</button>
              </li>
            </ul>
          </div>

          {/* Contact & Support */}
          <div>
            <h4 className="font-outfit font-bold text-base text-white mb-4">Help & Contact</h4>
            <ul className="flex flex-col gap-3 text-sm text-gray-400">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#52b788] shrink-0 mt-0.5" />
                <span>Central Agri Hub, Sector 4, Green Corridor</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-[#52b788] shrink-0" />
                <span>+91 1800-FARM-FRESH (Toll Free)</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-[#52b788] shrink-0" />
                <span>support@farmtohome.market</span>
              </li>
              <li className="pt-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#1b4332] text-[#95d5b2] text-xs font-semibold">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#52b788]" />
                  FSSAI Certified Partner
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Copyright & Policies */}
        <div className="pt-8 border-t border-[#1b4332]/60 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-500">
          <p>© 2026 Farm to Home Agricultural Marketplace. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <a href="#privacy" className="hover:text-gray-300 transition-colors">Privacy Policy</a>
            <a href="#terms" className="hover:text-gray-300 transition-colors">Terms of Trade</a>
            <a href="#harvest-guarantee" className="hover:text-gray-300 transition-colors">Harvest Fresh Guarantee</a>
            <a href="#farmer-charter" className="hover:text-gray-300 transition-colors">Fair Farmer Charter</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
