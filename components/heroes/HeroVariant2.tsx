import Link from "next/link";
import Image from "next/image";
import { ChevronRight, ArrowDown } from "lucide-react";

export default function HeroVariant2() {
  return (
    <section className="relative min-h-[92vh] flex items-center overflow-hidden">
      {/* Background layer */}
      <div className="absolute inset-0 bg-[#1a0f0e]">
        <Image
          src="/b1.png"
          alt=""
          fill
          className="object-cover opacity-25"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#1a0f0e] via-[#1a0f0e]/85 to-[#1a0f0e]/50"></div>
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 w-full py-24">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          {/* ── Left: Copy ── */}
          <div className="space-y-7">
            {/* Live badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[#C19A6B]/30 bg-[#C19A6B]/10">
              <span className="w-2 h-2 bg-[#C19A6B] rounded-full animate-pulse"></span>
              <span className="text-[#C19A6B] text-sm font-medium">
                Est. 2020 • Bangalore
              </span>
            </div>

            {/* Headline */}
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-[1.1]">
              Taste The<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#df3526] via-[#FF6B9D] to-[#C19A6B]">
                Art of Baking
              </span>
            </h1>

            {/* Sub */}
            <p className="text-lg text-gray-400 max-w-lg leading-relaxed">
              Handcrafted cakes, pastries & breads baked fresh every morning.
              Delivered to your doorstep with love and care.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap gap-4 pt-2">
              <Link
                href="/products"
                className="group inline-flex items-center gap-2 bg-[#df3526] hover:bg-[#c42e1f] text-white px-8 py-4 rounded-full font-semibold text-lg shadow-lg shadow-[#df3526]/25 hover:shadow-[#df3526]/40 transition-all active:scale-95"
              >
                Explore Menu
                <ChevronRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/menu"
                className="inline-flex items-center border border-white/20 hover:border-white/40 text-white px-8 py-4 rounded-full font-semibold text-lg bg-white/5 hover:bg-white/10 transition-all active:scale-95"
              >
                View Menu
              </Link>
            </div>

            {/* Trust row */}
            <div className="flex flex-wrap gap-x-8 gap-y-3 pt-2">
              {[
                { emoji: "🎂", label: "Fresh Daily" },
                { emoji: "🚗", label: "Same-Day Delivery" },
                { emoji: "⭐", label: "5-Star Rated" },
              ].map((t) => (
                <div key={t.label} className="flex items-center gap-2">
                  <span className="text-xl">{t.emoji}</span>
                  <span className="text-sm text-gray-400">{t.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* ── Right: Image showcase ── */}
          <div className="relative flex items-center justify-center h-[420px] md:h-[520px]">
            {/* Decorative rings */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-96 h-96 rounded-full border border-white/[0.06]"></div>
            </div>
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-72 h-72 rounded-full border border-white/[0.04]"></div>
            </div>

            {/* Main card */}
            <div className="relative z-20 w-64 h-80 md:w-72 md:h-96 rounded-3xl overflow-hidden shadow-2xl border-4 border-white/10">
              <Image
                src="/c1.jpeg"
                alt="Signature Cake"
                fill
                className="object-cover"
                sizes="400px"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"></div>
              {/* Price tag */}
              <div className="absolute bottom-4 left-4 bg-white/95 backdrop-blur rounded-xl px-4 py-2 shadow-lg">
                <p className="text-xs text-gray-500 uppercase tracking-wide">
                  Starting from
                </p>
                <p className="text-lg font-bold text-[#4A2C2A]">₹850</p>
              </div>
            </div>

            {/* Side card – top right */}
            <div className="absolute top-2 right-0 md:right-4 z-10 w-36 h-44 rounded-2xl overflow-hidden shadow-xl border-[3px] border-white/20">
              <Image
                src="/c2.jpeg"
                alt="Vanilla Cake"
                fill
                className="object-cover"
                sizes="200px"
              />
            </div>

            {/* Side card – bottom left */}
            <div className="absolute bottom-2 left-0 md:left-2 z-10 w-32 h-40 rounded-2xl overflow-hidden shadow-xl border-[3px] border-white/20">
              <Image
                src="/c3.jpeg"
                alt="Berry Cake"
                fill
                className="object-cover"
                sizes="200px"
              />
            </div>

            {/* Badge – Artisan */}
            <div className="absolute top-6 left-2 md:left-10 z-30 bg-white rounded-xl px-4 py-3 shadow-xl flex items-center gap-2">
              <span className="text-xl">🍰</span>
              <div>
                <p className="text-xs font-bold text-[#4A2C2A]">Artisan</p>
                <p className="text-xs text-gray-500">100% Handmade</p>
              </div>
            </div>

            {/* Badge – Rating */}
            <div className="absolute bottom-10 right-2 md:right-10 z-30 bg-white rounded-xl px-4 py-3 shadow-xl flex items-center gap-2">
              <span className="text-xl">⭐</span>
              <div>
                <p className="text-xs font-bold text-[#4A2C2A]">Rating</p>
                <p className="text-xs text-gray-500">4.9 / 5.0</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll arrow */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 animate-bounce">
        <ArrowDown className="h-5 w-5 text-white/30" />
      </div>
    </section>
  );
}
