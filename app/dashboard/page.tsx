// 'use client'

// import { useQuery } from "convex/react";
// import { useStoreUserEffect } from "@/lib/hooks/useStoreUserEffect";
// import { SignInButton, UserButton } from "@clerk/nextjs";
// import { api } from "@/convex/_generated/api";

// function App() {
//   const { isLoading, isAuthenticated } = useStoreUserEffect();
//   return (
//     <main>
//       {isLoading ? (
//         <>Loading...</>
//       ) : !isAuthenticated ? (
//         <SignInButton />
//       ) : (
//         <>
//           <UserButton />
//           <Content />
//         </>
//       )}
//     </main>
//   );
// }

// function Content() {
//   const users = useQuery(api.users.getForCurrentUser);
//   return <div>Authenticated content: {users?.name}</div>;
// }

// export default App;


import { AppSidebar } from "@/components/app-sidebar"
import { ChartAreaInteractive } from "@/components/chart-area-interactive"
import { DataTable } from "@/components/data-table"
import { SectionCards } from "@/components/section-cards"
import { SiteHeader } from "@/components/site-header"
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"

import data from "./data.json"

export default function Page() {
  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
              <SectionCards />
              <div className="px-4 lg:px-6">
                <ChartAreaInteractive />
              </div>
              <DataTable data={data} />
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
