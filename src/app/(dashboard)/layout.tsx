import Navigation from "@/components/navigation";
import SheetProvider from "@/providers/sheet-providers";
import { ReactNode } from "react";

export default function DashboardLayout({
  children,
}: {
  children?: ReactNode;
}) {
  return (
    <main className="space-y-2">
      <Navigation />
      <section className="flex items-center justify-center w-full px-2">
        {children}
      </section>
      <SheetProvider />
    </main>
  );
}
