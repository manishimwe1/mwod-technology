"use client";

import * as React from "react";
import { type Icon } from "@tabler/icons-react";
import Link from "next/link"; // Import Link for client-side navigation

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar, // Assuming this hook exists in your sidebar components
} from "@/components/ui/sidebar";
// Removed: import { SidebarClose } from "lucide-react"; // This was an icon, not a functional component

export function NavSecondary({
  items,
  ...props
}: {
  items: {
    title: string;
    url: string;
    icon: Icon;
  }[];
} & React.ComponentPropsWithoutRef<typeof SidebarGroup>) {
  const { setOpen } = useSidebar(); // Assuming useSidebar provides setOpen to control sidebar visibility

  return (
    <SidebarGroup {...props}>
      <SidebarGroupContent>
        <SidebarMenu>
          {items.map((item) => (
            <SidebarMenuItem key={item.title}>
              {/* The SidebarClose from lucide-react was an icon, not a functional component.
                  We need to explicitly close the sidebar when a menu item is clicked. */}
              <SidebarMenuButton asChild onClick={() => setOpen(false)}>
                <Link href={item.url}>
                  <item.icon />
                  <span>{item.title}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
