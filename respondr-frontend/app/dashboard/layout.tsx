'use client';

import { useAuth } from '@/lib/auth-context';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { LogOut, MapPin } from 'lucide-react';
import { AppSidebar } from '@/components/app-sidebar';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAuthenticated, user, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, router]);

  if (!isAuthenticated || !user) return null;

  return (
    <SidebarProvider>
      <div className="flex min-h-screen bg-gray-50">
        <AppSidebar />
        <div className="flex-1">
          <header className="sticky top-0 z-40 flex h-16 items-center gap-4 border-b bg-white/90 backdrop-blur-md px-6 shadow-sm">
            <SidebarTrigger />
            <div className="flex items-center gap-2">
              <div className="relative h-8 w-8 rounded-full bg-red-600">
                <div className="absolute inset-0 flex items-center justify-center text-white font-bold">
                  {user.name?.charAt(0).toUpperCase() || 'R'}
                </div>
              </div>
              <Link href="/dashboard" className="text-xl font-bold text-red-600">
                Respondr
              </Link>
            </div>
            <div className="ml-auto flex items-center gap-4">
              <span className="text-sm text-gray-600">Role: {user?.role}</span>
              <Button
                onClick={logout}
                variant="outline"
                className="border-red-600 text-red-600 hover:bg-red-50 hover:text-red-700 rounded-lg transition-all duration-200 flex items-center gap-2"
              >
                <LogOut className="h-5 w-5" />
                Logout
              </Button>
            </div>
          </header>
          <main className="flex-1 p-6 max-w-7xl mx-auto">{children}</main>
        </div>
      </div>
    </SidebarProvider>
  );
}
