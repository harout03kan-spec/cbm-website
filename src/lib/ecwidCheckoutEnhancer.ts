/**
 * Checkout enhancer for the embedded Ecwid checkout (address labels + Moneris row).
 *
 * Targets Ecwid's REAL storefront markup (class names taken from the live
 * storefront bundle): each field is a `.form-control` wrapper containing the input
 * (`.form-control__text` / `.form-control__select`) and a FLOATING label
 * `.form-control__placeholder` (> `.form-control__placeholder-inner`) that Ecwid
 * positions inside the box — which is what overlaps the entered value on the
 * address fields.
 *
 * Job 1 — ADDRESS LABELS: for the address block only (Street / Apartment / City /
 * Postal / Province / State) it inserts a real, permanent `<label for=…>` OUTSIDE
 * and ABOVE the full field wrapper, hides Ecwid's floating `.form-control__placeholder`
 * for that field (so nothing sits inside the box but the value), and copies the
 * typography of the store's existing correct labels. Country / name / phone are
 * left exactly as Ecwid renders them.
 *
 * Job 2 — MONERIS: replaces Ecwid's redundant navy single-method card with one
 * compact row (red credit-card icon + "Secure credit and debit card payment via
 * Moneris"); the card is hidden (radio kept in the DOM & selected) and the
 * card-entry fields / Place Order stay visible.
 *
 * Guarantees: additive (inserts nodes / hides Ecwid's floating label + card /
 * clears a placeholder attr), idempotent (keyed by field name), fail-soft
 * (try/catch), and durable (a debounced MutationObserver re-applies it when Ecwid
 * re-renders a checkout step).
 */

const LABEL_CLASS = 'cbm-ext-label';
const KEY_ATTR = 'data-cbm-key';
const MONERIS_ROW_CLASS = 'cbm-moneris-row';
const SRONLY_CARD_CLASS = 'cbm-sronly-card';

// Fields that already display correctly — never modify these.
const DENY_LABEL = /^\s*(country|first\s*name|last\s*name|full\s*name|name|phone|telephone|email|e-?mail)\s*\*?\s*$/i;
// Only the address block gets external labels (matched on label text / name / autocomplete).
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

/**
 * Climb from the input to the OUTERMOST element that still wraps only this one
 * field, then climb out of any positioned ancestor — so the label goes before the
 * full field wrapper, in normal flow, never inside a positioned box.
 */
