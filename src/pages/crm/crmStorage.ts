// localStorage adapter for the CRM.
//
// The original CRM was built as a Claude Artifact and relied on the
// sandbox-only `window.storage` API. In a normal browser/Vite build that
// global does not exist, so this adapter provides the same async
// get/set shape backed by the browser's localStorage. All CRM data lives
// only in the visitor's browser — nothing is sent anywhere or committed.

const PREFIX = "";

export const crmStorage = {
  async get(key: string, _opt?: boolean): Promise<{ value: string | null }> {
    try {
      return { value: localStorage.getItem(PREFIX + key) };
    } catch {
      return { value: null };
    }
  },
  async set(key: string, value: string, _opt?: boolean): Promise<void> {
    try {
      localStorage.setItem(PREFIX + key, value);
    } catch {
      // storage full / unavailable — fail silently, same as the original
    }
  },
};
