"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { TextInput } from "@/components/ui/FormControls";
import { localizedHref } from "@/lib/i18n/helpers";
import type { Locale } from "@/lib/i18n/config";
import Link from "next/link";

export function PrivateOfficeLoginForm({ locale }: { locale: Locale }) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch("/api/member/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.message ?? "Sign in failed");
        return;
      }
      router.push(localizedHref(locale, "/private-office/member"));
      router.refresh();
    } catch {
      setError("Sign in failed. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <form className="mt-8 space-y-4" onSubmit={onSubmit}>
        <TextInput
          label="Email"
          type="email"
          placeholder="you@email.com"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          required
        />
        <TextInput
          label="Password"
          type="password"
          placeholder="••••••••"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          required
        />
        {error ? (
          <p className="text-sm text-error" role="alert">
            {error}
          </p>
        ) : null}
        <div className="flex justify-center pt-2">
          <Button type="submit" disabled={loading}>
            {loading ? "Signing in…" : "Sign In"}
          </Button>
        </div>
      </form>

      <p className="mt-6 text-center text-sm text-brand">
        <Link href={localizedHref(locale, "/contact")} className="hover:underline">
          Request access
        </Link>
        <span className="mx-2 text-ink-tertiary">|</span>
        <Link href={localizedHref(locale, "/contact")} className="hover:underline">
          Forgot password?
        </Link>
      </p>
    </>
  );
}
