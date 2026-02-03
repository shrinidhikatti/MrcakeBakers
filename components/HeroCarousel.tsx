'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

const images = ['/c1.jpeg', '/c2.jpeg', '/c3.jpeg'];

export default function HeroCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, 3500); // Change image every 3.5 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative h-[400px] md:h-[500px] animate-fadeIn">
      <div className="absolute inset-0 bg-gradient-to-br from-primary-400 to-pink-400 rounded-3xl transform rotate-3 opacity-20"></div>
      <div className="absolute inset-0 bg-gradient-to-br from-primary-500 to-pink-500 rounded-3xl transform -rotate-3 opacity-20"></div>
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-80 h-80 md:w-96 md:h-96 bg-white rounded-full shadow-2xl flex items-center justify-center overflow-hidden relative">
          {images.map((src, index) => (
            <div
              key={src}
              className={`absolute inset-0 transition-opacity duration-1000 ${
                index === currentIndex ? 'opacity-100' : 'opacity-0'
              }`}
            >
              <Image
                src={src}
                alt={`Cake ${index + 1}`}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 320px, 384px"
                priority={index === 0}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Dots indicator */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
        {images.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`w-2 h-2 rounded-full transition-all ${
              index === currentIndex
                ? 'bg-primary-600 w-4'
                : 'bg-gray-300 hover:bg-gray-400'
            }`}
            aria-label={`Go to image ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
