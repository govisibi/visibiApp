import { cmsWordpressUrl } from './client'

let installed = false

export function installCmsFormHandler() {
  if (installed) return
  installed = true

  document.addEventListener('submit', async (event) => {
    const form = event.target
    if (!(form instanceof HTMLFormElement) || !form.closest('.wpcf7')) return

    event.preventDefault()
    event.stopImmediatePropagation()

    const formId = form.querySelector('[name="_wpcf7"]')?.value
    const feedback = form.querySelector('.wpcf7-response-output')
    const submit = form.querySelector('[type="submit"]')
    if (!formId) return

    form.querySelectorAll('.wpcf7-not-valid-tip').forEach((tip) => tip.remove())
    if (submit) submit.disabled = true
    if (feedback) {
      feedback.textContent = 'Sending...'
      feedback.style.display = 'block'
    }

    try {
      const response = await fetch(
        cmsWordpressUrl() + '/wp-json/contact-form-7/v1/contact-forms/' + encodeURIComponent(formId) + '/feedback',
        { method: 'POST', body: new FormData(form) },
      )
      const result = await response.json()
      if (feedback) {
        feedback.textContent = result.message || (response.ok ? 'Form submitted.' : 'Could not send your message.')
        feedback.style.display = 'block'
      }
      for (const invalid of result.invalid_fields || []) {
        const field = form.elements.namedItem(invalid.field)
        const control = field instanceof RadioNodeList ? field[0] : field
        const wrap = control?.closest?.('.wpcf7-form-control-wrap')
        if (wrap) {
          const tip = document.createElement('span')
          tip.className = 'wpcf7-not-valid-tip'
          tip.setAttribute('role', 'alert')
          tip.textContent = invalid.message
          wrap.appendChild(tip)
        }
      }
      form.dataset.status = result.status || 'error'
      if (result.status === 'mail_sent') form.reset()
    } catch {
      if (feedback) {
        feedback.textContent = 'Could not send your message. Please try again.'
        feedback.style.display = 'block'
      }
      form.dataset.status = 'error'
    } finally {
      if (submit) submit.disabled = false
    }
  }, true)
}
