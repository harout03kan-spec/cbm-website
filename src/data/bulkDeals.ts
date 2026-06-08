// Bulk / wholesale ASIC miner batches. These are inquiry-based lots (pallets,
// farm liquidations, mixed batches, large-quantity deals) — NOT retail products,
// NOT part of the shop catalog, and never added to the cart. Every batch is
// confirmed before payment or pickup.
//
// This list is intentionally empty until real batches are posted: the Bulk Deals
// page shows a clean "contact for the current list" state when there are none.
// To add a real batch later, push a BulkDeal object below — the page renders it
// automatically. Do NOT invent inventory.

export type BulkDealStatus = 'Available' | 'Pending' | 'Sold';

export type BulkDeal = {
  id: string;
  title: string;                 // e.g. "Mixed S19 Series Pallet"
  models: string[];              // models included in the batch
  quantity: number;              // total units in the batch
  moq?: number;                  // minimum order quantity, if any
  averageHashrate?: string;      // e.g. "95 TH/s avg"
  hashrateRange?: string;        // e.g. "134T – 141T"
  totalHashrate?: string;        // e.g. "9.5 PH/s total" (optional, when useful)
  pricePerTh?: string;           // e.g. "$1.45 USD / TH"
  estUnitPrice?: string;         // e.g. "≈ $200.10 USD / unit"
  priceLabel?: string;           // free-form fallback, e.g. "Price on request" — no invented numbers
  location?: string;             // e.g. "Montreal, QC"
  condition?: string;            // e.g. "Used", "Refurbished", "Mixed"
  cooling?: string;              // e.g. "Air", "Hydro" (optional)
  warranty?: string;             // e.g. "48h DOA replacement"
  extraUnits?: string;           // spares included, e.g. "+2 spare units"
  images?: string[];             // local image paths under /public
  notes?: string;                // free-form notes
  status: BulkDealStatus;        // Available | Pending | Sold
  ctaLabel?: string;             // overrides the default "Request Bulk Quote"
};

// Real batches only — never invent inventory. Final quantity and exact mix are
// always confirmed with the customer before an order.
export const BULK_DEALS: BulkDeal[] = [
  {
    id: 's19xp-134-141-mix',
    title: 'Antminer S19 XP 134T / 141T Mix',
    models: ['Antminer S19 XP 134T', 'Antminer S19 XP 141T'],
    quantity: 600,
    moq: 100,
    averageHashrate: '138 TH/s',
    hashrateRange: '134T – 141T',
    pricePerTh: '$1.45 USD / TH',
    estUnitPrice: '≈ $200.10 USD / unit (1.45 × 138T)',
    location: 'Canada',
    condition: 'Used',
    warranty: '7 days DOA inside Canada',
    extraUnits: 'Extra units included for buyers outside Canada',
    // Real lot photos served locally from public/assets/bulk-deals/ (not
    // hotlinked, not stock). If a file is missing the card falls back to a clean
    // placeholder, so these paths activate automatically once the jpgs are added.
    images: [
      '/assets/bulk-deals/s19xp-mix-1.jpg',
      '/assets/bulk-deals/s19xp-mix-2.jpg',
      '/assets/bulk-deals/s19xp-mix-3.jpg',
      '/assets/bulk-deals/s19xp-mix-4.jpg',
    ],
    notes: 'Tested and consolidated. Mixed 134T and 141T units. Final quantity and exact mix confirmed before order.',
    status: 'Available',
  },
];

// Batches shown on the page by default. "Sold" lots are hidden unless explicitly
// surfaced later.
export const visibleBulkDeals = (): BulkDeal[] =>
  BULK_DEALS.filter((d) => d.status !== 'Sold');
