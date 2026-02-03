import DeliveryHeader from "@/components/DeliveryHeader";

export default function DeliveryLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-50">
      <DeliveryHeader />
      {children}
    </div>
  );
}
