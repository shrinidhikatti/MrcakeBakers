'use client';

const items = [
  'Fresh Cakes',
  'Artisan Pastries',
  'Daily Breads',
  'Custom Orders',
  'Same-Day Delivery',
  'Premium Ingredients',
  'Made With Love',
];

export default function MarqueeStrip() {
  return (
    <section className="bg-[#4A2C2A] py-4 overflow-hidden">
      <style>{`
        @keyframes marquee {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .marquee-track { animation: marquee 28s linear infinite; }
      `}</style>

      <div className="marquee-track flex whitespace-nowrap">
        {[0, 1].map((dup) => (
          <div key={dup} className="flex items-center">
            {items.map((item, i) => (
              <span key={i} className="flex items-center px-6">
                <span className="text-white opacity-70 text-sm font-medium tracking-widest uppercase">
                  {item}
                </span>
                <span className="text-[#df3526] ml-6">✦</span>
              </span>
            ))}
          </div>
        ))}
      </div>
    </section>
  );
}
