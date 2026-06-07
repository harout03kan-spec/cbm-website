import type { Product } from './api';

const lc = (s?: string) => (s || '').toLowerCase();

// Conservative availability shared by the shop grid and the product detail page.
// We never claim "In stock" (physically here now) because the catalog can't
// prove physical presence in Canada / our warehouse. New + orderable units are
// orderable from the supplier (~7-9 days) → "Available to order"; used or
// unknown-condition units → "Contact us for availability"; only an explicit
// out-of-stock flag → "Out of stock". Returns an i18n key.
export function availabilityKey(p: Product): string {
  const s = lc(p.stock_status);
  if (s === 'outofstock') return 'shop_avail_outofstock';
  const cond = lc(p.condition);
  if (s === 'instock' || s === 'onbackorder') {
    return /new/.test(cond) ? 'shop_avail_order' : 'shop_avail_contact';
  }
  return 'shop_avail_contact';
}
