// Short branded "CRM loading" splash shown before the lock screen and
// again right after a successful unlock. Presentational only.
export default function CrmLoading({ label = "CRM loading" }: { label?: string }) {
  return (
    <div
      className="min-h-screen bg-neutral-950 text-slate-200 flex items-center justify-center px-4"
      style={{ fontFamily: "system-ui, sans-serif" }}
    >
      <div className="flex flex-col items-center gap-5">
        <div className="relative">
          <div className="w-14 h-14 rounded-2xl bg-red-600 text-white font-bold flex items-center justify-center text-lg shadow-lg shadow-red-900/30">
            CBM
          </div>
          <span className="absolute -inset-1.5 rounded-2xl border-2 border-red-600/40 border-t-red-500 animate-spin" />
        </div>
        <div className="text-center">
          <div className="text-sm font-semibold text-white tracking-wide">
            Canada Bitcoin Miners CRM
          </div>
          <div className="mt-1 text-xs text-neutral-500 flex items-center justify-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
            {label}…
          </div>
        </div>
      </div>
    </div>
  );
}
