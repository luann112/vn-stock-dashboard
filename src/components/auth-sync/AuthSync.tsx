"use client";

import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { setAuthToken } from "@/lib/api";

/**
 * Invisible component that syncs the NextAuth session token
 * into the module-level cache used by authedFetcher.
 *
 * Replaces the old pattern of calling getSession() on every
 * SWR fetch (each call was an HTTP roundtrip to /api/auth/session).
 */
export function AuthSync() {
  const { data: session } = useSession();

  useEffect(() => {
    setAuthToken(session?.user?.accessToken ?? null);
  }, [session?.user?.accessToken]);

  return null;
}
