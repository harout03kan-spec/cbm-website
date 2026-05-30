import { useState } from "react";
import CrmLock, { isUnlocked } from "./CrmLock";
import CanadaBTCMinersCRM from "./CanadaBTCMinersCRM";

// Isolated CRM section, mounted at /crm. It shares no layout, header,
// footer or logic with the storefront. Gated by a client-side lock screen.
export default function CrmPage() {
  const [unlocked, setUnlocked] = useState<boolean>(() => isUnlocked());

  if (!unlocked) {
    return <CrmLock onUnlock={() => setUnlocked(true)} />;
  }
  return <CanadaBTCMinersCRM />;
}
