/* Submit one clearly identified test enquiry to the local preview. */
const base = 'http://localhost:8082/v2';
(async () => {
  const html = await (await fetch(base + '/contact/')).text();
  const nonce = html.match(/name="visibi_nonce" value="([^"]+)"/);
  if (!nonce) throw new Error('Lead form nonce not found');
  const body = new URLSearchParams({
    action: 'visibi_lead', visibi_nonce: nonce[1], visibi_return: base + '/contact/',
    visibi_name: 'VISIBI Preview Test', visibi_email: 'preview-test@example.com',
    visibi_phone: '+0000000000', visibi_url: 'https://example.com',
    visibi_need: 'Free AI visibility audit', visibi_message: 'Local preview smoke test. Please ignore.'
  });
  const response = await fetch(base + '/wp-admin/admin-post.php', { method: 'POST', body, redirect: 'manual' });
  const location = response.headers.get('location') || '';
  if (response.status !== 302 || !location.includes('visibi_form=sent')) throw new Error(`Form submission failed: ${response.status} ${location}`);
  console.log('Test enquiry accepted and redirected to the success message.');
})().catch(error => { console.error(error.message); process.exitCode = 1; });
