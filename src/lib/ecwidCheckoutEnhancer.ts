/**
 * Checkout enhancer for the embedded Ecwid checkout (address labels + Moneris row).
 *
 * Two jobs, both done WITHOUT touching Ecwid's own field structure, validation,
 * dropdowns or payment flow:
 *
 *  1. ADDRESS LABELS — Ecwid renders Street address / Apartment / City / Postal
 *     code / Province with placeholder-style text that disappears on typing. This
 *     inserts a real, permanent `<label for=…>` OUTSIDE and ABOVE the *full* field
 *     wrapper (never inside the positioned inner input container, so it can't
 *     overlap the value), then — only once the label is in place — clears the now
 *     redundant placeholder. Country / name / phone are left alone (they already
 *     show correct labels).
 *
 *  2. MONERIS — there is one payment method, so Ecwid's navy "Moneris Payment"
 *     selector card is redundant. This visually hides that whole card (the radio
 *     stays in the DOM and accessible, so the method stays selected and the flow
 *     works) and drops ONE compact row in its place: a red credit-card icon +
 *     "Secure credit card payment via Moneris". If it can't cleanly isolate the
 *     card, it does nothing (so it never produces a duplicate row or hides the
 *     card-entry fields).
 *
 * Design guarantees: purely additive (only inserts nodes / adds a hide-class /
 * clears a placeholder), idempotent (keyed by field name), and fail-soft (wrapped
 * in try/catch; an unrecognised DOM just leaves Ecwid's native rendering).
 */

const LABEL_CLASS = 'cbm-ext-label';
const KEY_ATTR = 'data-cbm-key';
const MONERIS_ROW_CLASS = 'cbm-moneris-row';
const SRONLY_CARD_CLASS = 'cbm-sronly-card';

// Fields that already display correctly — never modify these.
const DENY_LABEL = /^\s*(country|first\s*name|last\s*name|full\s*name|name|phone|telephone|email|e-?mail)\s*\*?\s*$/i;

// Only the address block gets external labels (Street / Apartment / City / Postal /
// Province / State). This keeps the enhancer off payment (card number), coupon,
// email, etc. — matched against the field's placeholder text or its name attribute.
const ADDRESS_FIELD = /(street|address|apartment|suite|floor|unit|city|town|postal|zip|province|state|region)/i;

type FormField = HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement;
type RefStyle = Partial<Record<'fontSize' | 'fontWeight' | 'fontFamily' | 'letterSpacing' | 'textTransform' | 'color' | 'lineHeight', string>>;

