/**
 * Checkout enhancer for the embedded Ecwid checkout (address labels + Moneris row).
 *
 * DESIGN — no injected labels, so duplicates are impossible:
 *  - Ecwid renders each field as a `.form-control` wrapper with its OWN label,
 *    `.form-control__placeholder` (> `.form-control__placeholder-inner`), which it
 *    floats inside the box. Instead of injecting our own <label> (the previous
 *    approach — which duplicated text and left floating labels behind across Ecwid
 *    re-renders), we just add a SCOPED marker class to the address field wrappers.
 *    Narrowly-scoped CSS (`.cbm-addr`) then turns Ecwid's own placeholder into a
 *    static label ABOVE the box. Re-running only re-adds a class that's already
 *    there — a no-op — so there is exactly one label, always.
 *  - The Province/State select is renamed once (its own placeholder text) and left
 *    a native <select> with its native arrow — never restructured.
 *  - The single Moneris method card is replaced by one compact row; the radio and
 *    the card-entry fields / Place Order stay in the DOM and functional.
 *
 * Guarantees: idempotent (marker classes + a one-shot rename + a singleton row),
 * narrowly scoped (only address/payment elements — no blanket .form-control rule),
 * never hides the form/step/payment-entry/Place-Order, and fail-soft (try/catch).
 */

const MONERIS_ROW_CLASS = 'cbm-moneris-row';
const SRONLY_CARD_CLASS = 'cbm-sronly-card';

// Address fields that get the label-above treatment. Country / first name / last
// name / phone / email are intentionally excluded — they already display correctly.
const ADDR_LABEL = /(street|address|apartment|\bapt\b|suite|floor|\bunit\b|city|town|postal|\bzip\b|province|state|region)/i;
const NOT_ADDR = /country|first\s*name|last\s*name|full\s*name|\bname\b|phone|telephone|email|e-?mail/i;

/** The visible label text Ecwid renders for a field wrapper (its floating label). */
function fieldLabelText(fc: Element): string {
  const el = fc.querySelector('.form-control__placeholder-inner') || fc.querySelector('.form-control__placeholder');
  return el ? (el.textContent || '').trim() : '';
}

/**
 * Mark the address field wrappers so scoped CSS can lift Ecwid's own label above
 * the box, and rename the Province label. No DOM is inserted for labels.
 */
export function enhanceCheckoutLabels(container: HTMLElement | null): void {
  if (!container) return;
  try {
    container.querySelectorAll<HTMLElement>('.form-control').forEach((fc) => {
      const txt = fieldLabelText(fc);
      if (!txt || NOT_ADDR.test(txt) || !ADDR_LABEL.test(txt)) return;

      const isSelect = fc.classList.contains('form-control--select') || !!fc.querySelector('select');
      if (isSelect) {
        // Province / State: rename its own placeholder text ONCE (idempotent).
        const inner = fc.querySelector('.form-control__placeholder-inner') as HTMLElement | null;
        if (inner && (inner.textContent || '').trim() === 'Province') inner.textContent = 'Province / State';
      }
      // Same marker for text fields and the province select: CSS lifts Ecwid's own
      // label above the box. The <select> stays a native select; the theme keeps
      // its native dropdown arrow and CSS hides Ecwid's duplicate custom arrow.
      fc.classList.add('cbm-addr'); // idempotent marker
    });

    replacePaymentCard(container);
  } catch {
    /* Leave Ecwid's native rendering untouched if anything is unexpected. */
  }
}

/** Any real data field (not a radio/checkbox) — catches untyped inputs, selects,
 * textareas and iframes (the Moneris hosted card fields). */
function containsDataField(el: Element): boolean {
  return Array.from(el.querySelectorAll('input, select, textarea, iframe')).some((f) => {
    if (f.tagName !== 'INPUT') return true; // select / textarea / iframe
    const type = ((f as HTMLInputElement).getAttribute('type') || 'text').toLowerCase();
    return !['radio', 'checkbox', 'hidden', 'button', 'submit', 'image'].includes(type);
  });
}

/**
 * Replace Ecwid's redundant single-method payment card with one compact row.
 * Hides the whole navy card (radio kept in DOM & accessible) and inserts one
 * "Secure credit card payment via Moneris" row with a red credit-card icon. Does
 * nothing if it can't isolate the card cleanly, so it never duplicates or hides
 * the card-entry fields / Place Order.
 */
function replacePaymentCard(container: HTMLElement): void {
  if (container.querySelector(`.${MONERIS_ROW_CLASS}`)) return; // already replaced (singleton)

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

  // Climb to the whole method card, but NEVER into an ancestor that also holds real
  // data fields (address inputs, the Moneris card-entry iframe/fields, etc.). A
  // "data field" is any input/select/textarea/iframe that isn't a radio/checkbox —
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
    '<span>Secure credit card payment via Moneris</span>';
  card.parentElement.insertBefore(row, card);
  card.classList.add(SRONLY_CARD_CLASS);
}

/**
 * One debounced MutationObserver per container so the marker classes / Moneris row
 * survive Ecwid re-rendering a checkout step. It only re-applies idempotent marks
 * (classList.add), a one-shot rename and a singleton row, so re-processing the same
 * field can never add a duplicate. Disconnects while it re-applies so its own DOM
 * writes never retrigger it.
 */
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
