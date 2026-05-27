import { useState, useEffect, useRef } from 'react';
import { fetchContent, fetchContentSection, SiteContent } from '../lib/api';

// ─── DEFAULT CONTENT (mirrors plugin defaults — site never breaks) ─────────────
const DEFAULTS: SiteContent = {
  home_hero: {
    headline_line1: 'Industrial',
    headline_line2: 'Bitcoin Mining',
    headline_line3: 'Hardware',
    subline: 'Brand new and refurbished ASIC miners. Shipping and brokerage included.',
    cta_button: 'Shop ASIC Miners',
  },
  home_trust_bar: {
    stat1_value: '2,300+', stat1_label: 'Miners Serviced',
    stat2_value: '92%',    stat2_label: 'Repair Success Rate',
    stat3_value: '4+',     stat3_label: 'Years in Canadian Mining',
    stat4_value: 'Montreal', stat4_label: 'Based Facility',
  },
  home_repair_teaser: {
    heading: 'Need Your ASIC Miner Repaired?',
    body: 'Our Montreal repair center has serviced 2,300+ ASIC miners with a 92% repair success rate. We specialize in hashboard diagnostics and board-level ASIC repairs to get miners back online fast.',
    flow_line: 'Send us your miner or boards → we diagnose the issue → we send a quote → we complete the repair',
    point1: '2,300+ miners serviced',
    point2: '92% repair success rate',
    point3: '30-day repair warranty',
    point4: 'Average 5–12 business day turnaround',
    cta_primary: 'Request Repair Quote',
  },
  home_final_cta: {
    heading: 'Ready to Deploy Your Mining Hardware?',
    heading_red: 'Mining Hardware?',
    body: 'Browse our inventory of new and refurbished ASIC miners, or reach out to our team for repair quotes, hosting inquiries, and bulk orders.',
    cta_primary: 'View Available Miners',
    cta_secondary: 'Contact Our Team',
  },
  home_trust_signals: {
    signal1: 'Shipping options available',
    signal2: 'Transparent tax at checkout',
    signal3: 'Canadian inventory and fulfillment',
    signal4: 'In house repairs & warranty included',
  },
  faq_shop: [
    { question: 'Is shipping included in the price?', answer: 'All brand new units include shipping and brokerage. Used and refurbished units do not include shipping. Shipping for used units is paid on delivery directly to the carrier.' },
    { question: 'How long does delivery take?', answer: 'In stock units typically ship within 3 to 4 business days. Non stock units usually take 6 to 12 days.' },
    { question: 'Are miners brand new or refurbished?', answer: 'Each product page clearly states whether the unit is brand new or refurbished.' },
    { question: 'Are power cables included?', answer: 'No. Power cables are not included and must be purchased separately.' },
    { question: 'Do you support bulk orders?', answer: 'Yes. Bulk pricing and availability are available upon request.' },
    { question: 'What warranty is included?', answer: 'All used and refurbished units include a 30 day warranty from our repair center. Brand new units include the original manufacturer warranty.' },
  ],
  faq_repair: [
    { question: 'Do you offer bulk repair discounts?', answer: 'Yes. Bulk pricing depends on quantity, model, and repair type.' },
    { question: 'What brands do you repair?', answer: 'Mainly common ASIC platforms such as Bitmain and MicroBT, plus other supported models.' },
    { question: 'What is your average turnaround time?', answer: 'Typical repairs are completed in about 5 to 12 business days.' },
    { question: 'Do you offer warranty on repairs?', answer: 'Yes. Repair work includes a 30 day repair warranty on the repaired issue.' },
  ],
  services_hero: { heading: 'Fast ASIC Miner Repairs in Canada', subheading: 'Dead boards, low hashrate, hardware errors, PSU failures. Units are repaired, tested, and returned ready to run.', phone: '+15146047050' },
  services_pricing: {
    l1_title: 'Basic Hashboard Repair',   l1_cad: '$60 CAD',  l1_usd: '$45 USD',  l1_items: 'LDO reset and replacement\nEEPROM flash\nTemp sensor repair\nMOSFET replacement',
    l2_title: 'Advanced Hashboard Repair',l2_cad: '$100 CAD', l2_usd: '$75 USD',  l2_items: 'Up to 5 ASIC replacements\nReflows and trace repair\nVoltage regulator repair\nAny aluminum hashboard',
    l3_title: 'Complex Hashboard Repair', l3_cad: '$130 CAD', l3_usd: '$95 USD',  l3_items: 'Advanced microsoldering\nPad and trace rebuilds\nDeeper diagnostics\nMultiple fault recovery',
  },
  services_extra_pricing: [
    { name: 'Miner Diagnostics',    cad: '$35 CAD',  usd: '$25 USD',   note: 'Credited toward repair if approved' },
    { name: 'PSU Repair',           cad: '$120 CAD', usd: '$85 USD',   note: 'Bench tested before return' },
    { name: 'Thermal Paste',        cad: '$40 CAD',  usd: '$30 USD',   note: 'Preventive cooling service' },
    { name: 'Firmware Services',    cad: '$10 CAD',  usd: '$7.50 USD', note: 'Restore or reflash firmware' },
    { name: 'Control Board Repair', cad: '$45 CAD',  usd: '$35 USD',   note: 'Repair and validation' },
  ],
  services_trust_points: [
    { point: '2,300+ Units Repaired' }, { point: '92% Repair Success Rate' },
    { point: '5 to 12 Day Turnaround' }, { point: 'Montreal Repair Center' },
    { point: 'Board Level Repair' }, { point: 'Bulk Repair Support' },
  ],
  hosting_hero: { heading: 'ASIC Miner Hosting in Canada and the United States', subheading: 'Air cooled facilities. Live monitoring. Secure deployment for any batch size.', trust1: 'Air Cooled', trust2: 'Live Monitoring', trust3: 'Ventilation', trust4: 'Canada & U.S.' },
  hosting_tiers: {
    t1_name: 'Beginner',     t1_subtitle: 'Up to 50 kW',    t1_points: 'Best for smaller deployments\nAir cooled hosting\nSimple onboarding\nGood starting point for new batches',
    t2_name: 'Professional', t2_subtitle: '50 to 200 kW',   t2_points: 'Built for scaling operations\nPriority placement review\nMore involved coordination\nOngoing support',
    t3_name: 'Enterprise',   t3_subtitle: '200+ kW',        t3_points: 'Designed for larger deployments\nCustom planning\nDedicated handling\nBuilt for long term growth',
  },
  hosting_included: [
    { item: 'Air cooled hosting' }, { item: 'Industrial ventilation for miner airflow' },
    { item: 'Live monitoring of miner status and performance' }, { item: 'Secure facilities with controlled access' },
    { item: 'Batch deployment planning' }, { item: 'Troubleshooting and repair support' },
  ],
  about_hero: { heading: 'Built For Canadian Bitcoin Mining Operations', subheading: 'Canada BTC Miners supplies, repairs, and supports ASIC mining hardware across Canada with clear pricing, real service, and direct communication.' },
  about_stats: { s1_value: '5+', s1_label: 'Years Experience', s2_value: '2,300+', s2_label: 'Miners Repaired', s3_value: '92%', s3_label: 'Repair Success Rate', s4_value: '9,000+', s4_label: 'Units Sold' },
  about_leadership: { p1_name: 'Harout Kantanakian', p1_role: 'Founder & CEO', p1_bio: 'Oversees operations, client communication, sourcing, and growth across the business.', p1_linkedin: '', p2_name: 'Patrice Destin', p2_role: 'Co Founder', p2_bio: 'Supports technical operations, repair workflow, and day to day service execution across the business.', p2_linkedin: '' },
  about_differentiators: [{ item: 'In House Board Repair' }, { item: 'Clear Pricing Before Work Starts' }, { item: 'Tested Before Release' }, { item: 'Canadian Based Support' }],
  about_location: { address_line1: '6500 Route Transcanadienne, Suite 209', address_line2: 'Saint Laurent, Quebec H4T 1X4', map_embed_url: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2795.123456789!2d-73.7!3d45.5' },
  about_markets: [{ market: 'Canada' }, { market: 'United States' }, { market: 'Dubai' }, { market: 'Africa' }, { market: 'International Clients' }],
  about_values: [
    { title: 'Canadian Based',    text: 'Built and operated in Canada with real understanding of local mining conditions, logistics, and client needs.' },
    { title: 'Real Repair Work',  text: 'Board level repairs, diagnostics, testing, and practical support handled through a real operating business.' },
    { title: 'Straight Pricing',  text: 'Clear pricing and direct communication without unnecessary back and forth.' },
    { title: 'Long Term Support', text: 'Support for repairs, sourcing, sales, and ongoing mining operations.' },
  ],
  about_reviews: [
    { name: 'R M', text: 'Excellent service from start to finish. They diagnosed the issue quickly, explained everything clearly, and completed the repair on time. Pricing was fair and the miner is now working perfectly.', featured: '1' },
    { name: 'Stephane Brouillard', text: 'Harout always gave me great prices and matching services.', featured: '0' },
    { name: 'Chris Angus', text: 'Ordered an S19 and received an upgraded S19 Pro at no extra cost. Arrived the next day. Great service.', featured: '0' },
    { name: 'Brad Holman', text: 'They were very helpful sorting out my setup issue. Pricing was reasonable and shipping to Ontario was quick.', featured: '0' },
    { name: 'Will James', text: 'Ordered an S21. Great service, quick response, and smooth shipping in Canada.', featured: '0' },
  ],
  global_contact: { phone: '+15146047050', phone_display: '+1 (514) 604-7050', email: '', google_review: 'https://g.page/r/canadabtcminers/review', address: '6500 Route Transcanadienne, Suite 209, Saint Laurent, Quebec H4T 1X4' },
};

// In-memory cache so we only hit the API once per session
let contentCache: SiteContent | null = null;
let contentPromise: Promise<SiteContent> | null = null;

function loadContent(): Promise<SiteContent> {
  if (contentCache) return Promise.resolve(contentCache);
  if (contentPromise) return contentPromise;

  contentPromise = fetchContent()
    .then(data => { contentCache = data; return data; })
    .catch(() => { contentCache = DEFAULTS; return DEFAULTS; });

  return contentPromise;
}

// ─── useContent ───────────────────────────────────────────────────────────────
// Returns full content object. Loading=false almost immediately if cached.
export function useContent() {
  const [content, setContent] = useState<SiteContent>(contentCache ?? DEFAULTS);
  const [loading, setLoading] = useState(!contentCache);
  const mounted = useRef(true);

  useEffect(() => {
    mounted.current = true;
    if (contentCache) { setContent(contentCache); setLoading(false); return; }

    loadContent().then(data => {
      if (mounted.current) { setContent(data); setLoading(false); }
    });

    return () => { mounted.current = false; };
  }, []);

  return { content, loading };
}

// ─── useContentSection ────────────────────────────────────────────────────────
export function useContentSection<K extends keyof SiteContent>(section: K): SiteContent[K] {
  const { content } = useContent();
  return content[section] ?? DEFAULTS[section];
}

export { DEFAULTS as contentDefaults };
