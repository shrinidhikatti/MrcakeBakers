import { auth } from "@/auth";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Mail, Phone, MapPin, Clock } from "lucide-react";

export default async function ContactPage() {
  const session = await auth();

  return (
    <div className="min-h-screen flex flex-col">
      <Header user={session?.user} />

      <main className="flex-grow">
        <div
          className="relative text-white py-16 bg-cover bg-center"
          style={{ backgroundImage: "url('/b6.png')" }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 to-black/55"></div>
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center relative z-10">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 drop-shadow-lg">Contact Us</h1>
            <div className="mt-3 mx-auto w-16 h-1 bg-white rounded-full opacity-80"></div>
            <p className="text-xl text-white/90 mt-4 drop-shadow">
              We'd love to hear from you
            </p>
          </div>
        </div>

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20">
          <div className="grid md:grid-cols-2 gap-12">
            {/* Contact Info */}
            <div className="space-y-8">
              <div>
                <h2 className="text-3xl font-bold text-bakery-chocolate mb-3">
                  Get In Touch
                </h2>
                <div className="w-16 h-1 bg-primary-600 rounded-full mb-6"></div>
                <p className="text-lg text-gray-600 mb-8">
                  Have a question or special request? We're here to help! Reach out
                  through any of the channels below.
                </p>
              </div>

              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-primary-100 to-pink-100 rounded-full flex items-center justify-center flex-shrink-0 shadow-sm">
                    <Phone className="h-6 w-6 text-primary-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-bakery-chocolate mb-1">Phone</h3>
                    <p className="text-gray-600">+91 98765 43210</p>
                    <p className="text-sm text-gray-500">Mon-Sat, 9 AM - 8 PM</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-primary-100 to-pink-100 rounded-full flex items-center justify-center flex-shrink-0 shadow-sm">
                    <Mail className="h-6 w-6 text-primary-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-bakery-chocolate mb-1">Email</h3>
                    <p className="text-gray-600">hello@mrcake.com</p>
                    <p className="text-sm text-gray-500">We'll reply within 24 hours</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-primary-100 to-pink-100 rounded-full flex items-center justify-center flex-shrink-0 shadow-sm">
                    <MapPin className="h-6 w-6 text-primary-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-bakery-chocolate mb-1">Location</h3>
                    <p className="text-gray-600">123 Bakery Street</p>
                    <p className="text-gray-600">Bangalore, Karnataka 560001</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-primary-100 to-pink-100 rounded-full flex items-center justify-center flex-shrink-0 shadow-sm">
                    <Clock className="h-6 w-6 text-primary-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-bakery-chocolate mb-1">Hours</h3>
                    <p className="text-gray-600">Monday - Saturday: 8 AM - 8 PM</p>
                    <p className="text-gray-600">Sunday: 9 AM - 6 PM</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
              <h3 className="text-2xl font-bold text-bakery-chocolate mb-6">
                Send Us a Message
              </h3>
              <form className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                    Your Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    className="input"
                    placeholder="John Doe"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    className="input"
                    placeholder="john@example.com"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    className="input"
                    placeholder="+91 98765 43210"
                  />
                </div>

                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
                    Subject
                  </label>
                  <input
                    type="text"
                    id="subject"
                    className="input"
                    placeholder="Custom cake order"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                    Message
                  </label>
                  <textarea
                    id="message"
                    rows={5}
                    className="input"
                    placeholder="Tell us about your requirements..."
                    required
                  />
                </div>

                <button type="submit" className="w-full btn-primary">
                  Send Message
                </button>

                <p className="text-sm text-gray-500 text-center">
                  We'll get back to you as soon as possible
                </p>
              </form>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
