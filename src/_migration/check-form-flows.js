/* Submit labelled test data to each WordPress form type in the local preview. */
const base = (process.argv[2] || 'http://localhost:8082/v2').replace(/\/$/, '');
const stamp = Date.now();
const nonceFor = html => {
  const nonce = html.match(/name="visibi_nonce" value="([^"]+)"/);
  if (!nonce) throw new Error('Missing form nonce');
  return nonce[1];
};
const page = async path => {
  const response = await fetch(base + path);
  if (!response.ok) throw new Error(`${path}: HTTP ${response.status}`);
  return response.text();
};
const submit = async (path, fields, file) => {
  const html = await page(path);
  const values = { ...fields, visibi_nonce: nonceFor(html), visibi_return: base + path };
  let body;
  if (file) {
    body = new FormData();
    Object.entries(values).forEach(([key, value]) => body.append(key, value));
    body.append('visibi_cv', new Blob(['%PDF-1.4\n1 0 obj\n<< /Type /Catalog >>\nendobj\n%%EOF\n'], { type: 'application/pdf' }), 'preview-test-cv.pdf');
  } else body = new URLSearchParams(values);
  const response = await fetch(base + '/wp-admin/admin-post.php', { method: 'POST', body, redirect: 'manual' });
  return new URL(response.headers.get('location') || '/', base);
};
const accepted = (name, location, parameter = 'visibi_form') => {
  const state = location.searchParams.get(parameter);
  console.log(`${['sent', 'stored'].includes(state) ? 'PASS' : 'FAIL'} ${name}: ${state || 'no result'}`);
  if (!['sent', 'stored'].includes(state)) throw new Error(`${name} failed: ${location}`);
};
(async () => {
  if (!process.argv.includes('--invoice-only')) {
  const lead = { action: 'visibi_lead', visibi_name: 'VISIBI form test', visibi_email: `forms-${stamp}@example.com`, visibi_phone: '+440000000000', visibi_need: 'SEO & PPC', visibi_message: 'Local form audit test.' };
  accepted('website without scheme', await submit('/contact/', { ...lead, visibi_url: 'example.com' }));
  accepted('website with HTTP', await submit('/seo-services/', { ...lead, visibi_url: 'http://example.com' }));
  const career = { action: 'visibi_career', visibi_name: 'VISIBI career test', visibi_email: `career-${stamp}@example.com`, visibi_phone: '+440000000000', visibi_role: 'General application', visibi_location: 'Any country', visibi_portfolio: 'linkedin.com/in/preview-test', visibi_message: 'Local CV form test.' };
  accepted('career with CV', await submit('/careers/', career, true));
  const about = await page('/about/');
  const date = about.match(/name="visibi_meeting_date"[\s\S]*?<option value="(\d{4}-\d{2}-\d{2})"/);
  if (!date) throw new Error('Meeting date unavailable');
  const meeting = { action: 'visibi_meeting', visibi_name: 'VISIBI meeting test', visibi_email: `meeting-${stamp}@example.com`, visibi_phone: '+440000000000', visibi_region: 'UK', visibi_mode: 'Video call', visibi_meeting_date: date[1], visibi_meeting_time: '09:00', visibi_timezone: 'UK time', visibi_message: 'Local meeting form test.' };
  accepted('meeting request', await submit('/about/', meeting));
  accepted('newsletter', await submit('/insights/', { action: 'visibi_newsletter', visibi_email: `newsletter-${stamp}@example.com` }), 'visibi_newsletter');
  }
  accepted('invoice payment request', await submit('/pay-invoice/', { action: 'visibi_payment_request', visibi_invoice: 'VIS-2026-0142', visibi_amount: '125.50', visibi_currency: 'GBP', visibi_name: 'VISIBI payment test', visibi_email: `invoice-${stamp}@example.com`, visibi_payment_method: 'card' }));
})().catch(error => { console.error(error.message); process.exitCode = 1; });
