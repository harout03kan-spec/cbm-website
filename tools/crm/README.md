# CBM CRM (kept aside, not part of the website)

This is Harout's lead/contact CRM, originally built as a Claude Artifact.
It used to be mounted on the website at `/crm`. It was moved here so it is
not deployed with the public site and does not mix with the website code.
Nothing was deleted.

- `page.tsx` – entry: loading splash → passcode lock → dashboard
- `CanadaBTCMinersCRM.tsx` – the CRM itself
- `CrmLock.tsx` – passcode screen (obfuscation only, not real security;
  default passcode "123", override with `VITE_CRM_PASSCODE_HASH`)
- `crmStorage.ts` – saves data in the browser's localStorage (nothing is
  sent to a server)

Data note: CRM data lives only in the browser where it was used, under the
domain it was opened on. If it was used at `<site>/crm`, that data is still
in that browser; open the CRM's export (if any) before clearing site data.

To run it again on its own (e.g. a separate private Netlify site or a Claude
Artifact), it needs a small React + Tailwind shell that renders
`<CrmPage />` from `page.tsx`, plus `lucide-react`.
