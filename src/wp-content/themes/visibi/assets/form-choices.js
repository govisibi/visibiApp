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

  const region = form.elements.visibi_region;
  const mode = form.elements.visibi_mode;
  const city = form.elements.visibi_city;
  const timezone = form.elements.visibi_timezone;
  if (!region || !mode || !city || !timezone) return;
  const adjust = () => {
    const remote = region.value === 'USA' || region.value === 'International';
    const inPersonOption = [...mode.options].find(option => option.value === 'In person');
    if (inPersonOption) inPersonOption.disabled = remote;
    if (remote && mode.value === 'In person') mode.value = 'Video call';
    const inPerson = mode.value === 'In person';
    city.required = inPerson;
    city.closest('label').hidden = !inPerson;
  };
  region.addEventListener('change', () => {
    timezone.value = ({ UK: 'UK time', UAE: 'UAE time', USA: 'US Eastern time' })[region.value] || 'Other (please specify below)';
    adjust();
  });
  mode.addEventListener('change', adjust);
  adjust();
});
