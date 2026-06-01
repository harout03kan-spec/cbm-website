/**
 * SEO head component — Phase 2A.
 *
 * Uses React 19's native document metadata support: <title>, <meta> and
 * <link> rendered here are automatically hoisted into <head> and swapped on
 * client-side route changes. No external head library is required.
 *
 * This only sets per-page <title>/description/canonical/OG/Twitter tags and
 * (optionally) one JSON-LD block. It renders nothing visible and does not
 * affect layout.
 */

const SITE_URL = 'https://canadabtcminers.ca';
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

export default function Seo({ title, description, path, jsonLd }: SeoProps) {
  const url = `${SITE_URL}${path === '/' ? '/' : path}`;

  return (
    <>
      <title>{title}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={url} />

      {/* Open Graph */}
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:type" content="website" />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={url} />
      <meta property="og:image" content={OG_IMAGE} />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={OG_IMAGE} />

      {(jsonLd ?? []).map((node, i) => (
        <script
          key={i}
          type="application/ld+json"
          // JSON.stringify output is safe to embed in a JSON-LD script tag.
          dangerouslySetInnerHTML={{ __html: JSON.stringify(node) }}
        />
      ))}
    </>
  );
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
