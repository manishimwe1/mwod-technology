"use client";

import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const session = useSession();
  const router = useRouter();

  const  user  = useQuery(api.users.getUserByEmail, session.data?.user ? {
    email: session?.data?.user?.email || '',
  } :'skip');

  useEffect(() => {
    // Handle loading states for both NextAuth session and Convex user data
    if (session.status === "loading" ) {
      return; // Do nothing while loading
    }

    // If not authenticated via NextAuth, redirect to login
    if (session.status === "unauthenticated") {
      router.push('/login');
      return;
    }

    // If authenticated via NextAuth but no user found in Convex (e.g., user not yet created in Convex)
    // This might need more specific handling depending on your user creation flow.
    // For now, as a fallback, redirect to login.
    if (session.status === "authenticated" && !user) {
      router.push('/login');
      return;
    }

    // Authorization check: if user is not an admin, redirect to home page
    if (user?.role !== 'admin') {
      router.push('/dashboard');
      return;
    }else{
      router.push('/')
    }
  }, [session, user, router]);

  // Render nothing while loading to prevent content flickering before redirects
  if (session.status === "loading" ) {
    return null;
  }

  // If all conditions pass, render the dashboard layout
  return (
    <SidebarProvider
      style={{
        "--sidebar-width": "calc(var(--spacing) * 72)",
        "--header-height": "calc(var(--spacing) * 12)",
      } as React.CSSProperties}
    >
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />
        <main className="min-h-screen  justify-start py-10 items-start w-full">
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
