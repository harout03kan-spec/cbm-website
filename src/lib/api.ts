// ─── PRODUCT TYPE (shared by the bundled catalog and the Ecwid catalog) ──────
export interface Product {
  id: number;
  name: string;
  slug: string;
  sku?: string;
  brand?: string;          // manufacturer (Bitmain | MicroBT | Canaan | ElphaPex | IceRiver | VolcMiner)
  price: string;           // regular_price from WC
  sale_price: string;
  stock_status: string;    // 'instock' | 'outofstock' | 'onbackorder'
  stock_quantity: number | null;
  condition: string;       // New | Refurbished | Used
  cooling: string;         // Air | Hydro | Immersion
  algorithm: string;       // SHA-256 | Scrypt
  coin?: string;           // red card label typed in Ecwid ("LTC/DOGE", "KAS", "ALEO"…); overrides the algorithm-based label
  hashrate: string;        // TH/s
  hashrate_unit?: string;  // display unit for hashrate (TH/s, GH/s, MH/s)
  power: string;           // Watts
  efficiency: string;      // J/TH
  efficiency_unit?: string; // display unit for efficiency (J/TH, J/GH, J/MH)
  image: string;           // first image src
  images: string[];        // all image srcs
  badge: string;
  short_description: string;
  featured: boolean;
  categories: string[];
  permalink: string;
  // Full static hardware specs (miners only) — sourced from ASICMinerValue.
  details?: {
    model?: string;
    release?: string;
    size?: string;
    weight?: string;
    noise?: string;
    fans?: string;
    voltage?: string;
    interface?: string;
    temperature?: string;
    humidity?: string;
  };
  // Selectable hashrate variants (one product card per model; card shows the
  // first/highest variant). Each variant has its own specs and CAD price.
  variants?: ProductVariant[];
  // Add-ons picked for this product in Ecwid ("Related products"): the
  // cables, fans, PSUs etc. that go with it. Also shown by Ecwid at checkout.
  related?: number[];
}

export interface ProductVariant {
  label: string;            // short tag shown in the selector, e.g. "310T", "16.5G"
  option?: string;          // Ecwid option name this label belongs to (e.g. "Hashrate")
  model?: string;           // exact model name for this variant
  hashrate: string;
  hashrate_unit?: string;
  power?: string;
  efficiency?: string;
  efficiency_unit?: string;
  price: string;            // final CAD price for this variant
}
