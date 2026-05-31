import { useEffect, useState } from "react";
import CrmLock, { isUnlocked, setUnlocked } from "./CrmLock";
import CrmLoading from "./CrmLoading";
import CanadaBTCMinersCRM from "./CanadaBTCMinersCRM";

// Isolated CRM section, mounted at /crm. Shares no layout, header, footer
// or logic with the storefront.
//
// Flow:
//   boot   -> short "CRM loading" splash
//   lock   -> passcode screen
//   unlock -> short "CRM loading" splash after correct passcode
//   ready  -> the CRM dashboard
// The in-app Lock button returns to the lock screen; unlocking again
// replays the unlock splash before the dashboard.
type Phase = "boot" | "lock" | "unlock" | "ready";

const BOOT_MS = 900;
const UNLOCK_MS = 800;

export default function CrmPage() {
  const [phase, setPhase] = useState<Phase>("boot");

  // Initial boot splash, then route to lock (or straight toward ready if a
  // previous unlock is still valid for this tab session).
  useEffect(() => {
    const alreadyUnlocked = isUnlocked();
    const id = setTimeout(() => setPhase(alreadyUnlocked ? "ready" : "lock"), BOOT_MS);
    return () => clearTimeout(id);
  }, []);

  // After a successful unlock, show the second splash, then the dashboard.
  useEffect(() => {
    if (phase !== "unlock") return;
    const id = setTimeout(() => setPhase("ready"), UNLOCK_MS);
    return () => clearTimeout(id);
  }, [phase]);

  const handleLock = () => {
    setUnlocked(false);
    setPhase("lock");
  };

  if (phase === "boot") return <CrmLoading />;
  if (phase === "lock") return <CrmLock onUnlock={() => setPhase("unlock")} />;
  if (phase === "unlock") return <CrmLoading />;
  return <CanadaBTCMinersCRM onLock={handleLock} />;
}
