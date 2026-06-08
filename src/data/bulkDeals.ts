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
  totalHashrate?: string;        // e.g. "9.5 PH/s total" (optional, when useful)
  priceLabel?: string;           // free-form, e.g. "Price per TH on request" — no invented numbers
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

// No real batches yet — keep empty (no fake bulk inventory).
export const BULK_DEALS: BulkDeal[] = [];

// Batches shown on the page by default. "Sold" lots are hidden unless explicitly
// surfaced later.
export const visibleBulkDeals = (): BulkDeal[] =>
  BULK_DEALS.filter((d) => d.status !== 'Sold');
