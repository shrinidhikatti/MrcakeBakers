import Link from "next/link";
import Image from "next/image";
import { auth } from "@/auth";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import MarqueeStrip from "@/components/MarqueeStrip";
import { ChevronRight, Star, ArrowDown, Mail, Check } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/lib/utils";
import { unstable_cache } from "next/cache";

const getFeaturedProducts = unstable_cache(
  async () => {
    return prisma.product.findMany({
      where: { featured: true, inStock: true },
      take: 4,
      include: { category: true },
    });
  },
  ["featured-products"],
  { revalidate: 60 }
);

export default async function HomePage() {
  const session = await auth();
  const featuredProducts = await getFeaturedProducts();

  return (
    <div className="min-h-screen flex flex-col bg-[#1a0f0e]">
      <Header user={session?.user} />

      <main className="flex-grow">
        {/* ─── HERO ─── */}
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

        {/* ─── MARQUEE ─── */}
        <MarqueeStrip />

        {/* ─── BESTSELLERS ─── */}
        <section className="py-24 bg-[#FFF8F0]">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-16">
              <div>
                <p className="text-[#df3526] text-sm font-semibold tracking-widest uppercase">
                  Our Collection
                </p>
                <h2 className="text-4xl md:text-5xl font-bold text-[#4A2C2A] mt-1">
                  Bestsellers
                </h2>
              </div>
              <Link
                href="/products"
                className="text-[#df3526] hover:text-[#c42e1f] font-semibold inline-flex items-center gap-1 group"
              >
                View All Products
                <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            {/* Asymmetric grid */}
            {featuredProducts.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
                {featuredProducts.map((product, index) => {
                  const images = JSON.parse(product.images);
                  const firstImage = images[0];
                  const isUrl = firstImage?.startsWith("http");
                  // Alternate: large – small – small – large
                  const isLarge = index === 0 || index === 3;

                  return (
                    <Link
                      key={product.id}
                      href={`/products/${product.slug}`}
                      className={`group relative rounded-2xl overflow-hidden bg-white shadow-sm hover:shadow-2xl transition-all duration-500 ${
                        isLarge ? "md:col-span-7" : "md:col-span-5"
                      }`}
                    >
                      <div
                        className={`relative overflow-hidden ${
                          isLarge ? "h-64 md:h-80" : "h-56 md:h-72"
                        }`}
                      >
                        {firstImage && isUrl ? (
                          <Image
                            src={firstImage}
                            alt={product.name}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-700"
                            sizes="(max-width: 768px) 100vw, 60vw"
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-primary-50 to-pink-50 flex items-center justify-center text-7xl">
                            {firstImage || "🍰"}
                          </div>
                        )}

                        {/* Bottom gradient */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/20 to-transparent"></div>

                        {/* Category pill */}
                        <div className="absolute top-4 left-4">
                          <span className="bg-white/95 backdrop-blur text-[#4A2C2A] text-xs font-semibold px-3 py-1.5 rounded-full shadow-sm">
                            {product.category.name}
                          </span>
                        </div>

                        {/* Bottom info */}
                        <div className="absolute bottom-0 left-0 right-0 p-5">
                          <div className="flex items-center gap-0.5 mb-1">
                            {[...Array(5)].map((_, j) => (
                              <Star
                                key={j}
                                className="h-3.5 w-3.5 text-yellow-400 fill-current"
                              />
                            ))}
                          </div>
                          <h3 className="text-white font-bold text-xl group-hover:text-[#FF6B9D] transition-colors">
                            {product.name}
                          </h3>
                          <div className="flex items-center justify-between mt-2">
                            <span className="text-white font-bold text-xl">
                              {formatPrice(product.price)}
                            </span>
                            <span className="bg-[#df3526] text-white text-xs font-semibold px-3 py-1.5 rounded-full opacity-0 -translate-y-1 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
                              Add to Cart →
                            </span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        </section>

        {/* ─── OUR STORY ─── */}
        <section className="py-24 bg-white">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">
              {/* Image */}
              <div className="relative">
                <div className="absolute -top-4 -left-4 w-24 h-24 bg-[#df3526]/10 rounded-2xl"></div>
                <div className="relative h-96 lg:h-[480px] rounded-3xl overflow-hidden shadow-xl">
                  <Image
                    src="/b4.png"
                    alt="Our Bakery"
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 50vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/25 to-transparent"></div>
                </div>
                {/* Floating stat */}
                <div className="absolute -bottom-5 -right-5 lg:-right-8 bg-white rounded-2xl shadow-xl p-5 border border-gray-100">
                  <p className="text-3xl font-bold text-[#4A2C2A]">10+</p>
                  <p className="text-xs text-gray-500 mt-0.5">Years of Baking</p>
                </div>
              </div>

              {/* Text */}
              <div className="space-y-6">
                <p className="text-[#df3526] text-sm font-semibold tracking-widest uppercase">
                  About Us
                </p>
                <h2 className="text-4xl md:text-5xl font-bold text-[#4A2C2A] leading-[1.15]">
                  The Story Behind<br />Every Sweet Bite
                </h2>
                <p className="text-gray-600 text-lg leading-relaxed">
                  Mr.Cake was born from a simple passion — creating joy through
                  baking. What began in a tiny home kitchen has grown into
                  Bangalore's most beloved bakery, serving over 500 happy
                  customers every day.
                </p>
                <p className="text-gray-500 leading-relaxed">
                  Every single item is crafted by hand using premium ingredients,
                  traditional recipes, and an abundance of love. We believe great
                  baking isn't just food — it's a feeling.
                </p>

                {/* Stats */}
                <div className="flex gap-10 border-t border-gray-100 pt-6">
                  {[
                    { num: "500+", label: "Happy Customers" },
                    { num: "1K+", label: "Cakes Delivered" },
                    { num: "24/7", label: "Always Fresh" },
                  ].map((s) => (
                    <div key={s.label}>
                      <p className="text-2xl font-bold text-[#4A2C2A]">
                        {s.num}
                      </p>
                      <p className="text-xs text-gray-500 mt-0.5">{s.label}</p>
                    </div>
                  ))}
                </div>

                <Link
                  href="/about"
                  className="group inline-flex items-center gap-2 bg-[#4A2C2A] hover:bg-[#3d2422] text-white px-8 py-4 rounded-full font-semibold shadow-lg transition-all active:scale-95"
                >
                  Our Story
                  <ChevronRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* ─── TESTIMONIALS ─── */}
        <section className="py-24 bg-[#1a0f0e]">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-14">
              <p className="text-[#df3526] text-sm font-semibold tracking-widest uppercase">
                Reviews
              </p>
              <h2 className="text-4xl md:text-5xl font-bold text-white mt-2">
                What Our Customers Say
              </h2>
              <p className="text-gray-500 mt-4 max-w-xl mx-auto">
                Don't just take our word for it — here's what our cake lovers
                have to say
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {[
                {
                  name: "Priya Sharma",
                  role: "Food Blogger",
                  initials: "PS",
                  text: 'The chocolate truffle cake was absolutely divine! Moist, rich, and perfectly balanced. My entire family couldn\'t stop eating it. Best bakery in Bangalore!',
                },
                {
                  name: "Rahul Mehta",
                  role: "Event Planner",
                  initials: "RM",
                  text: "I've ordered custom cakes for over 15 events now. The quality is consistently amazing and delivery is always on time. Mr.Cake is my go-to!",
                },
                {
                  name: "Sneha Jayakumar",
                  role: "Home Baker",
                  initials: "SJ",
                  text: "As someone who bakes professionally, I'm genuinely impressed by their pastries. The croissants are flaky, buttery perfection. Truly world-class!",
                },
              ].map((review, i) => (
                <div
                  key={i}
                  className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-colors"
                >
                  <div className="flex gap-1 mb-4">
                    {[...Array(5)].map((_, j) => (
                      <Star
                        key={j}
                        className="h-4 w-4 text-yellow-400 fill-current"
                      />
                    ))}
                  </div>
                  <p className="text-gray-400 leading-relaxed text-sm mb-6">
                    &quot;{review.text}&quot;
                  </p>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#df3526] to-[#FF6B9D] flex items-center justify-center">
                      <span className="text-white text-xs font-bold">
                        {review.initials}
                      </span>
                    </div>
                    <div>
                      <p className="text-white font-semibold text-sm">
                        {review.name}
                      </p>
                      <p className="text-gray-600 text-xs">{review.role}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ─── NEWSLETTER ─── */}
        <section className="relative py-24 bg-[#FFF8F0] overflow-hidden">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#df3526]/10 rounded-full blur-3xl pointer-events-none"></div>

          <div className="relative z-10 mx-auto max-w-2xl px-4 sm:px-6 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#df3526]/10 text-[#df3526] text-sm font-medium mb-6">
              <Mail className="h-4 w-4" />
              Newsletter
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-[#4A2C2A] mb-4">
              Stay In The<br />
              <span className="text-[#df3526]">Sweet Loop</span>
            </h2>
            <p className="text-gray-500 text-lg mb-8 max-w-md mx-auto">
              Get exclusive offers, new recipe reveals & sweet surprises. Join
              500+ cake lovers!
            </p>

            <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-5 py-4 rounded-full border border-gray-200 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-[#df3526]/40 focus:border-transparent text-gray-700 placeholder-gray-400"
              />
              <button className="bg-[#df3526] hover:bg-[#c42e1f] text-white px-8 py-4 rounded-full font-semibold shadow-lg shadow-[#df3526]/25 hover:shadow-[#df3526]/40 transition-all active:scale-95 whitespace-nowrap">
                Subscribe
              </button>
            </div>

            <div className="flex items-center justify-center gap-2 mt-4">
              <Check className="h-4 w-4 text-green-500" />
              <p className="text-sm text-gray-500">
                No spam, ever. Unsubscribe anytime.
              </p>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
