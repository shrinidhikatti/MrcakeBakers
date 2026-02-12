import { auth } from "@/auth";
import { redirect } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import LoyaltyDashboard from "@/components/LoyaltyDashboard";
import { Award } from "lucide-react";

export default async function LoyaltyPage() {
  const session = await auth();

  if (!session) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen flex flex-col bg-bakery-cream">
      <Header user={session.user} />

      <main className="flex-grow py-12">
        <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 mb-8">
            <Award className="h-8 w-8 text-primary-600" />
            <div>
              <h1 className="text-3xl font-bold text-bakery-chocolate">
                Loyalty Rewards
              </h1>
              <p className="text-gray-600">
                Earn points on every order and unlock exclusive rewards
              </p>
            </div>
          </div>

          <LoyaltyDashboard />
        </div>
      </main>

      <Footer />
    </div>
  );
}
