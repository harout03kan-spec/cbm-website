import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Navbar from '../../components/feature/Navbar';
import Footer from '../../components/feature/Footer';
import { useProducts } from '../../hooks/useProducts';
import { useCart } from '../../hooks/useCart';
import { useTranslation } from 'react-i18next';
import { useRecaptcha } from '../../hooks/useRecaptcha';

// ── Moneris config ─────────────────────────────────────────────────────────
const MONERIS_CHECKOUT_ID = 'chktQMUYL79187';
// Moneris Checkout JS URLs
const MONERIS_JS_PROD = 'https://gatewayt.moneris.com/chkt/js/chkt_v1.00.js';
const MONERIS_JS_TEST = 'https://gatewayt.moneris.com/chkt/js/chkt_v1.00.js';
// For prod switch to: 'https://gateway.moneris.com/chkt/js/chkt_v1.00.js'

declare global {
  interface Window {
    monerisCheckout?: {
      startCheckout: (ticket: string) => void;
      closeCheckout: (ticket: string) => void;
      setCallback: (event: string, fn: (msg: unknown) => void) => void;
    };
  }
}

const CheckoutPage = () => {
  const { t } = useTranslation();
  const { getToken } = useRecaptcha();
  const navigate = useNavigate();
  const { products } = useProducts();
  const { items: cartItems } = useCart();

  const [step, setStep]                   = useState(1);
  const [paymentMethod, setPaymentMethod] = useState<'moneris' | 'bitcoin' | 'wire'>('moneris');
  const [monerisReady, setMonerisReady]   = useState(false);
  const [monerisTicket, setMonerisTicket] = useState('');
  const [monerisError, setMonerisError]   = useState('');
  const [submitting, setSubmitting]       = useState(false);
  const monerisScriptLoaded               = useRef(false);

  const [formData, setFormData] = useState({
    email: '', firstName: '', lastName: '', company: '',
    address: '', apartment: '', city: '', province: 'ON',
    postalCode: '', phone: '',
  });

  const provinces = [
    { code: 'AB', name: 'Alberta' },
    { code: 'BC', name: 'British Columbia' },
    { code: 'MB', name: 'Manitoba' },
    { code: 'NB', name: 'New Brunswick' },
    { code: 'NL', name: 'Newfoundland and Labrador' },
    { code: 'NS', name: 'Nova Scotia' },
    { code: 'NT', name: 'Northwest Territories' },
    { code: 'NU', name: 'Nunavut' },
    { code: 'ON', name: 'Ontario' },
    { code: 'PE', name: 'Prince Edward Island' },
    { code: 'QC', name: 'Quebec' },
    { code: 'SK', name: 'Saskatchewan' },
    { code: 'YT', name: 'Yukon' },
  ];

  // Canadian tax rates per province
  // Each province has one or two tax lines shown separately in the summary
  const PROVINCE_TAX: Record<string, { lines: { label: string; rate: number }[] }> = {
    AB: { lines: [{ label: 'GST (5%)',                    rate: 0.05    }] },
    BC: { lines: [{ label: 'GST (5%)',                    rate: 0.05    },
                  { label: 'PST (7%)',                    rate: 0.07    }] },
    MB: { lines: [{ label: 'GST (5%)',                    rate: 0.05    },
                  { label: 'RST (7%)',                    rate: 0.07    }] },
    NB: { lines: [{ label: 'HST (15%)',                   rate: 0.15    }] },
    NL: { lines: [{ label: 'HST (15%)',                   rate: 0.15    }] },
    NS: { lines: [{ label: 'HST (15%)',                   rate: 0.15    }] },
    NT: { lines: [{ label: 'GST (5%)',                    rate: 0.05    }] },
    NU: { lines: [{ label: 'GST (5%)',                    rate: 0.05    }] },
    ON: { lines: [{ label: 'HST (13%)',                   rate: 0.13    }] },
    PE: { lines: [{ label: 'HST (15%)',                   rate: 0.15    }] },
    QC: { lines: [{ label: 'GST (5%)',                    rate: 0.05    },
                  { label: 'QST (9.975%)',                rate: 0.09975 }] },
    SK: { lines: [{ label: 'GST (5%)',                    rate: 0.05    },
                  { label: 'PST (6%)',                    rate: 0.06    }] },
    YT: { lines: [{ label: 'GST (5%)',                    rate: 0.05    }] },
  };

  const calculateTotals = () => {
    const subtotal = cartItems.reduce((sum, item) => {
      const p = products.find(x => x.id === item.id);
      return sum + (p ? Number(p.price) * item.quantity : 0);
    }, 0);

    const taxConfig = PROVINCE_TAX[formData.province] ?? PROVINCE_TAX['ON'];
    const taxLines  = taxConfig.lines.map(line => ({
      label:  line.label,
      rate:   line.rate,
      amount: subtotal * line.rate,
    }));
    const totalTax = taxLines.reduce((sum, l) => sum + l.amount, 0);

    const shipping = subtotal > 10000 ? 0 : 150;
    const total    = subtotal + totalTax + shipping;

    return {
      subtotal:      subtotal.toFixed(2),
      taxLines,
      totalTax:      totalTax.toFixed(2),
      shipping:      shipping.toFixed(2),
      total:         total.toFixed(2),
      freeShipping:  subtotal > 10000,
    };
  };

  const totals = calculateTotals();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // ── Load Moneris Checkout JS ──────────────────────────────────────────────
  useEffect(() => {
    if (monerisScriptLoaded.current) return;
    monerisScriptLoaded.current = true;
    const script = document.createElement('script');
    script.src = MONERIS_JS_TEST;
    script.async = true;
    script.onload = () => setMonerisReady(true);
    document.head.appendChild(script);
    return () => { /* script stays in DOM */ };
  }, []);

  // ── Request a Moneris preload ticket from your WP backend ─────────────────
  const initMonerisCheckout = async () => {
    if (submitting) return;
    setSubmitting(true);
    setMonerisError('');

    try {
      const recaptchaToken = await getToken('checkout').catch(() => '');
      // POST to WP REST endpoint that calls Moneris preload API server-side
      const res = await fetch('https://wholesaleasic.com/wp-json/cbtc/v1/moneris-preload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount:    totals.total,
          order_id:  `CBTC-${Date.now()}`,
          email:     formData.email,
          first_name: formData.firstName,
          last_name:  formData.lastName,
          recaptcha_token: recaptchaToken,
          address:    formData.address,
          city:       formData.city,
          province:   formData.province,
          postal_code: formData.postalCode,
          phone:      formData.phone,
        }),
      });

      if (!res.ok) throw new Error('Preload failed');
      const data = await res.json();

      if (!data.ticket) throw new Error(data.message || 'No ticket returned');

      setMonerisTicket(data.ticket);
      launchMonerisLightbox(data.ticket);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Payment init failed. Please try again.';
      setMonerisError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  // ── Launch Moneris iframe lightbox ────────────────────────────────────────
  const launchMonerisLightbox = (ticket: string) => {
    if (!window.monerisCheckout) {
      setMonerisError('Moneris payment library not loaded. Please refresh.');
      return;
    }

    window.monerisCheckout.setCallback('page_loaded', () => {
      console.log('Moneris checkout loaded');
    });

    window.monerisCheckout.setCallback('cancel_transaction', () => {
      window.monerisCheckout?.closeCheckout(ticket);
      setMonerisError('Payment cancelled.');
    });

    window.monerisCheckout.setCallback('error_event', (msg) => {
      console.error('Moneris error:', msg);
      setMonerisError('A payment error occurred. Please try again.');
    });

    window.monerisCheckout.setCallback('payment_receipt', (msg: unknown) => {
      console.log('Moneris payment receipt:', msg);
      window.monerisCheckout?.closeCheckout(ticket);
      navigate('/order-success');
    });

    window.monerisCheckout.setCallback('payment_complete', (msg: unknown) => {
      console.log('Moneris payment complete:', msg);
      window.monerisCheckout?.closeCheckout(ticket);
      navigate('/order-success');
    });

    window.monerisCheckout.startCheckout(ticket);
  };

  const handleShippingNext = (e: React.FormEvent) => {
    e.preventDefault();
    setStep(2);
  };

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (paymentMethod === 'moneris') {
      await initMonerisCheckout();
    } else {
      navigate('/order-success');
    }
  };

  const inputCls = 'w-full px-4 py-3 bg-midnight border border-white/20 rounded-lg text-white font-inter outline-none focus:border-crimson-accent transition-colors';

  return (
    <div className="min-h-screen bg-midnight">
      <Navbar />

      {/* Moneris inline lightbox container — Moneris renders its iframe here */}
      <div id="monerisCheckout" />

      {/* Breadcrumb */}
      <section className="pt-32 pb-8 bg-graphite border-b border-crimson-accent/20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center gap-2 text-soft-gray font-inter text-sm">
            <Link to="/" className="hover:text-crimson-accent transition-colors">Home</Link>
            <i className="ri-arrow-right-s-line"></i>
            <Link to="/cart" className="hover:text-crimson-accent transition-colors">Cart</Link>
            <i className="ri-arrow-right-s-line"></i>
            <span className="text-white">Checkout</span>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-7xl mx-auto px-6">
          <h1 className="font-orbitron font-bold text-5xl text-white mb-8">{t('checkout_title')}</h1>

          {/* Step indicator */}
          <div className="mb-12 flex items-center justify-center gap-4">
            {[['1','Shipping'],['2','Payment']].map(([num, label], i) => (
              <div key={num} className="flex items-center gap-4">
                {i > 0 && <div className={`w-16 h-0.5 ${step >= i + 1 ? 'bg-crimson-accent' : 'bg-graphite'}`} />}
                <div className={`flex items-center gap-3 ${step >= i + 1 ? 'text-crimson-accent' : 'text-soft-gray'}`}>
                  <div className={`w-10 h-10 flex items-center justify-center rounded-full font-orbitron font-bold ${step >= i + 1 ? 'bg-crimson-accent text-white' : 'bg-graphite'}`}>
                    {step > i + 1 ? <i className="ri-check-line text-xl" /> : num}
                  </div>
                  <span className="font-inter font-semibold hidden sm:inline">{label}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

            {/* ── LEFT: FORM ──────────────────────────────────────────── */}
            <div className="lg:col-span-2">

              {/* STEP 1: Shipping */}
              {step === 1 && (
                <motion.form initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
                  onSubmit={handleShippingNext}
                  className="bg-graphite border border-crimson-accent/20 rounded-2xl p-8 space-y-4"
                >
                  <h2 className="font-orbitron font-bold text-2xl text-white mb-2">{t('checkout_shipping')}</h2>

                  <div>
                    <label className="text-white font-inter font-semibold text-sm mb-2 block">{t('checkout_email')} *</label>
                    <input type="email" name="email" value={formData.email} onChange={handleInputChange} required className={inputCls} placeholder="your@email.com" />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-white font-inter font-semibold text-sm mb-2 block">{t('checkout_first')} *</label>
                      <input type="text" name="firstName" value={formData.firstName} onChange={handleInputChange} required className={inputCls} />
                    </div>
                    <div>
                      <label className="text-white font-inter font-semibold text-sm mb-2 block">{t('checkout_last')} *</label>
                      <input type="text" name="lastName" value={formData.lastName} onChange={handleInputChange} required className={inputCls} />
                    </div>
                  </div>

                  <div>
                    <label className="text-white font-inter font-semibold text-sm mb-2 block">Company (Optional)</label>
                    <input type="text" name="company" value={formData.company} onChange={handleInputChange} className={inputCls} />
                  </div>

                  <div>
                    <label className="text-white font-inter font-semibold text-sm mb-2 block">{t('checkout_address')} *</label>
                    <input type="text" name="address" value={formData.address} onChange={handleInputChange} required className={inputCls} placeholder="Street address" />
                  </div>

                  <div>
                    <label className="text-white font-inter font-semibold text-sm mb-2 block">Apartment, Suite (Optional)</label>
                    <input type="text" name="apartment" value={formData.apartment} onChange={handleInputChange} className={inputCls} />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-white font-inter font-semibold text-sm mb-2 block">{t('checkout_city')} *</label>
                      <input type="text" name="city" value={formData.city} onChange={handleInputChange} required className={inputCls} />
                    </div>
                    <div>
                      <label className="text-white font-inter font-semibold text-sm mb-2 block">{t('checkout_province')} *</label>
                      <select name="province" value={formData.province} onChange={handleInputChange} required className={inputCls + ' cursor-pointer'}>
                        {provinces.map(p => <option key={p.code} value={p.code}>{p.name}</option>)}
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-white font-inter font-semibold text-sm mb-2 block">{t('checkout_postal')} *</label>
                      <input type="text" name="postalCode" value={formData.postalCode} onChange={handleInputChange} required className={inputCls} placeholder="A1A 1A1" />
                    </div>
                    <div>
                      <label className="text-white font-inter font-semibold text-sm mb-2 block">{t('checkout_phone')} *</label>
                      <input type="tel" name="phone" value={formData.phone} onChange={handleInputChange} required className={inputCls} placeholder="(514) 000-0000" />
                    </div>
                  </div>

                  <button type="submit" className="mt-4 w-full py-4 bg-gradient-crimson text-white font-inter font-bold text-lg rounded-xl hover:scale-[1.01] transition-transform cursor-pointer">
                    {t('checkout_contact')}
                  </button>
                </motion.form>
              )}

              {/* STEP 2: Payment */}
              {step === 2 && (
                <motion.form initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
                  onSubmit={handlePlaceOrder}
                  className="space-y-6"
                >
                  <div className="bg-graphite border border-crimson-accent/20 rounded-2xl p-8">
                    <h2 className="font-orbitron font-bold text-2xl text-white mb-6">Payment Method</h2>

                    <div className="space-y-4 mb-6">
                      {/* Moneris / Card */}
                      <label className={`flex items-start gap-4 p-4 bg-midnight border-2 rounded-xl cursor-pointer transition-colors ${paymentMethod === 'moneris' ? 'border-crimson-accent' : 'border-white/20 hover:border-crimson-accent/50'}`}>
                        <input type="radio" name="paymentMethod" value="moneris" checked={paymentMethod === 'moneris'} onChange={() => setPaymentMethod('moneris')} className="mt-1 w-5 h-5 accent-crimson-accent cursor-pointer" />
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-1">
                            <span className="text-white font-inter font-semibold">Credit / Debit Card</span>
                            <div className="flex items-center gap-2">
                              <span className="bg-[#1a1f71] text-white text-xs font-bold px-2 py-0.5 rounded">VISA</span>
                              <span className="bg-[#eb001b] text-white text-xs font-bold px-2 py-0.5 rounded">MC</span>
                              <span className="bg-[#2E77BC] text-white text-xs font-bold px-1.5 py-0.5 rounded text-[10px]">AMEX</span>
                            </div>
                          </div>
                          <p className="text-soft-gray font-inter text-sm">Secure payment via Moneris — Canadian payment processor</p>
                        </div>
                      </label>

                      {/* Bitcoin */}
                      <label className={`flex items-start gap-4 p-4 bg-midnight border-2 rounded-xl cursor-pointer transition-colors ${paymentMethod === 'bitcoin' ? 'border-crimson-accent' : 'border-white/20 hover:border-crimson-accent/50'}`}>
                        <input type="radio" name="paymentMethod" value="bitcoin" checked={paymentMethod === 'bitcoin'} onChange={() => setPaymentMethod('bitcoin')} className="mt-1 w-5 h-5 accent-crimson-accent cursor-pointer" />
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-1">
                            <span className="text-white font-inter font-semibold">Bitcoin (BTC)</span>
                            <i className="ri-bitcoin-line text-2xl text-amber-400"></i>
                          </div>
                          <p className="text-soft-gray font-inter text-sm">Pay with cryptocurrency · 2% discount applied</p>
                        </div>
                      </label>

                      {/* Wire */}
                      <label className={`flex items-start gap-4 p-4 bg-midnight border-2 rounded-xl cursor-pointer transition-colors ${paymentMethod === 'wire' ? 'border-crimson-accent' : 'border-white/20 hover:border-crimson-accent/50'}`}>
                        <input type="radio" name="paymentMethod" value="wire" checked={paymentMethod === 'wire'} onChange={() => setPaymentMethod('wire')} className="mt-1 w-5 h-5 accent-crimson-accent cursor-pointer" />
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-1">
                            <span className="text-white font-inter font-semibold">Bank Wire Transfer</span>
                            <i className="ri-bank-line text-2xl text-soft-gray"></i>
                          </div>
                          <p className="text-soft-gray font-inter text-sm">Direct bank transfer · 1–3 business days</p>
                        </div>
                      </label>
                    </div>

                    {/* Moneris info panel */}
                    {paymentMethod === 'moneris' && (
                      <div className="bg-midnight border border-crimson-accent/30 rounded-xl p-5">
                        <div className="flex items-center gap-3 mb-3">
                          <i className="ri-shield-check-fill text-green-400 text-2xl"></i>
                          <span className="text-white font-inter font-semibold">Secure Canadian Payment</span>
                        </div>
                        <p className="text-soft-gray font-inter text-sm leading-relaxed">
                          Clicking "Place Order" will open the Moneris secure payment window. Your card details are entered directly on Moneris — we never see or store your card information.
                        </p>
                        <div className="mt-3 flex items-center gap-4 text-xs text-soft-gray font-inter">
                          <span><i className="ri-lock-fill text-crimson-accent mr-1"></i>256-bit SSL</span>
                          <span><i className="ri-shield-star-fill text-crimson-accent mr-1"></i>PCI DSS Compliant</span>
                          <span><i className="ri-canada-fill text-crimson-accent mr-1"></i>Canadian Processor</span>
                        </div>
                        {!monerisReady && (
                          <p className="mt-3 text-amber-400 text-xs font-inter flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse inline-block"></span>
                            Loading payment library...
                          </p>
                        )}
                      </div>
                    )}

                    {/* Bitcoin info */}
                    {paymentMethod === 'bitcoin' && (
                      <div className="bg-midnight border border-amber-500/30 rounded-xl p-5 space-y-3">
                        <p className="text-white font-inter text-sm">After placing your order, you will receive Bitcoin payment instructions via email. Your order is processed once payment is confirmed on-chain.</p>
                        <div className="bg-green-600/10 border border-green-600/30 rounded-lg p-3">
                          <div className="flex items-center gap-2 text-green-400 font-inter font-semibold text-sm mb-1">
                            <i className="ri-discount-percent-line"></i> 2% Discount Applied
                          </div>
                          <p className="text-soft-gray font-inter text-xs">You save ${(Number(totals.total) * 0.02).toFixed(2)} CAD</p>
                        </div>
                      </div>
                    )}

                    {/* Wire info */}
                    {paymentMethod === 'wire' && (
                      <div className="bg-midnight border border-white/20 rounded-xl p-5">
                        <p className="text-white font-inter text-sm mb-3">Wire transfer details will be sent to your email after order confirmation. Include your order number in the transfer reference.</p>
                        <div className="space-y-2 text-sm">
                          {[['Bank','TD Canada Trust'],['Account Name','Canada BTC Miners Inc.']].map(([k,v]) => (
                            <div key={k} className="flex justify-between">
                              <span className="text-soft-gray font-inter">{k}:</span>
                              <span className="text-white font-inter font-semibold">{v}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {monerisError && (
                      <div className="mt-4 bg-red-950/40 border border-red-800 rounded-xl p-4 text-red-400 font-inter text-sm flex items-center gap-2">
                        <i className="ri-error-warning-fill text-xl"></i>
                        {monerisError}
                      </div>
                    )}
                  </div>

                  {/* Terms */}
                  <div className="bg-graphite border border-crimson-accent/20 rounded-2xl p-6">
                    <label className="flex items-start gap-3 cursor-pointer">
                      <input type="checkbox" required className="mt-1 w-5 h-5 accent-crimson-accent cursor-pointer" />
                      <span className="text-white font-inter text-sm">
                        I agree to the <a href="#" className="text-crimson-accent hover:underline">Terms & Conditions</a> and <a href="#" className="text-crimson-accent hover:underline">Privacy Policy</a>. I understand all sales are final and shipping times are estimates.
                      </span>
                    </label>
                  </div>

                  <div className="flex gap-4">
                    <button type="button" onClick={() => setStep(1)} className="flex-1 py-4 border-2 border-crimson-accent text-crimson-accent font-inter font-bold text-lg rounded-xl hover:bg-crimson-accent hover:text-white transition-all cursor-pointer">
                      ← Back
                    </button>
                    <button type="submit" disabled={submitting || (paymentMethod === 'moneris' && !monerisReady)}
                      className="flex-1 py-4 bg-gradient-crimson text-white font-inter font-bold text-lg rounded-xl hover:scale-[1.01] transition-transform cursor-pointer disabled:opacity-60 disabled:scale-100 disabled:cursor-not-allowed"
                    >
                      {submitting
                        ? <><span className="inline-block w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2 align-middle"></span>Processing...</>
                        : <><i className="ri-lock-fill mr-2"></i>Place Order</>
                      }
                    </button>
                  </div>
                </motion.form>
              )}
            </div>

            {/* ── RIGHT: ORDER SUMMARY ────────────────────────────────── */}
            <div className="lg:col-span-1">
              <div className="bg-graphite border border-crimson-accent/20 rounded-2xl p-6 sticky top-24">
                <h2 className="font-orbitron font-bold text-2xl text-white mb-6">Order Summary</h2>

                <div className="space-y-3 mb-6 pb-6 border-b border-white/10">
                  {cartItems.map(item => {
                    const p = products.find(x => x.id === item.id);
                    if (!p) return null;
                    return (
                      <div key={item.id} className="flex justify-between items-center gap-3">
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="w-12 h-12 bg-black rounded-lg overflow-hidden flex-shrink-0">
                            <img src={p.image} alt={p.name} className="w-full h-full object-contain" />
                          </div>
                          <div className="min-w-0">
                            <div className="text-white font-inter text-sm font-semibold truncate">{p.name}</div>
                            <div className="text-soft-gray font-inter text-xs">Qty: {item.quantity}</div>
                          </div>
                        </div>
                        <div className="text-white font-orbitron font-bold text-sm whitespace-nowrap">
                          ${(Number(p.price) * item.quantity).toLocaleString()}
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="space-y-3 mb-6 pb-6 border-b border-white/10">
                  <div className="flex justify-between items-center">
                    <span className="font-inter text-sm text-soft-gray">Subtotal</span>
                    <span className="font-orbitron font-bold text-white">${totals.subtotal}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-inter text-sm text-soft-gray">Shipping</span>
                    <span className={`font-orbitron font-bold ${totals.freeShipping ? 'text-green-400' : 'text-white'}`}>
                      {totals.freeShipping ? 'FREE' : `$${totals.shipping}`}
                    </span>
                  </div>
                  {totals.taxLines.map(line => (
                    <div key={line.label} className="flex justify-between items-center">
                      <span className="font-inter text-sm text-soft-gray">{line.label}</span>
                      <span className="font-orbitron font-bold text-white">${line.amount.toFixed(2)}</span>
                    </div>
                  ))}
                  {paymentMethod === 'bitcoin' && (
                    <div className="flex justify-between items-center">
                      <span className="font-inter text-sm text-green-400">BTC Discount (2%)</span>
                      <span className="font-orbitron font-bold text-green-400">-${(Number(totals.total) * 0.02).toFixed(2)}</span>
                    </div>
                  )}
                </div>

                <div className="flex justify-between items-center mb-6">
                  <span className="text-white font-inter font-bold text-xl">Total</span>
                  <span className="text-crimson-accent font-orbitron font-bold text-4xl">
                    ${paymentMethod === 'bitcoin'
                      ? (Number(totals.total) * 0.98).toFixed(2)
                      : Number(totals.total).toLocaleString()}
                    <span className="text-sm text-soft-gray font-inter ml-1">CAD</span>
                  </span>
                </div>

                <div className="space-y-3 pt-6 border-t border-white/10">
                  {[
                    ['ri-shield-check-fill', '256-bit SSL Encryption'],
                    ['ri-lock-fill', 'PCI DSS Compliant'],
                    ['ri-canada-fill', 'Secure Canadian Checkout — Moneris'],
                  ].map(([icon, text]) => (
                    <div key={text} className="flex items-center gap-3 text-soft-gray font-inter text-sm">
                      <i className={`${icon} text-crimson-accent text-xl`}></i>
                      <span>{text}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default CheckoutPage;
