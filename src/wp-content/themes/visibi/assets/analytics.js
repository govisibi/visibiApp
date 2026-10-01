/* Govisibi data-layer events. Keep personal and form field values out of analytics. */
document.addEventListener('DOMContentLoaded', () => {
  const parameterKeys = ['form_type', 'delivery_status', 'cta_category', 'cta_placement', 'destination_path', 'contact_method', 'interaction_type', 'interaction_area', 'interaction_label'];
  const push = (event, details = {}) => {
    window.dataLayer = window.dataLayer || [];
    const cleared = Object.fromEntries(parameterKeys.map(key => [key, null]));
    window.dataLayer.push({ event, page_path: window.location.pathname, ...cleared, ...details });
  };
  const formTypes = {
    visibi_lead: 'enquiry',
    visibi_meeting: 'meeting',
    visibi_career: 'career',
    visibi_newsletter: 'newsletter',
    visibi_payment_request: 'payment_request'
  };
  const pendingKey = 'visibi_analytics_pending_form';
  const formType = form => {
    const action = form.querySelector('input[name="action"]')?.value;
    if (!Object.prototype.hasOwnProperty.call(formTypes, action)) return '';
    return action === 'visibi_lead' && form.querySelector('input[name="visibi_peak_audit"]') ? 'peak_audit' : formTypes[action];
  };
  const successEvents = {
    enquiry: 'generate_lead',
    peak_audit: 'generate_lead',
    meeting: 'meeting_request',
    career: 'job_application',
    newsletter: 'sign_up',
    payment_request: 'visibi_payment_request'
  };
  const getPending = () => {
    try { return JSON.parse(window.sessionStorage.getItem(pendingKey) || 'null'); }
    catch { return null; }
  };
  const forgetPending = () => {
    try { window.sessionStorage.removeItem(pendingKey); } catch {}
  };

  const recordResult = (type, state) => {
    const details = { form_type: type, delivery_status: state };
    if ((state === 'sent' || state === 'stored') && successEvents[type]) push(successEvents[type], details);
    else if (state === 'already') push('visibi_form_duplicate', details);
    else if (state === 'error' || state === 'rate' || state === 'network') push('visibi_form_error', details);
  };

  const params = new URLSearchParams(window.location.search);
  const result = params.get('visibi_newsletter') || params.get('visibi_form');
  const pending = getPending();
  if (pending && result && pending.path === window.location.pathname && Date.now() - pending.at < 20 * 60 * 1000) {
    forgetPending();
    recordResult(pending.type, result);
  }
  document.addEventListener('visibi:form-result', event => {
    const type = formType(event.target);
    if (!type) return;
    forgetPending();
    recordResult(type, event.detail?.state || 'network');
  });

  const started = new WeakSet();
  document.addEventListener('focusin', event => {
    const form = event.target.closest('form');
    const type = form && formType(form);
    if (!type || started.has(form)) return;
    started.add(form);
    push('visibi_form_start', { form_type: type });
  });
  document.addEventListener('submit', event => {
    const type = formType(event.target);
    if (type) {
      try { window.sessionStorage.setItem(pendingKey, JSON.stringify({ type, path: window.location.pathname, at: Date.now() })); } catch {}
      push('visibi_form_attempt', { form_type: type });
    } else if (event.target.matches('form[role="search"],form.visibi-search')) {
      push('visibi_site_search');
    }
  }, true);

  const placement = element => {
    if (element.closest('.visibi-announcement')) return 'announcement';
    if (element.closest('.site-mobile-sheet')) return 'mobile_menu';
    if (element.closest('.site-mega')) return 'services_menu';
    if (element.closest('.site-header')) return 'header';
    if (element.closest('.site-footer')) return 'footer';
    if (element.closest('.visibi-mobile-cta')) return 'mobile_bar';
    return 'content';
  };
  const category = url => {
    if (/peak-traffic-readiness/.test(url.pathname)) return 'peak_readiness';
    if (/\/contact\/?$/.test(url.pathname)) return 'contact';
    if (/\/about\/?$/.test(url.pathname) && url.hash === '#meet') return 'meeting';
    if (/\/radar\/?$/.test(url.pathname)) return 'radar';
    if (/\/careers\/?$/.test(url.pathname)) return 'careers';
    if (/^#(audit|form|quote|call|start|meet)$/.test(url.hash)) return 'audit_or_enquiry';
    return 'other';
  };
  document.addEventListener('click', event => {
    const link = event.target.closest('a[href]');
    if (link) {
      const href = link.getAttribute('href') || '';
      if (/^(mailto:|tel:)/i.test(href)) {
        push('visibi_contact_click', { contact_method: href.startsWith('tel:') ? 'phone' : 'email', cta_placement: placement(link) });
        return;
      }
      let url;
      try { url = new URL(href, window.location.href); } catch { return; }
      if (url.origin !== window.location.origin) return;
      if (link.closest('[data-visibi-insights-list]') && link.hasAttribute('data-visibi-insight-card')) {
        push('visibi_article_click', { destination_path: url.pathname });
        return;
      }
      const promotion = link.matches('[data-black-friday-promo],[data-announcement-link]');
      const prominent = link.matches('.site-header__cta,.site-mobile-sheet__audit,.site-footer__actions a,.visibi-mobile-cta,.site-mega__promos a,.site-mobile-service__promo');
      const target = category(url);
      if (promotion || prominent || target !== 'other') {
        push('visibi_cta_click', {
          cta_category: target,
          cta_placement: placement(link),
          destination_path: url.pathname + url.hash
        });
      }
      return;
    }
    const button = event.target.closest('button,[role="tab"]');
    if (!button || button.type === 'submit' || button.closest('.visibi-announcement')) return;
    if (!button.closest('.visibi-content') && !button.matches('[data-service-tab],[data-mobile-tab]')) return;
    const section = button.closest('[data-screen-label]');
    let interaction = 'content_control';
    if (button.matches('[data-peak-faq]')) interaction = 'faq';
    else if (button.matches('[data-peak-week],[data-peak-phase]')) interaction = 'peak_timeline';
    else if (button.matches('[data-peak-history]')) interaction = 'peak_history';
    else if (button.matches('[data-peak-promo-apply]')) interaction = 'promo_code_control';
    else if (button.matches('[data-visibi-insights-more]')) interaction = 'insights_more';
    else if (button.matches('[data-service-tab]')) interaction = 'service_category';
    else if (button.matches('[data-mobile-tab]')) interaction = 'mobile_menu_tab';
    const details = { interaction_type: interaction, interaction_area: section?.dataset.screenLabel || section?.id || window.location.pathname };
    if (window.location.pathname === '/insights/' && button.closest('section[data-screen-label="Hero"]')) {
      details.interaction_label = button.textContent.trim().slice(0, 50);
    }
    push('visibi_ui_interaction', details);
  });
  document.addEventListener('change', event => {
    if (!event.target.matches('input[type="range"]') || !event.target.closest('.visibi-content')) return;
    push('visibi_ui_interaction', { interaction_type: 'calculator_adjust', interaction_area: window.location.pathname });
  });
});
