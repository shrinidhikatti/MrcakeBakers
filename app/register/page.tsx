"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AlertCircle, Loader2, CheckCircle } from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    birthday: "",
  });
  const [specialDays, setSpecialDays] = useState<Array<{ name: string; date: string; type: string; relationship: string }>>([]);
  const [newSpecialDay, setNewSpecialDay] = useState({ name: "", date: "", type: "BIRTHDAY", relationship: "Mother" });
  const [showSpecialDay, setShowSpecialDay] = useState(false);

  const fmtDate = (d: string) => new Date(d + "T00:00:00").toLocaleDateString("en-IN", { month: "short", day: "numeric" });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          specialDays,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Registration failed");
      }

      // Redirect to login
      router.push("/login");
    } catch (err: any) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 via-pink-50 to-orange-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center space-x-2">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-primary-500 to-primary-700 text-white font-bold text-xl shadow-lg">
              MC
            </div>
            <span className="text-2xl font-bold text-bakery-chocolate">
              Mr<span className="text-primary-600">.Cake</span>
            </span>
          </Link>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8 space-y-6">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-bakery-chocolate">Create Account</h2>
            <p className="mt-2 text-sm text-gray-600">
              Join us and start ordering delicious treats
            </p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center gap-2">
              <AlertCircle className="h-5 w-5 flex-shrink-0" />
              <p className="text-sm">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Full Name
              </label>
              <input
                id="name"
                type="text"
                required
                className="input"
                placeholder="John Doe"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                required
                className="input"
                placeholder="you@example.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>

            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                Phone Number
              </label>
              <input
                id="phone"
                type="tel"
                className="input"
                placeholder="+91 98765 43210"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              />
            </div>

            <div>
              <label htmlFor="birthday" className="block text-sm font-medium text-gray-700 mb-1">
                Birthday <span className="text-gray-400 font-normal">(Optional)</span>
              </label>
              <input
                id="birthday"
                type="date"
                className="input"
                value={formData.birthday}
                onChange={(e) => setFormData({ ...formData, birthday: e.target.value })}
              />
              <p className="mt-1 text-xs text-gray-500">We'll send you a special wish on your birthday! 🎂</p>
            </div>

            <div>
              <button
                type="button"
                onClick={() => setShowSpecialDay(!showSpecialDay)}
                className="flex items-center gap-1.5 text-sm text-primary-600 hover:text-primary-700 font-medium"
              >
                <span>{showSpecialDay ? "▾" : "▸"}</span>
                Add a loved one's special day
              </button>

              {showSpecialDay && (
                <div className="mt-3 space-y-3 border border-gray-200 rounded-lg p-4 bg-gray-50">
                  <div className="bg-pink-50 border border-pink-200 rounded-lg p-2.5">
                    <p className="text-xs text-pink-700">
                      💝 You may forget, but we never forget! We'll remind you about your
                      loved ones' birthdays and anniversaries so you never miss celebrating
                      with a sweet treat from Mr.Cake!
                    </p>
                  </div>

                  {/* Already added loved ones */}
                  {specialDays.length > 0 && (
                    <div className="space-y-2">
                      {specialDays.map((day, i) => (
                        <div key={i} className="flex items-center justify-between bg-white border border-gray-200 rounded-lg px-3 py-2">
                          <div>
                            <p className="text-sm font-medium text-bakery-chocolate">{day.name}</p>
                            <p className="text-xs text-gray-500">
                              {day.relationship} &middot; {day.type === "BIRTHDAY" ? "🎂 Birthday" : day.type === "ANNIVERSARY" ? "💐 Anniversary" : "🌟 Other"} &middot; {fmtDate(day.date)}
                            </p>
                          </div>
                          <button
                            type="button"
                            onClick={() => setSpecialDays(specialDays.filter((_, idx) => idx !== i))}
                            className="text-gray-400 hover:text-red-500 text-lg leading-none"
                          >
                            ✕
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Form for new entry */}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">Name</label>
                      <input
                        type="text"
                        className="input"
                        placeholder="e.g. Mum"
                        value={newSpecialDay.name}
                        onChange={(e) => setNewSpecialDay({ ...newSpecialDay, name: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">Date</label>
                      <input
                        type="date"
                        className="input"
                        value={newSpecialDay.date}
                        onChange={(e) => setNewSpecialDay({ ...newSpecialDay, date: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">Type</label>
                      <select
                        className="input"
                        value={newSpecialDay.type}
                        onChange={(e) => setNewSpecialDay({ ...newSpecialDay, type: e.target.value })}
                      >
                        <option value="BIRTHDAY">Birthday</option>
                        <option value="ANNIVERSARY">Anniversary</option>
                        <option value="OTHER">Other</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">Relationship</label>
                      <select
                        className="input"
                        value={newSpecialDay.relationship}
                        onChange={(e) => setNewSpecialDay({ ...newSpecialDay, relationship: e.target.value })}
                      >
                        <option value="Mother">Mother</option>
                        <option value="Father">Father</option>
                        <option value="Brother">Brother</option>
                        <option value="Sister">Sister</option>
                        <option value="Wife">Wife</option>
                        <option value="Husband">Husband</option>
                        <option value="Son">Son</option>
                        <option value="Daughter">Daughter</option>
                        <option value="Grandparent">Grandparent</option>
                        <option value="Friend">Friend</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                  </div>

                  {/* Add to list button */}
                  <button
                    type="button"
                    onClick={() => {
                      if (newSpecialDay.name && newSpecialDay.date) {
                        setSpecialDays([...specialDays, newSpecialDay]);
                        setNewSpecialDay({ name: "", date: "", type: "BIRTHDAY", relationship: "Mother" });
                      }
                    }}
                    disabled={!newSpecialDay.name || !newSpecialDay.date}
                    className="w-full text-sm font-medium text-primary-600 border border-primary-300 rounded-lg py-1.5 hover:bg-primary-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                  >
                    + Add to list
                  </button>

                  <p className="text-xs text-gray-500">
                    You can also add or manage your loved ones' special days anytime from the <span className="font-medium">Profile</span> menu after creating your account.
                  </p>
                </div>
              )}
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <input
                id="password"
                type="password"
                required
                minLength={6}
                className="input"
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              />
              <p className="mt-1 text-xs text-gray-500">At least 6 characters</p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary flex items-center justify-center"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin h-5 w-5 mr-2" />
                  Creating account...
                </>
              ) : (
                "Create Account"
              )}
            </button>
          </form>

          <div className="text-center">
            <p className="text-sm text-gray-600">
              Already have an account?{" "}
              <Link href="/login" className="font-medium text-primary-600 hover:text-primary-700">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
