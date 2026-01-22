import { auth } from "@/auth";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Award, Heart, Users, Clock } from "lucide-react";

export default async function AboutPage() {
  const session = await auth();

  return (
    <div className="min-h-screen flex flex-col">
      <Header user={session?.user} />

      <main className="flex-grow">
        <div className="bg-gradient-to-r from-primary-600 to-pink-600 text-white py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">About Mr.Cake</h1>
            <p className="text-xl text-primary-100">
              Baking happiness since 2020
            </p>
          </div>
        </div>

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20">
          {/* Story */}
          <div className="text-center max-w-3xl mx-auto space-y-6 mb-20">
            <div className="text-6xl mb-6">🎂</div>
            <h2 className="text-3xl font-bold text-bakery-chocolate">Our Story</h2>
            <p className="text-lg text-gray-600">
              Mr.Cake was born from a passion for creating delicious, artisan baked goods
              that bring joy to every celebration. What started as a small home bakery has
              grown into a beloved local brand, serving fresh cakes, pastries, breads, and
              cookies to our wonderful community.
            </p>
            <p className="text-lg text-gray-600">
              Every item we create is made with premium ingredients, traditional techniques,
              and lots of love. We believe in the power of fresh-baked goods to create
              special moments and lasting memories.
            </p>
          </div>

          {/* Values */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 mx-auto bg-primary-100 rounded-full flex items-center justify-center">
                <Heart className="h-8 w-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold text-bakery-chocolate">Made with Love</h3>
              <p className="text-gray-600">
                Every product is crafted with care and attention to detail
              </p>
            </div>

            <div className="text-center space-y-4">
              <div className="w-16 h-16 mx-auto bg-primary-100 rounded-full flex items-center justify-center">
                <Award className="h-8 w-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold text-bakery-chocolate">Premium Quality</h3>
              <p className="text-gray-600">
                Only the finest ingredients make it into our recipes
              </p>
            </div>

            <div className="text-center space-y-4">
              <div className="w-16 h-16 mx-auto bg-primary-100 rounded-full flex items-center justify-center">
                <Clock className="h-8 w-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold text-bakery-chocolate">Always Fresh</h3>
              <p className="text-gray-600">
                Baked fresh daily and delivered the same day
              </p>
            </div>

            <div className="text-center space-y-4">
              <div className="w-16 h-16 mx-auto bg-primary-100 rounded-full flex items-center justify-center">
                <Users className="h-8 w-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold text-bakery-chocolate">Community First</h3>
              <p className="text-gray-600">
                Serving our local community with pride and dedication
              </p>
            </div>
          </div>

          {/* CTA */}
          <div className="bg-bakery-cream rounded-3xl p-12 text-center">
            <h2 className="text-3xl font-bold text-bakery-chocolate mb-4">
              Join Our Sweet Journey
            </h2>
            <p className="text-lg text-gray-600 mb-8">
              Experience the difference of artisan baked goods
            </p>
            <a href="/products" className="btn-primary">
              Shop Now
            </a>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
