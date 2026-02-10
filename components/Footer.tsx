import Link from "next/link";
import { Facebook, Instagram, Twitter, Mail, Phone, MapPin } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-bakery-chocolate text-white mt-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-primary-500 to-primary-700 font-bold">
                MC
              </div>
              <span className="text-xl font-bold">Mr.Cake</span>
            </div>
            <p className="text-sm text-gray-300">
              Crafting delicious moments with fresh, artisan baked goods delivered to your door.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="hover:text-primary-400 transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="hover:text-primary-400 transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="hover:text-primary-400 transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/products" className="text-sm text-gray-300 hover:text-primary-400">
                  Our Products
                </Link>
              </li>
              <li>
                <Link href="/menu" className="text-sm text-gray-300 hover:text-primary-400">
                  Menu
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-sm text-gray-300 hover:text-primary-400">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-sm text-gray-300 hover:text-primary-400">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Customer Service</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/profile" className="text-sm text-gray-300 hover:text-primary-400">
                  My Account
                </Link>
              </li>
              <li>
                <Link href="/cart" className="text-sm text-gray-300 hover:text-primary-400">
                  Shopping Cart
                </Link>
              </li>
              <li>
                <Link href="/wishlist" className="text-sm text-gray-300 hover:text-primary-400">
                  Wishlist
                </Link>
              </li>
              <li>
                <a href="#" className="text-sm text-gray-300 hover:text-primary-400">
                  FAQs
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-start space-x-2 text-sm text-gray-300">
                <MapPin className="h-5 w-5 flex-shrink-0 text-primary-400" />
                <span>123 Bakery Street, Karnataka, India 560001</span>
              </li>
              <li className="flex items-center space-x-2 text-sm text-gray-300">
                <Phone className="h-5 w-5 text-primary-400" />
                <span>+91 98765 43210</span>
              </li>
              <li className="flex items-center space-x-2 text-sm text-gray-300">
                <Mail className="h-5 w-5 text-primary-400" />
                <span>hello@mrcake.com</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-8 text-center text-sm text-gray-400">
          <p>
            &copy; {new Date().getFullYear()} Mr.Cake. All rights reserved. Made with ❤️ by{' '}
            <a
              href="https://www.prashanvitech.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary-400 hover:text-primary-300 transition-colors underline decoration-dotted"
            >
              Shrinidhi Katti
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
