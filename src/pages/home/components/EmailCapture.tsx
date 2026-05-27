import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useRecaptcha } from '../../../hooks/useRecaptcha';

export default function EmailCapture() {
  const { t } = useTranslation();
  const { getToken } = useRecaptcha();
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setStatus('submitting');
    try {
      const recaptchaToken = await getToken('newsletter_subscribe').catch(() => '');
      const formData = new URLSearchParams();
      formData.append('email', email);
      if (recaptchaToken) formData.append('recaptcha_token', recaptchaToken);
      const response = await fetch('https://readdy.ai/api/form/d61149950i17hner1g30', { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body: formData.toString() });
      if (response.ok) { setStatus('success'); setEmail(''); } else { setStatus('error'); }
    } catch { setStatus('error'); }
  };

  return (
    <section className="py-20 px-6 bg-[#0A0A0A]">
      <div className="max-w-2xl mx-auto text-center">
        <h2 className="text-3xl font-bold text-white mb-4">{t('email_title')}</h2>
        <p className="text-gray-400 mb-8">{t('email_sub')}</p>
        <form id="newsletter_subscription" data-readdy-form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 max-w-xl mx-auto mb-3">
          <input type="email" name="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder={t('email_placeholder')} required className="flex-1 px-6 py-4 bg-[#1A1A1A] text-white placeholder-gray-500 border-none focus:outline-none focus:ring-2 focus:ring-[#DC2626]" />
          <button type="submit" disabled={status === 'submitting'} className="px-8 py-4 bg-[#DC2626] text-white font-semibold whitespace-nowrap hover:bg-[#B91C1C] transition-colors disabled:opacity-50">
            {status === 'submitting' ? t('email_subscribing') : t('email_btn')}
          </button>
        </form>
        {status === 'success' && <p className="text-green-500 text-sm mb-2">{t('email_success')}</p>}
        {status === 'error' && <p className="text-red-500 text-sm mb-2">{t('email_error')}</p>}
        <p className="text-gray-600 text-sm">{t('email_nospam')}</p>
      </div>
    </section>
  );
}
