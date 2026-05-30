import { useState } from "react";

// Simple client-side lock screen for /crm.
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
// default sample passcode below is used.
//
// Default sample passcode: "sample-crm-pass"
const DEFAULT_HASH =
  "fc4ea740702653c99ceba2dab2424b1e51feda096f5f8f35dfee01c013f3c7a4";

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
        try {
          sessionStorage.setItem(UNLOCK_KEY, "1");
        } catch {
          /* ignore */
        }
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
      className="min-h-screen bg-black text-slate-200 flex items-center justify-center px-4"
      style={{ fontFamily: "system-ui, sans-serif" }}
    >
      <form
        onSubmit={submit}
        className="w-full max-w-sm bg-neutral-950 border border-neutral-800 rounded-2xl p-6 space-y-4"
      >
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-red-600 text-white font-bold flex items-center justify-center text-sm">
            CBM
          </div>
          <div>
            <div className="font-semibold text-white leading-tight">
              Canada BTC Miners CRM
            </div>
            <div className="text-xs text-neutral-500">Enter passcode to continue</div>
          </div>
        </div>
        <input
          type="password"
          autoFocus
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="Passcode"
          className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-3 py-2 text-sm text-white outline-none focus:border-red-600"
        />
        {error && <div className="text-sm text-red-400">{error}</div>}
        <button
          type="submit"
          disabled={busy || !code}
          className="w-full bg-red-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-red-500 disabled:opacity-50"
        >
          {busy ? "Checking…" : "Unlock"}
        </button>
      </form>
    </div>
  );
}
