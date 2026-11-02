import React from 'react';
import { Link } from 'react-router-dom';
import { Sprout, ShieldCheck, HeartHandshake, Phone, Mail, HelpCircle } from 'lucide-react';

export default function CustomerFooter() {
  return (
    <footer className="bg-[#05140f] text-[#f3eee3] pt-12 pb-20 lg:pb-12 border-t border-[#1b4332] mt-16 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#52b788] to-[#1b4332] p-0.5">
                <div className="w-full h-full bg-[#081c15] rounded-[7px] flex items-center justify-center">
                  <Sprout className="w-4 h-4 text-[#52b788]" />
                </div>
              </div>
              <span className="font-outfit font-extrabold text-base text-white">
                Farm to Home
              </span>
            </div>
            <p className="text-gray-400 leading-relaxed mb-3">
              Direct-to-consumer agricultural portal. Over 85% of purchase value reaches verified regional family farms.
            </p>
            <div className="flex items-center gap-1.5 text-[#74c69d]">
              <ShieldCheck className="w-4 h-4" />
              <span className="font-semibold">FSSAI Certified Supply Chain</span>
            </div>
          </div>

          <div>
            <h4 className="font-outfit font-bold text-white mb-3 text-sm">Customer Quick Links</h4>
            <ul className="space-y-2 text-gray-400">
              <li><Link to="/customer/dashboard" className="hover:text-[#52b788]">Customer Dashboard</Link></li>
              <li><Link to="/customer/marketplace" className="hover:text-[#52b788]">Fresh Harvest Marketplace</Link></li>
              <li><Link to="/customer/orders" className="hover:text-[#52b788]">Track Active Deliveries</Link></li>
              <li><Link to="/customer/wishlist" className="hover:text-[#52b788]">Saved Farm Wishlist</Link></li>
              <li><Link to="/customer/profile" className="hover:text-[#52b788]">Delivery Addresses</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-outfit font-bold text-white mb-3 text-sm">Consumer Assurance</h4>
            <ul className="space-y-2 text-gray-400">
              <li className="flex items-center gap-1.5"><HeartHandshake className="w-3.5 h-3.5 text-[#52b788]" /> 100% Dawn-Harvest Guarantee</li>
              <li>Zero cold-storage chemical preservation</li>
              <li>Doorstep replacement if damaged</li>
              <li>Direct grower identity traceability</li>
              <li><Link to="/customer/support" className="hover:text-[#52b788]">Submit Quality Feedback</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-outfit font-bold text-white mb-3 text-sm">Helpline & Resolution</h4>
            <ul className="space-y-2 text-gray-400">
              <li className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-[#52b788]" />
                <span>+91 1800-FARM-FRESH (7 AM - 9 PM)</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-[#52b788]" />
                <span>care@farmtohome.market</span>
              </li>
              <li className="pt-2">
                <Link
                  to="/customer/support"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#1b4332] text-[#95d5b2] hover:text-white transition-colors font-semibold"
                >
                  <HelpCircle className="w-3.5 h-3.5" />
                  Help Desk & Order Complaints
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-6 border-t border-[#1b4332]/60 flex flex-col sm:flex-row items-center justify-between text-gray-500 gap-3">
          <p>© 2026 Farm to Home. Customer Module Interface.</p>
          <div className="flex gap-4">
            <Link to="/" className="hover:text-gray-300">Public Home</Link>
            <Link to="/customer/support" className="hover:text-gray-300">Support Desk</Link>
            <a href="#terms" className="hover:text-gray-300">Terms of Trade</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

