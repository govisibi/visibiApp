#!/bin/sh
set -eu
export HOME=/tmp

if [ "$(wp option get visibi_cf7_template_seeded 2>/dev/null || true)" = "1" ]; then
  echo 'Contact form template already seeded; keeping WordPress edits.'
  exit 0
fi

form_id="$(wp post list --post_type=wpcf7_contact_form --field=ID | head -n 1)"
if [ -z "$form_id" ]; then
  echo 'Create a Contact Form 7 form before running this script.' >&2
  exit 1
fi

wp post meta update "$form_id" _form "$(cat /opt/visibi/contact-form-template.txt)" >/dev/null
mail_body='From: [your-name] <[your-email]>
Company: [your-company]
Topic: [your-subject]

Message:
[your-message]

--
Sent from [_site_title] ([_site_url]).'
wp post meta patch update "$form_id" _mail body "$mail_body" >/dev/null
wp option update visibi_contact_form_id "$form_id" >/dev/null
wp option update visibi_cf7_template_seeded 1 >/dev/null
echo "Configured Contact Form 7 form $form_id."
