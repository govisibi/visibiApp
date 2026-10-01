# Govisibi GA4 event setup

The site pushes privacy-safe events to `window.dataLayer`. Event-specific parameters are reset on every push so old form details cannot leak into later click events. GTM container `GTM-M44X766F` currently has the base Google tag for measurement ID `G-Q3LD53L5J6`. The steps below are needed in GTM for these events to reach GA4. Use a new GTM workspace and Preview/Tag Assistant before publishing.

## 1. Create one GA4 Event tag

1. In **GTM > Variables > Configure**, enable the built-in **Event** variable.
2. In **Variables > User-Defined > New**, create Version 2 Data Layer Variables for each name below. Name them `DLV - form_type`, etc.
3. In **Triggers > New**, choose **Custom Event** and enable regex matching. Use this event-name regex:

   ```text
   ^(generate_lead|meeting_request|job_application|sign_up|visibi_payment_request|visibi_form_start|visibi_form_attempt|visibi_form_error|visibi_form_duplicate|visibi_cta_click|visibi_contact_click|visibi_ui_interaction|visibi_site_search|visibi_article_click)$
   ```

4. In **Tags > New**, choose **Google Analytics: GA4 Event**. Select the existing Google tag `G-Q3LD53L5J6` (do not add another Google tag). Set **Event Name** to `{{Event}}`. Add the Custom Event trigger from step 3.
5. Add these event parameters to that tag, each mapped to its matching Data Layer Variable:

   | Parameter | Data Layer Variable |
   | --- | --- |
   | `page_path` | `DLV - page_path` |
   | `form_type` | `DLV - form_type` |
   | `delivery_status` | `DLV - delivery_status` |
   | `cta_category` | `DLV - cta_category` |
   | `cta_placement` | `DLV - cta_placement` |
   | `destination_path` | `DLV - destination_path` |
   | `contact_method` | `DLV - contact_method` |
   | `interaction_type` | `DLV - interaction_type` |
   | `interaction_area` | `DLV - interaction_area` |
   | `interaction_label` | `DLV - interaction_label` |

6. Preview on a local or production page and confirm only one GA4 Event tag fires per pushed event. Then publish the GTM workspace.

## 2. Mark key events in GA4

In **GA4 Admin > Data display > Events/Key events**, mark only these four as key events:

- `generate_lead` — successful enquiry or peak-readiness audit request
- `meeting_request` — successful meeting request
- `job_application` — successful career application
- `sign_up` — new newsletter subscriber

`visibi_payment_request` is an administrative invoice request, not a payment or purchase. Leave it and all click/start/error events as non-key events. A `stored` form result counts as accepted because WordPress saved the request even if the email notification failed. A repeat newsletter address produces `visibi_form_duplicate`, not `sign_up`.

## 3. Verify

- Use GTM Preview/Tag Assistant to inspect the data layer after a CTA click, a form start, and a test submission. The form conversion must fire only after WordPress returns a successful AJAX JSON response. If JavaScript is unavailable, the native form redirect remains available and the redirect is tracked on the next page load.
- Use GA4 DebugView or Realtime to confirm the same event names and parameters. GA4 reporting may take longer to populate.
- Submit no real customer data for tests. The site sends no name, email, phone, message, entered URL, search query, invoice number, or amount in these events.
- GA4 Enhanced Measurement may also collect its own `form_start`/`form_submit`. The site uses `visibi_form_start` and `visibi_form_attempt` to keep its events distinct; only the accepted-result events above are key events.
