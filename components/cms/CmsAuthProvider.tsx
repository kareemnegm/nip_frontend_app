"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import type { StaffUser } from "@/lib/api/cms-auth";

type CmsAuthState = {
  canEdit: boolean;
  role: string | null;
  user: StaffUser | null;
  loading: boolean;
  refresh: () => Promise<void>;
};

const CmsAuthContext = createContext<CmsAuthState>({
  canEdit: false,
  role: null,
  user: null,
  loading: true,
  refresh: async () => {},
});

export function CmsAuthProvider({ children }: { children: React.ReactNode }) {
  const [canEdit, setCanEdit] = useState(false);
  const [role, setRole] = useState<string | null>(null);
  const [user, setUser] = useState<StaffUser | null>(null);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    try {
      const res = await fetch("/api/cms/me", { credentials: "same-origin" });
      if (!res.ok) {
        setCanEdit(false);
        setRole(null);
        setUser(null);
        return;
      }
      const data = (await res.json()) as {
        canEdit?: boolean;
        role?: string | null;
        user?: StaffUser | null;
      };
      setCanEdit(Boolean(data.canEdit));
      setRole(data.role ?? null);
      setUser(data.user ?? null);
    } catch {
      setCanEdit(false);
      setRole(null);
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const controller = new AbortController();

    fetch("/api/cms/me", { credentials: "same-origin", signal: controller.signal })
      .then(async (res) => {
        if (!res.ok) {
          setCanEdit(false);
          setRole(null);
          setUser(null);
          return;
        }
        const data = (await res.json()) as {
          canEdit?: boolean;
          role?: string | null;
          user?: StaffUser | null;
        };
        setCanEdit(Boolean(data.canEdit));
        setRole(data.role ?? null);
        setUser(data.user ?? null);
      })
      .catch((error: unknown) => {
        if (error instanceof DOMException && error.name === "AbortError") {
          return;
        }
        setCanEdit(false);
        setRole(null);
        setUser(null);
      })
      .finally(() => {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      });

    return () => {
      controller.abort();
    };
  }, []);

  const value = useMemo(
    () => ({ canEdit, role, user, loading, refresh }),
    [canEdit, role, user, loading, refresh],
  );

  return <CmsAuthContext.Provider value={value}>{children}</CmsAuthContext.Provider>;
}

export function useCanEditCms(): CmsAuthState {
  return useContext(CmsAuthContext);
}
