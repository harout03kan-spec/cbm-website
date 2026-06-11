/**
 * SEO head component.
 *
 * Instead of rendering <title>/<meta>/<link> as JSX (which, under React 19's
 * metadata hoisting, *appends* a second <meta name="description"> alongside the
 * static one already in index.html — producing duplicate, stale-English
 * descriptions), this component imperatively UPSERTS a single head tag per key.
 * It updates the existing index.html tags in place, so:
 *   • every route ends up with exactly one description / canonical / OG / Twitter
 *     tag, set to the route-specific (and per-language) value, and
 *   • the static index.html values remain as the no-JS / first-paint fallback,
 *     without ever creating a duplicate.
 * Renders nothing and does not affect layout.
 */
import { useEffect } from 'react';

const SITE_URL = 'https://wholesaleasic.com';
const SITE_NAME = 'Canada BTC Miners';
const OG_IMAGE = `${SITE_URL}/asic-miner-hero.png`;

type SeoProps = {
  title: string;
  description: string;
  /** Path beginning with "/" (e.g. "/shop"). Used for canonical + og:url. */
  path: string;
  /** Optional JSON-LD objects to embed (already shaped as schema.org nodes). */
  jsonLd?: Record<string, unknown>[];
};

// Find an existing <meta> by name/property and update it; create it only if
// missing. Guarantees a single tag per key (no duplicates).
function upsertMeta(attr: 'name' | 'property', key: string, content: string) {
  let el = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

function upsertCanonical(href: string) {
  let el = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
  if (!el) {
    el = document.createElement('link');
    el.setAttribute('rel', 'canonical');
    document.head.appendChild(el);
  }
  el.setAttribute('href', href);
}

export default function Seo({ title, description, path, jsonLd }: SeoProps) {
  const url = `${SITE_URL}${path === '/' ? '/' : path}`;

  useEffect(() => {
    document.title = title;
    upsertMeta('name', 'description', description);
    upsertCanonical(url);
    // Open Graph
    upsertMeta('property', 'og:site_name', SITE_NAME);
    upsertMeta('property', 'og:type', 'website');
    upsertMeta('property', 'og:title', title);
    upsertMeta('property', 'og:description', description);
    upsertMeta('property', 'og:url', url);
    upsertMeta('property', 'og:image', OG_IMAGE);
    // Twitter
    upsertMeta('name', 'twitter:card', 'summary_large_image');
    upsertMeta('name', 'twitter:title', title);
    upsertMeta('name', 'twitter:description', description);
    upsertMeta('name', 'twitter:image', OG_IMAGE);
  }, [title, description, url]);

  // JSON-LD: append this route's structured-data blocks, remove them on unmount.
  const ldKey = JSON.stringify(jsonLd ?? []);
  useEffect(() => {
    const nodes: Record<string, unknown>[] = JSON.parse(ldKey);
    const created = nodes.map((node) => {
      const s = document.createElement('script');
      s.type = 'application/ld+json';
      s.setAttribute('data-seo-jsonld', '');
      s.textContent = JSON.stringify(node);
      document.head.appendChild(s);
      return s;
    });
    return () => created.forEach((s) => s.remove());
  }, [ldKey]);

  return null;
}

/* ── Shared structured-data nodes ────────────────────────────────────────
 * Only factual, non-rating schema. No Review, no AggregateRating, no prices.
 */

export const organizationLd: Record<string, unknown> = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: SITE_NAME,
  url: SITE_URL,
  logo: OG_IMAGE,
  email: 'info@canadabtcminers.ca',
  telephone: '+1-514-604-7050',
  address: {
    '@type': 'PostalAddress',
    streetAddress: '6500 Route Transcanadienne, Suite 209',
    addressLocality: 'Saint-Laurent',
    addressRegion: 'QC',
    postalCode: 'H4T 1X4',
    addressCountry: 'CA',
  },
};

export const websiteLd: Record<string, unknown> = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: SITE_NAME,
  url: SITE_URL,
};

export const localBusinessLd: Record<string, unknown> = {
  '@context': 'https://schema.org',
  '@type': 'LocalBusiness',
  name: SITE_NAME,
  url: SITE_URL,
  image: OG_IMAGE,
  email: 'info@canadabtcminers.ca',
  telephone: '+1-514-604-7050',
  address: {
    '@type': 'PostalAddress',
    streetAddress: '6500 Route Transcanadienne, Suite 209',
    addressLocality: 'Saint-Laurent',
    addressRegion: 'QC',
    postalCode: 'H4T 1X4',
    addressCountry: 'CA',
  },
  areaServed: 'CA',
};

export const repairServiceLd: Record<string, unknown> = {
  '@context': 'https://schema.org',
  '@type': 'Service',
  serviceType: 'ASIC Miner Repair',
  name: 'ASIC Miner Repair and Diagnostics',
  description:
    'ASIC miner repair services in Canada including diagnostics, hashboard repair, control board support, cleaning and maintenance, thermal paste replacement, firmware restore, and testing.',
  provider: {
    '@type': 'LocalBusiness',
    name: SITE_NAME,
    url: SITE_URL,
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Saint-Laurent',
      addressRegion: 'QC',
      addressCountry: 'CA',
    },
  },
  areaServed: 'CA',
};