function outermostFieldWrapper(field: FormField, root: HTMLElement): HTMLElement {
  let node: HTMLElement = field;
  let parent = field.parentElement;
  while (parent && parent !== root && parent.tagName !== 'FORM') {
    if (parent.querySelectorAll('input, select, textarea').length > 1) break;
    node = parent;
    parent = parent.parentElement;
  }
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

/** Copy the typography of an existing correct label (Ecwid's own name/phone/…). */
function referenceStyle(container: HTMLElement): RefStyle | null {
  const cands = Array.from(
    container.querySelectorAll('.form-control__label, .form-control__placeholder, .form-control__placeholder-inner, label'),
  );
  const ref = cands.find(
    (e) => !e.classList.contains(LABEL_CLASS) && DENY_LABEL.test((e.textContent || '').trim()),
  );
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
  // `important` priority so the copied typography wins over the theme's own rules.
  const set = (prop: string, value?: string) => {
    if (value) label.style.setProperty(prop, value, 'important');
  };
  set('display', 'block');
  set('position', 'static');
  set('text-align', 'left');
  set('margin', '0 0 0.35rem 0');
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
 * Promote Ecwid's placeholder/floating-label address fields to permanent labels
 * above the box. Pass the Ecwid ProductBrowser container holding the checkout.
 */
export function enhanceCheckoutLabels(container: HTMLElement | null): void {
  if (!container) return;
  try {
    const ref = referenceStyle(container);
    const fields = Array.from(container.querySelectorAll('input, select, textarea')).filter(isEnhanceableField);

    fields.forEach((field, i) => {
      const wrap = field.closest('.form-control') as HTMLElement | null;
      const floatEl = wrap ? (wrap.querySelector('.form-control__placeholder') as HTMLElement | null) : null;
      const placeholderAttr = (field.getAttribute('placeholder') || '').trim();
      const floatText = floatEl ? (floatEl.textContent || '').trim() : '';
      const rawText = floatText || placeholderAttr || (field.getAttribute('aria-label') || '').trim();
      if (!rawText) return;

      const nameAttr = field.getAttribute('name') || '';
      const autoAttr = field.getAttribute('autocomplete') || '';
      // Address block only; never country/name/phone/email.
      if (!(ADDRESS_FIELD.test(rawText) || ADDRESS_FIELD.test(nameAttr) || ADDRESS_FIELD.test(autoAttr))) return;
      if (DENY_LABEL.test(rawText)) return;

      const text = normaliseLabel(rawText);
      if (!text) return;

      const key = (nameAttr || field.id || `f${i}`).trim();
      if (!field.id) field.id = `cbm-f-${key.replace(/[^a-zA-Z0-9_-]/g, '') || i}`;

      const outer = outermostFieldWrapper(field, container);
      if (!outer.parentElement) return;

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

      // Insert BEFORE the full field wrapper (outside any positioned box).
      if (!(label.parentElement === outer.parentElement && label.nextElementSibling === outer)) {
        outer.parentElement.insertBefore(label, outer);
      }

      if (label.isConnected && label.nextElementSibling === outer) {
        // Hide Ecwid's floating label so only the value sits inside the box.
        if (floatEl) floatEl.style.setProperty('display', 'none', 'important');
        // Clear a native placeholder if the field uses one.
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
  container
    .querySelectorAll('label, span, div, p, .form-control__placeholder-inner')
    .forEach((el) => {
      if (el.children.length === 0 && (el.textContent || '').trim() === 'Province') {
        el.textContent = 'Province / State';
      }
    });
}

/**
 * Replace Ecwid's redundant single-method payment card with one compact row.
 * Hides the whole navy card (radio kept in DOM & accessible) and inserts a red
 * credit-card icon + "Secure credit and debit card payment via Moneris". Does
 * nothing if it can't isolate the card cleanly, so it never duplicates or hides
 * the card-entry fields.
 */
/** Any real data field (not a radio/checkbox) — catches untyped inputs, selects,
 * textareas and iframes (the Moneris hosted card fields). */
function containsDataField(el: Element): boolean {
  return Array.from(el.querySelectorAll('input, select, textarea, iframe')).some((f) => {
    if (f.tagName !== 'INPUT') return true; // select / textarea / iframe
    const type = ((f as HTMLInputElement).getAttribute('type') || 'text').toLowerCase();
    return !['radio', 'checkbox', 'hidden', 'button', 'submit', 'image'].includes(type);
  });
}

function replacePaymentCard(container: HTMLElement): void {
  if (container.querySelector(`.${MONERIS_ROW_CLASS}`)) return; // already replaced

  const leaves = Array.from(
    container.querySelectorAll('label, span, div, p, td, li, h1, h2, h3, h4'),
  ).filter((e) => e.children.length === 0);
  const titleEl = leaves.find(
    (e) => /moneris/i.test(e.textContent || '') && (e.textContent || '').trim().length <= 40,
  );
  if (!titleEl) return;

  const RADIO_SEL = 'input[type="radio"], .form-control--radio';

  let card: HTMLElement | null = titleEl as HTMLElement;
  while (card && card !== container && !card.querySelector(RADIO_SEL)) {
    card = card.parentElement;
  }
  if (!card || card === container || !card.parentElement) return;

  // Climb to the whole method card, but NEVER into an ancestor that also holds
  // real data fields (address inputs, the Moneris card-entry iframe/fields, etc.).
  // A "data field" is any input/select/textarea/iframe that isn't a radio/checkbox —
  // detected by tag/type so it also catches inputs with no explicit type attribute.
  while (
    card.parentElement &&
    card.parentElement !== container &&
    card.parentElement.querySelector(RADIO_SEL) &&
    !containsDataField(card.parentElement)
  ) {
    card = card.parentElement;
  }
  // Safety: if the isolated card itself contains data fields, hiding it would remove
  // the card-entry inputs / other fields — so abort and leave Ecwid's default.
  if (containsDataField(card) || !card.parentElement) return;

  const row = document.createElement('div');
  row.className = MONERIS_ROW_CLASS;
  row.innerHTML =
    '<svg class="cbm-cc-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" ' +
    'stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" ' +
    'aria-hidden="true"><rect x="2" y="5" width="20" height="14" rx="2"></rect>' +
    '<line x1="2" y1="10" x2="22" y2="10"></line></svg>' +
    '<span>Secure credit and debit card payment via Moneris</span>';
  card.parentElement.insertBefore(row, card);
  card.classList.add(SRONLY_CARD_CLASS);
}

// One debounced MutationObserver per container so injected labels / the Moneris
// row survive Ecwid re-rendering a checkout step. Disconnects while it re-applies
// so its own DOM writes never retrigger it.
const OBSERVED = new WeakSet<HTMLElement>();

export function installCheckoutObserver(container: HTMLElement | null): void {
  if (!container || OBSERVED.has(container)) return;
  OBSERVED.add(container);
  let scheduled = false;
  const obs = new MutationObserver(() => {
    if (scheduled) return;
    scheduled = true;
    setTimeout(() => {
      scheduled = false;
      obs.disconnect();
      try {
        enhanceCheckoutLabels(container);
      } finally {
        obs.observe(container, { childList: true, subtree: true });
      }
    }, 150);
  });
  obs.observe(container, { childList: true, subtree: true });
}