/** CSS.escape with a tiny fallback for older lib targets. */
function cssEscape(value: string): string {
  const css = (window as unknown as { CSS?: { escape?: (v: string) => string } }).CSS;
  if (css && typeof css.escape === 'function') return css.escape(value);
  return value.replace(/["\\]/g, '\\$&');
}

/** Tidy raw field text into a label, and reword the one the store wants changed. */
function normaliseLabel(raw: string): string {
  const t = raw.trim().replace(/\s*\*+\s*$/, ''); // drop a trailing required "*"
  if (/^province$/i.test(t)) return 'Province / State';
  return t;
}

function isEnhanceableField(el: Element): el is FormField {
  const tag = el.tagName;
  if (tag === 'SELECT' || tag === 'TEXTAREA') return true;
  if (tag !== 'INPUT') return false;
  const type = (el as HTMLInputElement).type;
  return !['hidden', 'checkbox', 'radio', 'button', 'submit', 'image', 'file'].includes(type);
}

/** True only when the field shows a real VISIBLE associated <label> (skip those). */
function hasVisibleLabel(container: HTMLElement, field: FormField): boolean {
  if (!field.id) return false;
  const lbl = container.querySelector(`label[for="${cssEscape(field.id)}"]:not(.${LABEL_CLASS})`);
  return !!(lbl && (lbl.textContent || '').trim());
}

/**
 * Climb from the input to the OUTERMOST element that still wraps only this one
 * field (stopping before any container that holds other fields, the <form>, or the
 * root), then climb out of any relative/absolute ancestor — so the returned node's
 * parent is a normal-flow block we can safely insert the label before.
 */
function outermostFieldWrapper(field: FormField, root: HTMLElement): HTMLElement {
  let node: HTMLElement = field;
  let parent = field.parentElement;
  while (parent && parent !== root && parent.tagName !== 'FORM') {
    if (parent.querySelectorAll('input, select, textarea').length > 1) break;
    node = parent;
    parent = parent.parentElement;
  }
  // Never place the label inside a positioned element (that's what caused overlap).
  while (
    node.parentElement &&
    node.parentElement !== root &&
    node.parentElement.tagName !== 'FORM' &&
    node.parentElement.querySelectorAll('input, select, textarea').length <= 1 &&
    getComputedStyle(node.parentElement).position !== 'static'
  ) {
    node = node.parentElement;
  }
  return node;
}

/** Copy the typography of an existing correct label (Country/name/phone/…). */
function referenceStyle(container: HTMLElement): RefStyle | null {
  const leaves = Array.from(container.querySelectorAll('label, span, div, p')).filter(
    (e) => e.children.length === 0 && !e.classList.contains(LABEL_CLASS),
  );
  const ref = leaves.find((e) => DENY_LABEL.test((e.textContent || '').trim()));
  if (!ref) return null;
  const cs = getComputedStyle(ref);
  return {
    fontSize: cs.fontSize,
    fontWeight: cs.fontWeight,
    fontFamily: cs.fontFamily,
    letterSpacing: cs.letterSpacing,
    textTransform: cs.textTransform,
    color: cs.color,
    lineHeight: cs.lineHeight,
  };
}

function applyLabelStyle(label: HTMLLabelElement, ref: RefStyle | null): void {
  // Set with `important` priority so the copied typography wins over the theme's
  // own !important rules (inline-important beats a class's !important).
  const set = (prop: string, value?: string) => {
    if (value) label.style.setProperty(prop, value, 'important');
  };
  set('display', 'block');
  set('position', 'static');
  set('text-align', 'left');
  set('margin', '0 0 0.3rem 0');
  set('padding', '0');
  set('background', 'transparent');
  if (ref) {
    set('font-size', ref.fontSize);
    set('font-weight', ref.fontWeight);
    set('font-family', ref.fontFamily);
    set('letter-spacing', ref.letterSpacing);
    set('text-transform', ref.textTransform);
    set('color', ref.color);
    set('line-height', ref.lineHeight);
  }
}

/**
 * Promote placeholder-style checkout fields to permanent labels above the box.
 * Pass the Ecwid ProductBrowser container element that holds the checkout.
 */
export function enhanceCheckoutLabels(container: HTMLElement | null): void {
  if (!container) return;
  try {
    const ref = referenceStyle(container);
    const fields = Array.from(container.querySelectorAll('input, select, textarea')).filter(isEnhanceableField);

    fields.forEach((field, i) => {
      const placeholder = (field.getAttribute('placeholder') || '').trim();
      if (!placeholder || hasVisibleLabel(container, field)) return;

      const text = normaliseLabel(placeholder);
      if (!text || DENY_LABEL.test(placeholder)) return; // leave country/name/phone/… alone

      const nameAttr = field.getAttribute('name') || '';
      // Only the address block — never payment/card/coupon/other placeholder fields.
      if (!ADDRESS_FIELD.test(placeholder) && !ADDRESS_FIELD.test(nameAttr)) return;

      const key = (nameAttr || field.id || `f${i}`).trim();
      // Give the field a stable unique id without replacing an existing one.
      if (!field.id) field.id = `cbm-f-${key.replace(/[^a-zA-Z0-9_-]/g, '') || i}`;

      const wrapper = outermostFieldWrapper(field, container);
      if (!wrapper.parentElement) return;

      // Reuse an existing injected label for this field (survives re-renders).
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
      applyLabelStyle(label, ref);

      // Insert the label BEFORE the full field wrapper (outside any positioned box).
      if (!(label.parentElement === wrapper.parentElement && label.nextElementSibling === wrapper)) {
        wrapper.parentElement.insertBefore(label, wrapper);
      }

      // Only after the label is confirmed in place, clear the redundant placeholder.
      if (label.isConnected && label.nextElementSibling === wrapper) {
        if (field.getAttribute('placeholder')) field.setAttribute('placeholder', '');
      }
    });

    renameProvinceLabel(container);
    replacePaymentCard(container);
  } catch {
    /* Leave Ecwid's native rendering untouched if anything is unexpected. */
  }
}

/**
 * Reword a standalone "Province" label to "Province / State" (leaf text only —
 * never a <select>/<option>, so dropdown values and selection are unaffected).
 */
function renameProvinceLabel(container: HTMLElement): void {
  container.querySelectorAll('label, span, div, p').forEach((el) => {
    if (el.children.length === 0 && (el.textContent || '').trim() === 'Province') {
      el.textContent = 'Province / State';
    }
  });
}

/**
 * Replace Ecwid's redundant single-method payment card with one compact row.
 * Hides the whole navy card (radio kept in DOM & accessible) and inserts a red
 * credit-card icon + "Secure credit card payment via Moneris". Does nothing if it
 * can't isolate the card cleanly, so it never duplicates or hides card-entry fields.
 */
function replacePaymentCard(container: HTMLElement): void {
  if (container.querySelector(`.${MONERIS_ROW_CLASS}`)) return; // already replaced

  const leaves = Array.from(
    container.querySelectorAll('label, span, div, p, td, li, h1, h2, h3, h4'),
  ).filter((e) => e.children.length === 0);
  const titleEl = leaves.find(
    (e) => /moneris/i.test(e.textContent || '') && (e.textContent || '').trim().length <= 40,
  );
  if (!titleEl) return;

  const ENTRY_SEL = 'iframe, input[type="text"], input[type="tel"], input[type="number"], input[type="email"]';
  const RADIO_SEL = 'input[type="radio"], .form-control--radio';

  // Smallest ancestor of the title that actually contains the method radio.
  let card: HTMLElement | null = titleEl as HTMLElement;
  while (card && card !== container && !card.querySelector(RADIO_SEL)) {
    card = card.parentElement;
  }
  if (!card || card === container || !card.parentElement) return; // no radio → leave default

  // Climb to the OUTERMOST card element that still holds the radio but NOT the
  // card-entry inputs / Moneris iframe — i.e. the whole navy selector card, but
  // never the wrapper that also contains the card-number fields.
  while (
    card.parentElement &&
    card.parentElement !== container &&
    card.parentElement.querySelector(RADIO_SEL) &&
    !card.parentElement.querySelector(ENTRY_SEL)
  ) {
    card = card.parentElement;
  }
  // If even this card contains the entry fields, hiding it would remove them — abort.
  if (card.querySelector(ENTRY_SEL) || !card.parentElement) return;

  const row = document.createElement('div');
  row.className = MONERIS_ROW_CLASS;
  row.innerHTML =
    '<svg class="cbm-cc-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" ' +
    'stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" ' +
    'aria-hidden="true"><rect x="2" y="5" width="20" height="14" rx="2"></rect>' +
    '<line x1="2" y1="10" x2="22" y2="10"></line></svg>' +
    '<span>Secure credit card payment via Moneris</span>';
  card.parentElement.insertBefore(row, card);
  card.classList.add(SRONLY_CARD_CLASS); // hide navy card; radio stays accessible
}
