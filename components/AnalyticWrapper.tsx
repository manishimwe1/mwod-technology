// components/AnalyticsWrapper.tsx
"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";

function getOrCreateAnonymousId(): string {
  if (typeof window === "undefined") return "";
  let anonId = localStorage.getItem("anon_id");
  if (!anonId) {
    anonId = crypto.randomUUID();
    localStorage.setItem("anon_id", anonId);
  }
  return anonId;
}

export default function AnalyticsWrapper() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const updateOrCreateVisit = useMutation(api.analytics.updateOrCreateVisit);

  const lastPathRef = useRef<string | null>(null);

  useEffect(() => {
    if (!pathname || lastPathRef.current === pathname) return;
    lastPathRef.current = pathname;

    const sendVisit = async () => {
      try {
        const anonId = !session?.user?.id ? getOrCreateAnonymousId() : undefined;

        const res = await fetch("https://ipapi.co/json/");
        const data = await res.json();
        const country = data?.country_name ?? "Unknown";

        await updateOrCreateVisit({
          userId: session?.user?.id,
          anonymousId: anonId,
          path: pathname,
          userAgent: navigator.userAgent,
          country,
        });
      } catch (err) {
        console.error("Analytics log failed:", err);
      }
    };

    // Small delay to avoid premature firing
    const timer = setTimeout(sendVisit, 800);
    return () => clearTimeout(timer);
  }, [pathname, session?.user?.id, updateOrCreateVisit]);

  return null;
}
