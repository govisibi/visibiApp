document.addEventListener('DOMContentLoaded', () => {
  const form = document.querySelector('#visibi-enquiry');
  if (!form) return;

  const role = form.elements.visibi_role;
  if (role) {
    document.querySelectorAll('#roles [id^="role-"] > button').forEach(button => {
      button.addEventListener('click', () => {
        const title = button.firstElementChild?.firstElementChild?.textContent.trim();
        if (!title) return;
        role.value = title;
        document.querySelectorAll('#roles [id^="role-"] > button').forEach(other => other.setAttribute('aria-pressed', String(other === button)));
        document.querySelector('#apply')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    });
  }

  if (form.querySelector('input[name="action"]')?.value !== 'visibi_meeting') return;
  const selected = name => form.querySelector('input[name="' + name + '"]:checked');
  const city = form.elements.visibi_city;
  const timezone = form.elements.visibi_timezone;
  const timezoneLabel = form.querySelector('[data-meeting-timezone-label]');
  const submit = form.querySelector('[data-meeting-submit]');
  const slotGroups = [...form.querySelectorAll('[data-meeting-slots]')];
  const inPerson = form.querySelector('input[name="visibi_mode"][value="In person"]');

  const updateSubmit = () => {
    const date = selected('visibi_meeting_date')?.value;
    const time = selected('visibi_meeting_time')?.value;
    if (!date || !time) {
      submit.textContent = 'Request meeting \u2192';
      return;
    }
    const day = new Date(date + 'T12:00:00').toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' });
    submit.textContent = 'Request ' + time + ' ' + day + ' \u2192';
  };

  const adjust = () => {
    const region = selected('visibi_region')?.value || 'UK';
    const remote = region === 'USA' || region === 'International';
    inPerson.disabled = remote;
    inPerson.closest('label').hidden = remote;
    if (remote && selected('visibi_mode')?.value === 'In person') {
      form.querySelector('input[name="visibi_mode"][value="Video call"]').checked = true;
    }
    const meetingInPerson = selected('visibi_mode')?.value === 'In person';
    city.closest('.visibi-meeting__city').hidden = !meetingInPerson;
    city.required = meetingInPerson;
    city.placeholder = region === 'UAE' ? 'Your city or address (e.g. Abu Dhabi)' : 'Your city or address (e.g. Manchester)';
    timezone.value = region === 'UAE' ? 'UAE time' : remote ? 'US Eastern time' : 'UK time';
    timezoneLabel.textContent = timezone.value;

    const group = remote ? 'remote' : region;
    slotGroups.forEach(slots => {
      const active = slots.dataset.meetingSlots === group;
      slots.hidden = !active;
      slots.querySelectorAll('input').forEach(input => {
        if (!active) input.checked = false;
        input.disabled = !active;
      });
    });
    updateSubmit();
  };

  form.addEventListener('change', event => {
    if (event.target.name === 'visibi_region' || event.target.name === 'visibi_mode') adjust();
    else if (event.target.name === 'visibi_meeting_date' || event.target.name === 'visibi_meeting_time') updateSubmit();
  });
  form.addEventListener('reset', () => requestAnimationFrame(adjust));
  form.addEventListener('visibi:form-result', event => {
    if (event.detail?.state === 'sent' || event.detail?.state === 'stored') form.classList.add('is-complete');
  });

  document.querySelectorAll('#offices a[href="#meet"]').forEach(link => {
    link.addEventListener('click', () => {
      const short = link.parentElement?.querySelector(':scope > div:first-child > span:first-child')?.textContent.trim();
      const region = ({ UK: 'UK', UAE: 'UAE', USA: 'USA', INTL: 'International' })[short];
      if (!region) return;
      form.classList.remove('is-complete');
      form.querySelector('input[name="visibi_region"][value="' + region + '"]').checked = true;
      form.querySelector('input[name="visibi_mode"][value="' + (region === 'UK' || region === 'UAE' ? 'In person' : 'Video call') + '"]').checked = true;
      adjust();
    });
  });
  adjust();
});
