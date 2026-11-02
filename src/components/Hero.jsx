import React, { useRef, useState, useEffect } from 'react';
import { 
  ArrowRight, 
  Sparkles, 
  ShieldCheck, 
  Truck, 
  Leaf, 
  Volume2, 
  VolumeX, 
  Play, 
  Pause,
  Award,
  CheckCircle2
} from 'lucide-react';
import { TRUST_METRICS } from '../data/mockData';

export default function Hero({ onOpenFarmerModal }) {
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [videoLoaded, setVideoLoaded] = useState(false);

  useEffect(() => {
    // Attempt auto-play with mute fallback
    if (videoRef.current) {
      videoRef.current.play().then(() => {
        setIsPlaying(true);
      }).catch((err) => {
        console.log('Video autoplay prevented, clicking play will start it', err);
        setIsPlaying(false);
      });
    }
  }, []);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
        setIsPlaying(false);
      } else {
        videoRef.current.play();
        setIsPlaying(true);
      }
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const scrollToShop = () => {
    const shop = document.getElementById('shop');
    if (shop) {
      shop.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="hero" className="relative min-h-[92vh] lg:min-h-screen flex items-center justify-center overflow-hidden bg-[#081c15] pt-24 pb-16">
      {/* Background HTML5 Video */}
      <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none select-none z-0">
        <video
          ref={videoRef}
          autoPlay
          muted
          loop
          playsInline
          onLoadedData={() => setVideoLoaded(true)}
          className={`w-full h-full object-cover transition-opacity duration-1000 ${
            videoLoaded ? 'opacity-100' : 'opacity-30'
          }`}
          style={{
            objectPosition: 'center 32%',
            transform: 'scale(1.04)', // subtle scale to prevent border artifacts
            filter: 'brightness(0.92) contrast(1.08) saturate(1.15)',
          }}
        >
          <source src="/videos/farm-hero.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>

        {/* Subtle Dark Green Overlay for Optimal Readability */}
        <div 
          className="absolute inset-0"
          style={{
            background: `radial-gradient(ellipse at 50% 30%, rgba(8, 28, 21, 0.45) 0%, rgba(8, 28, 21, 0.72) 60%, rgba(8, 28, 21, 0.95) 100%),
                         linear-gradient(to bottom, rgba(8, 28, 21, 0.7) 0%, rgba(13, 40, 24, 0.5) 45%, rgba(8, 28, 21, 0.92) 100%)`
          }}
        />

        {/* Ambient Nature Glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-[#52b788]/15 blur-[120px] rounded-full pointer-events-none" />
      </div>

      {/* Floating Video Controls */}
      <div className="absolute bottom-6 right-6 z-20 flex items-center gap-2 bg-[#081c15]/75 backdrop-blur-md px-3 py-1.5 rounded-full border border-[#52b788]/30 shadow-lg text-white text-xs">
        <button 
          onClick={togglePlay}
          className="flex items-center gap-1.5 hover:text-[#74c69d] transition-colors px-1"
          title={isPlaying ? "Pause Video" : "Play Video"}
        >
          {isPlaying ? <Pause className="w-3.5 h-3.5 text-[#52b788]" /> : <Play className="w-3.5 h-3.5 text-[#52b788]" />}
          <span className="hidden sm:inline">{isPlaying ? 'Pause' : 'Play'}</span>
        </button>
        <span className="w-px h-3 bg-white/20" />
        <button 
          onClick={toggleMute}
          className="flex items-center gap-1.5 hover:text-[#74c69d] transition-colors px-1"
          title={isMuted ? "Unmute Audio" : "Mute Audio"}
        >
          {isMuted ? <VolumeX className="w-3.5 h-3.5 text-[#95d5b2]" /> : <Volume2 className="w-3.5 h-3.5 text-[#52b788]" />}
          <span className="hidden sm:inline">{isMuted ? 'Muted' : 'Sound'}</span>
        </button>
      </div>

      {/* Hero Content */}
      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center flex flex-col items-center">
        {/* Top Pill Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#1b4332]/80 backdrop-blur-md border border-[#52b788]/40 text-[#d8f3dc] text-xs sm:text-sm font-semibold shadow-xl mb-6 animate-in fade-in slide-in-from-top-4 duration-700">
          <span className="flex h-2 w-2 rounded-full bg-[#52b788] animate-ping" />
          <Leaf className="w-3.5 h-3.5 text-[#74c69d]" />
          <span>Direct From Verified Local Farms • 0 Middlemen</span>
          <span className="bg-[#52b788]/20 text-[#a7f3d0] text-[10px] uppercase font-bold px-2 py-0.5 rounded-full border border-[#52b788]/30">
            Fresh Picked
          </span>
        </div>

        {/* Main Heading */}
        <h1 className="font-outfit text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold text-white tracking-tight leading-[1.12] mb-6 drop-shadow-md">
          From Our Farms, <br className="hidden sm:inline" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#95d5b2] via-[#74c69d] to-[#d8f3dc]">
            Fresh to Your Home.
          </span>
        </h1>

        {/* Subtitle */}
        <p className="max-w-3xl text-base sm:text-lg md:text-xl text-[#f3eee3]/90 font-normal leading-relaxed mb-10 drop-shadow">
          Experience true farm-to-table shopping. We connect you directly with conscientious 
          local growers, delivering hand-harvested organic vegetables, orchard fruits, pure dairy, 
          and wholesome grains right to your doorstep within hours of picking.
        </p>

        {/* Call To Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto mb-14">
          <button
            onClick={scrollToShop}
            className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-[#52b788] to-[#40916c] hover:from-[#74c69d] hover:to-[#52b788] text-[#081c15] font-extrabold text-base shadow-xl hover:shadow-2xl hover:shadow-[#52b788]/30 transition-all duration-300 transform hover:-translate-y-1 flex items-center justify-center gap-2 group cursor-pointer"
          >
            Explore Products
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>

          <button
            onClick={onOpenFarmerModal}
            className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-[#081c15]/60 hover:bg-[#1b4332]/80 text-white font-bold text-base border border-[#52b788]/50 hover:border-[#52b788] backdrop-blur-md shadow-lg transition-all duration-300 transform hover:-translate-y-1 flex items-center justify-center gap-2 group cursor-pointer"
          >
            <Sparkles className="w-5 h-5 text-[#e9d8a6] group-hover:rotate-12 transition-transform" />
            Join as Farmer
          </button>
        </div>

        {/* Small Trust Indicators */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-6 w-full max-w-3xl">
          <div className="flex items-center gap-3.5 bg-[#081c15]/70 backdrop-blur-md px-4 py-3 rounded-2xl border border-[#2d6a4f]/50 shadow-md text-left">
            <div className="w-10 h-10 rounded-xl bg-[#52b788]/20 flex items-center justify-center shrink-0 border border-[#52b788]/30">
              <Leaf className="w-5 h-5 text-[#52b788]" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">Fresh Produce</h4>
              <p className="text-xs text-[#95d5b2]">Harvested Daily at Dawn</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5 bg-[#081c15]/70 backdrop-blur-md px-4 py-3 rounded-2xl border border-[#2d6a4f]/50 shadow-md text-left">
            <div className="w-10 h-10 rounded-xl bg-[#52b788]/20 flex items-center justify-center shrink-0 border border-[#52b788]/30">
              <ShieldCheck className="w-5 h-5 text-[#52b788]" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">Verified Farmers</h4>
              <p className="text-xs text-[#95d5b2]">100% Certified Local Growers</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5 bg-[#081c15]/70 backdrop-blur-md px-4 py-3 rounded-2xl border border-[#2d6a4f]/50 shadow-md text-left">
            <div className="w-10 h-10 rounded-xl bg-[#52b788]/20 flex items-center justify-center shrink-0 border border-[#52b788]/30">
              <Truck className="w-5 h-5 text-[#52b788]" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">Flexible Delivery</h4>
              <p className="text-xs text-[#95d5b2]">Morning & Evening Slots</p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Live Metrics Banner */}
      <div className="absolute bottom-0 left-0 right-0 border-t border-[#2d6a4f]/40 bg-[#081c15]/90 backdrop-blur-md hidden md:block">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5">
          <div className="grid grid-cols-4 divide-x divide-[#2d6a4f]/40 text-center">
            {TRUST_METRICS.map((metric, idx) => (
              <div key={idx} className="px-4">
                <span className="font-outfit font-extrabold text-xl lg:text-2xl text-[#74c69d]">
                  {metric.value}
                </span>
                <span className="block text-xs font-semibold text-white">
                  {metric.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

