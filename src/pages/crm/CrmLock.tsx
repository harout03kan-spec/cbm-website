import { useState } from "react";
import { Lock } from "lucide-react";

// Client-side lock screen for /crm.
//
// IMPORTANT: this is obfuscation, not real authentication. The bundle ships
// to the browser, so a determined user can bypass it. It exists only to keep
// the CRM from being casually public / indexed. For real protection, put the
// CRM behind a server-side auth layer (e.g. Supabase/Firebase, already in the
// project's dependencies).
//
// The real passcode is NEVER stored here. We store only the SHA-256 hash of
// the passcode and compare hashes. Override the hash via the env var
// VITE_CRM_PASSCODE_HASH (set in a gitignored .env.local). If unset, the
// default passcode below is used.
//
// Default passcode: "123"
const DEFAULT_HASH =
  "a665a45920422f9d417e4867efdc4fb8a04a1f3fff1fa07e998e86f7f7a27ae3";

const STORED_HASH = (
  (import.meta.env.VITE_CRM_PASSCODE_HASH as string | undefined) || DEFAULT_HASH
)
  .trim()
  .toLowerCase();

const UNLOCK_KEY = "cbm-crm-unlocked";

async function sha256Hex(input: string): Promise<string> {
  const data = new TextEncoder().encode(input);
  const digest = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export function isUnlocked(): boolean {
  try {
    return sessionStorage.getItem(UNLOCK_KEY) === "1";
  } catch {
    return false;
  }
}

export function setUnlocked(v: boolean): void {
  try {
    if (v) sessionStorage.setItem(UNLOCK_KEY, "1");
    else sessionStorage.removeItem(UNLOCK_KEY);
  } catch {
    /* ignore */
  }
}

export default function CrmLock({ onUnlock }: { onUnlock: () => void }) {
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      const hash = await sha256Hex(code);
      if (hash === STORED_HASH) {
        setUnlocked(true);
        onUnlock();
      } else {
        setError("Incorrect passcode.");
      }
    } catch {
      setError("Could not verify passcode in this browser.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div
      className="min-h-screen bg-neutral-950 text-slate-200 flex items-center justify-center px-4"
      style={{ fontFamily: "system-ui, sans-serif" }}
    >
      <form
        onSubmit={submit}
        className="w-full max-w-sm bg-neutral-900/60 border border-neutral-800 rounded-2xl p-7 shadow-xl shadow-black/40 space-y-5"
      >
        <div className="flex flex-col items-center text-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-red-600 text-white font-bold flex items-center justify-center text-base shadow-lg shadow-red-900/30">
            CBM
          </div>
          <div>
            <div className="font-semibold text-white leading-tight">
              Canada Bitcoin Miners CRM
            </div>
            <div className="mt-1 text-xs text-neutral-500 flex items-center justify-center gap-1.5">
              <Lock size={12} /> Secure access
            </div>
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs text-neutral-400">Enter passcode</label>
          <input
            type="password"
            inputMode="numeric"
            autoFocus
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="••••"
            className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2.5 text-sm text-white tracking-widest outline-none focus:border-red-600 focus:ring-1 focus:ring-red-600/40"
          />
          {error && <div className="text-sm text-red-400">{error}</div>}
        </div>

        <button
          type="submit"
          disabled={busy || !code}
          className="w-full bg-red-600 text-white px-4 py-2.5 rounded-xl text-sm font-medium hover:bg-red-500 disabled:opacity-50 transition"
        >
          {busy ? "Checking…" : "Unlock CRM"}
        </button>
      </form>
    </div>
  );
}
