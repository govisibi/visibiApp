/* Keep public WordPress forms in place while retaining native POST as a fallback. */
document.addEventListener('DOMContentLoaded', () => {
  const actions = new Set(['visibi_lead', 'visibi_meeting', 'visibi_career', 'visibi_newsletter', 'visibi_payment_request']);
  document.addEventListener('submit', async event => {
    const form = event.target;
    if (!(form instanceof HTMLFormElement) || !actions.has(form.querySelector('input[name="action"]')?.value)) return;
    event.preventDefault();
    if (form.dataset.visibiSending === '1') return;
    form.dataset.visibiSending = '1';
    const button = form.querySelector('[type="submit"]');
    const originalText = button?.textContent;
    if (button) { button.disabled = true; button.textContent = 'Sending…'; }
    const message = form.querySelector('.visibi-form__message') || document.createElement('p');
    message.className = 'visibi-form__message';
    message.setAttribute('role', 'status');
    message.textContent = '';
    if (!message.isConnected) form.prepend(message);
    let state = 'network';
    try {
      const response = await fetch(form.getAttribute('action'), {
        method: 'POST',
        body: new FormData(form),
        headers: { 'X-Visibi-Ajax': '1', Accept: 'application/json' },
        credentials: 'same-origin'
      });
      const result = await response.json();
      state = result?.data?.state || 'network';
      message.textContent = result?.data?.message || 'We could not send your request. Please try again.';
      message.setAttribute('role', response.ok && result.success ? 'status' : 'alert');
      if (response.ok && result.success && (state === 'sent' || state === 'stored' || state === 'already')) {
        form.reset();
        form.querySelectorAll('[data-peak-history]').forEach(choice => choice.setAttribute('aria-pressed', 'false'));
      }
    } catch {
      message.textContent = 'We could not send your request. Please try again.';
      message.setAttribute('role', 'alert');
    } finally {
      if (button) { button.disabled = false; button.textContent = originalText; }
      delete form.dataset.visibiSending;
      form.dispatchEvent(new CustomEvent('visibi:form-result', { bubbles: true, detail: { state } }));
    }
  });
});
