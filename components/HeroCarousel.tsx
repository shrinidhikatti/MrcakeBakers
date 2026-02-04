'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

const slides = ['/c1.jpeg', '/c2.jpeg', '/c3.jpeg'];

export default function HeroCarousel() {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setActive((i) => (i + 1) % slides.length), 4000);
    return () => clearInterval(t);
  }, []);

  const next = (active + 1) % slides.length;

  const cardConfig = (i: number) => {
    if (i === active)
      return {
        left: '50%',
        transform: 'translateX(-50%) translateY(-50%)',
        zIndex: 30,
        opacity: 1,
        shadow:
          '0 25px 50px -8px rgba(74,44,42,0.4), 0 0 60px rgba(223,53,38,0.12)',
      };
    if (i === next)
      return {
        left: '69%',
        transform:
          'translateX(-50%) translateY(-44%) scale(0.73) rotate(3deg)',
        zIndex: 20,
        opacity: 0.75,
        shadow: '0 10px 25px rgba(0,0,0,0.2)',
      };
    return {
      left: '31%',
      transform:
        'translateX(-50%) translateY(-44%) scale(0.73) rotate(-3deg)',
      zIndex: 10,
      opacity: 0.75,
      shadow: '0 10px 25px rgba(0,0,0,0.2)',
    };
  };

  return (
    <div className="relative h-[400px] md:h-[500px] animate-fadeIn">
      <style>{`
        @keyframes floatBob {
          0%, 100% { transform: translateY(0px); }
          50%      { transform: translateY(-8px); }
        }
        @keyframes shimmer {
          0%   { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
      `}</style>

      {/* Ambient background glows */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-primary-200 rounded-full blur-3xl opacity-30"></div>
      <div className="absolute top-4 right-0 w-36 h-36 bg-pink-200 rounded-full blur-2xl opacity-20"></div>
      <div className="absolute bottom-4 left-2 w-28 h-28 bg-orange-200 rounded-full blur-xl opacity-20"></div>

      {/* Floating particle dots */}
      <div
        className="absolute top-8 left-10 w-3 h-3 bg-primary-400 rounded-full opacity-60"
        style={{ animation: 'floatBob 3s ease-in-out infinite' }}
      />
      <div
        className="absolute top-20 right-12 w-2 h-2 bg-pink-400 rounded-full opacity-50"
        style={{ animation: 'floatBob 3.8s ease-in-out infinite 0.6s' }}
      />
      <div
        className="absolute bottom-20 right-10 w-3 h-3 bg-orange-300 rounded-full opacity-40"
        style={{ animation: 'floatBob 4s ease-in-out infinite 1.2s' }}
      />
      <div
        className="absolute bottom-14 left-16 w-2 h-2 bg-primary-300 rounded-full opacity-45"
        style={{ animation: 'floatBob 3.4s ease-in-out infinite 0.3s' }}
      />
      <div
        className="absolute top-1/3 left-6 w-2.5 h-2.5 bg-pink-300 rounded-full opacity-35"
        style={{ animation: 'floatBob 4.2s ease-in-out infinite 1.5s' }}
      />
      <div
        className="absolute top-16 left-1/3 w-1.5 h-1.5 bg-primary-500 rounded-full opacity-40"
        style={{ animation: 'floatBob 3.2s ease-in-out infinite 0.9s' }}
      />

      {/* 3D Card Stack */}
      <div className="relative w-full h-full">
        {slides.map((src, i) => {
          const { left, transform, zIndex, opacity, shadow } = cardConfig(i);
          const isActive = i === active;

          return (
            <div
              key={src}
              onClick={() => setActive(i)}
              className="absolute cursor-pointer"
              style={{
                top: '50%',
                left,
                transform,
                zIndex,
                opacity,
                width: '220px',
                height: '280px',
                transition: 'all 0.7s cubic-bezier(0.4, 0, 0.2, 1)',
              }}
            >
              <div
                className="relative w-full h-full rounded-2xl overflow-hidden border-[5px] border-white"
                style={{
                  boxShadow: shadow,
                  transition:
                    'box-shadow 0.7s cubic-bezier(0.4, 0, 0.2, 1)',
                }}
              >
                <Image
                  src={src}
                  alt={`Cake ${i + 1}`}
                  fill
                  className="object-cover"
                  sizes="250px"
                  priority={i === 0}
                />

                {/* Bottom-fade overlay — visible only on active card */}
                <div
                  className={`absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent transition-opacity duration-700 ${
                    isActive ? 'opacity-100' : 'opacity-0'
                  }`}
                />

                {/* Shimmer sweep — visible only on active card */}
                <div
                  className={`absolute inset-0 transition-opacity duration-700 ${
                    isActive ? 'opacity-100' : 'opacity-0'
                  }`}
                  style={{
                    background:
                      'linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.15) 45%, rgba(255,255,255,0.15) 55%, transparent 60%)',
                    backgroundSize: '200% 100%',
                    animation: 'shimmer 4s linear infinite',
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Pill indicators */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2 z-40">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setActive(i)}
            className={`rounded-full transition-all duration-500 ${
              i === active
                ? 'bg-primary-600 w-6 h-2 shadow-sm'
                : 'bg-gray-300 w-2 h-2 hover:bg-gray-400'
            }`}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
