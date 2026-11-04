import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { handleImageError, CATEGORY_FALLBACK_IMAGES } from '../utils/imageFallback';
import { 
  ArrowUpRight, 
  Sparkles, 
  Sprout, 
  Carrot, 
  Apple, 
  Milk, 
  Wheat, 
  Layers, 
  Droplets, 
  Sun, 
  Package 
} from 'lucide-react';

const iconMap = {
  Carrot,
  Apple,
  Milk,
  Wheat,
  Layers,
  Sparkles,
  Droplets,
  Sprout,
  Sun,
  Package
};

export default function Categories({ selectedCategory, onSelectCategory }) {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    let isMounted = true;
    api.getCategories().then((cats) => {
      if (isMounted && Array.isArray(cats) && cats.length > 0) {
        setCategories(cats);
      }
    }).catch(() => {});
    return () => { isMounted = false; };
  }, []);

  const handleCategoryClick = (categoryId) => {
    onSelectCategory(categoryId);
    const shop = document.getElementById('shop');
    if (shop) {
      shop.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const displayList = categories.length > 0 ? categories : [];

  return (
    <section id="categories" className="py-20 bg-[#faf8f2] relative overflow-hidden">
      {/* Decorative background blurs */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#52b788]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#d8a47f]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#1b4332]/10 text-[#1b4332] text-xs font-bold uppercase tracking-wider mb-3">
            <Sparkles className="w-3.5 h-3.5 text-[#40916c]" />
            Pure Agricultural Bounty
          </div>
          <h2 className="font-outfit text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#081c15] tracking-tight mb-4">
            Curated Farm Categories
          </h2>
          <p className="text-base sm:text-lg text-[#5c4033]/80">
            Browse genuine crops harvested fresh at dawn. Sourced from local regional farmers and cooperative agricultural hubs.
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
          {displayList.map((cat) => {
            const Icon = iconMap[cat.icon] || Sprout;
            const catId = cat.slug || cat.categoryId || cat.id;
            const isSelected = selectedCategory === catId;

            return (
              <div
                key={catId}
                onClick={() => handleCategoryClick(catId)}
                className={`group relative rounded-3xl overflow-hidden cursor-pointer transition-all duration-300 transform hover:-translate-y-2 flex flex-col justify-between shadow-sm hover:shadow-xl ${
                  isSelected 
                    ? 'ring-4 ring-[#40916c] ring-offset-2 bg-white' 
                    : 'bg-white border border-[#e5e4e7] hover:border-[#74c69d]'
                }`}
              >
                {/* Image Top */}
                <div className="relative h-44 overflow-hidden">
                  <img
                    src={cat.image || CATEGORY_FALLBACK_IMAGES[cat.slug] || CATEGORY_FALLBACK_IMAGES.default}
                    alt={cat.name}
                    loading="lazy"
                    onError={(e) => handleImageError(e, cat.slug)}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#081c15]/80 via-transparent to-black/20" />
                  
                  {/* Category icon pill */}
                  <div className="absolute top-3 left-3 w-9 h-9 rounded-xl bg-white/90 backdrop-blur-md flex items-center justify-center text-[#1b4332] shadow-md group-hover:bg-[#40916c] group-hover:text-white transition-colors">
                    <Icon className="w-5 h-5" />
                  </div>

                  {/* Variety Count */}
                  <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-[#081c15]/70 backdrop-blur-md text-[11px] font-semibold text-[#d8f3dc]">
                    {cat.productCount ? `${cat.productCount} Items` : 'Fresh Produce'}
                  </div>

                  {/* Bottom Image Title */}
                  <div className="absolute bottom-3 left-3 right-3 text-white">
                    <h3 className="font-outfit font-bold text-lg leading-snug group-hover:text-[#74c69d] transition-colors">
                      {cat.name}
                    </h3>
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-4 flex-1 flex flex-col justify-between bg-white">
                  <p className="text-xs text-[#5c4033]/70 line-clamp-2 leading-relaxed mb-4">
                    {cat.description}
                  </p>

                  <div className="flex items-center justify-between pt-3 border-t border-gray-100 text-xs font-bold text-[#1b4332] group-hover:text-[#40916c] transition-colors">
                    <span>Explore Harvest</span>
                    <div className="w-6 h-6 rounded-full bg-[#faf8f2] group-hover:bg-[#d8f3dc] flex items-center justify-center transition-colors">
                      <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

