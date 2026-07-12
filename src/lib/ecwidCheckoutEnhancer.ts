/**
 * Checkout-label enhancer for the embedded Ecwid checkout.
 *
 * Ecwid renders some checkout fields (Street address, Apartment, City, Postal
 * code) with placeholder-style text that DISAPPEARS as soon as the shopper types.
 * This turns exactly those fields into permanent, visible labels ABOVE the box by
 * inserting a real `<label for=…>` next to the Ecwid input and clearing the now
 * redundant placeholder. It also renames the "Province" label to "Province / State".
 *
 * Why this is safe to run against Ecwid's own DOM:
 *  - PURELY ADDITIVE — it only inserts <label> nodes, clears a placeholder attribute
 *    and (for the one field) rewords a label's text. It never removes, reorders or
 *    restyles Ecwid's field wrappers, <select> internals, dropdown arrows or
 *    validation elements, so checkout layout, the Country / Province dropdowns, form
 *    validation and the Moneris payment flow are untouched.
 *  - DUPLICATE-FREE BY CONSTRUCTION — it only labels fields whose visible text comes
 *    from a native `placeholder` attribute (those have no separate label element),
 *    so it never renders the same text twice. Fields that already show a real label
 *    (name, phone, …) are left exactly as Ecwid renders them.
 *  - IDEMPOTENT — injected labels are keyed by the field's `name`, so Ecwid
 *    re-rendering a step (address → shipping → payment) reuses the same label
 *    instead of stacking duplicates.
 *  - FAILS SOFT — everything is wrapped in try/catch and only acts on fields it can
 *    positively identify; an unexpected DOM simply leaves Ecwid's native rendering.
 */

const LABEL_CLASS = 'cbm-ext-label';
const KEY_ATTR = 'data-cbm-key';

/** CSS.escape with a tiny fallback for older lib targets. */
function cssEscape(value: string): string {
  const css = (window as unknown as { CSS?: { escape?: (v: string) => string } }).CSS;
  if (css && typeof css.escape === 'function') return css.escape(value);
  return value.replace(/["\\]/g, '\\$&');
}

/** Tidy the raw field text into a label, and reword the one the store wants changed. */
function normaliseLabel(raw: string): string {
  const t = raw.trim().replace(/\s*\*+\s*$/, ''); // drop a trailing required "*"
  if (/^province$/i.test(t)) return 'Province / State';
  return t;
}

type FormField = HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement;

function isEnhanceableField(el: Element): el is FormField {
  const tag = el.tagName;
  if (tag === 'SELECT' || tag === 'TEXTAREA') return true;
  if (tag !== 'INPUT') return false;
  const type = (el as HTMLInputElement).type;
  return !['hidden', 'checkbox', 'radio', 'button', 'submit', 'image', 'file'].includes(type);
}

/**
 * True when the field already shows a real, VISIBLE associated label — leave those
 * alone to avoid duplicate text. Note: an `aria-label` does NOT count, because it is
 * invisible; a field can carry an aria-label and still show a placeholder that
 * disappears on typing (exactly the case we want to fix).
 */
function hasVisibleLabel(container: HTMLElement, field: FormField): boolean {
  if (!field.id) return false;
  const lbl = container.querySelector(`label[for="${cssEscape(field.id)}"]:not(.${LABEL_CLASS})`);
  return !!(lbl && (lbl.textContent || '').trim());
}

/**
 * Promote placeholder-style checkout fields to permanent labels above the box.
 * Pass the Ecwid ProductBrowser container element that currently holds the checkout.
 */
export function enhanceCheckoutLabels(container: HTMLElement | null): void {
  if (!container) return;
  try {
    const fields = Array.from(container.querySelectorAll('input, select, textarea')).filter(isEnhanceableField);

    fields.forEach((field, i) => {
      // Only act on fields whose visible label is a native placeholder (dup-free).
      const placeholder = (field.getAttribute('placeholder') || '').trim();
      if (!placeholder || hasVisibleLabel(container, field)) return;

      const text = normaliseLabel(placeholder);
      if (!text) return;

      const key = (field.getAttribute('name') || field.id || `f${i}`).trim();
      if (!field.id) field.id = `cbm-f-${key.replace(/[^a-zA-Z0-9_-]/g, '') || i}`;

      const wrap = (field.closest('.form-control') as HTMLElement) || (field.parentElement as HTMLElement);
      if (!wrap || !wrap.parentElement) return;

      // Reuse an existing injected label for this field (survives Ecwid re-renders).
      let label = container.querySelector<HTMLLabelElement>(
        `label.${LABEL_CLASS}[${KEY_ATTR}="${cssEscape(key)}"]`,
      );
      if (!label) {
        label = document.createElement('label');
        label.className = LABEL_CLASS;
        label.setAttribute(KEY_ATTR, key);
      }
      label.setAttribute('for', field.id);
      label.textContent = text;

      // Place it directly above the field's wrapper, in normal flow.
      if (label.nextElementSibling !== wrap) {
        wrap.parentElement.insertBefore(label, wrap);
      }

      // The label now stands in for the placeholder — clear it so the same text
      // doesn't sit inside the box and vanish on typing.
      field.setAttribute('placeholder', '');
    });

    renameProvinceLabel(container);
    ensureMonerisLine(container);
  } catch {
    /* Leave Ecwid's native rendering untouched if anything is unexpected. */
  }
}

/**
 * Moneris is the only payment method, so the theme visually hides its redundant
 * selection radio (sr-only). Put ONE clean visible line — "Secure payment via
 * Moneris" — exactly where that hidden radio sits, so the payment section still
 * reads clearly with no empty gap. Additive + idempotent; the radio itself stays
 * in the DOM and selected, and the Moneris card-entry fields / Place Order button
 * (which are siblings, not this radio) remain visible.
 */
const MONERIS_LINE_CLASS = 'cbm-moneris-line';

function ensureMonerisLine(container: HTMLElement): void {
  if (container.querySelector(`.${MONERIS_LINE_CLASS}`)) return; // already added
  const sections = container.querySelectorAll('[class*="payment"], [class*="Payment"]');
  for (const section of Array.from(sections)) {
    const radio = section.querySelector('.form-control--radio');
    if (!radio || !radio.parentElement) continue;
    const line = document.createElement('div');
    line.className = MONERIS_LINE_CLASS;
    line.textContent = 'Secure payment via Moneris';
    radio.parentElement.insertBefore(line, radio);
    return;
  }
}

/**
 * Reword a standalone "Province" field label to "Province / State" when Ecwid
 * renders it as a label element rather than a placeholder. Only touches leaf text
 * elements whose entire text is exactly "Province" — never a <select>/<option>, so
 * the dropdown values and selection are unaffected.
 */
function renameProvinceLabel(container: HTMLElement): void {
  const candidates = container.querySelectorAll('label, span, div, p');
  candidates.forEach((el) => {
    if (el.children.length > 0) return; // leaf text only
    if ((el.textContent || '').trim() === 'Province') {
      el.textContent = 'Province / State';
    }
  });
}
