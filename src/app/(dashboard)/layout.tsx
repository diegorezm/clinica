import Navigation from "@/components/navigation";
import AuthProvider from "@/providers/auth-providers";
import SheetProvider from "@/providers/sheet-providers";
import { ReactNode } from "react";

export default function DashboardLayout({
  children,
}: {
  children?: ReactNode;
}) {
  return (
    <AuthProvider>
      <main className="lg:flex space-y-2 w-full">
        <Navigation />
        <section className="flex justify-center w-full px-2">
          {children}
        </section>
        <SheetProvider />
      </main>
    </AuthProvider>
  );
}
