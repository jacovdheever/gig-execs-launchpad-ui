import { AppHeader } from "@/components/header/AppHeader";

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-white">
      <AppHeader />
      <main>{children}</main>
    </div>
  );
}
