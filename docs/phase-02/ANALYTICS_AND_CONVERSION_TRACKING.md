# Analytics and conversion tracking

`src/lib/analytics.ts` records events in memory and, if present, `window.dataLayer`. No third-party tag is installed. Payloads must not include name or phone.

Events used by the new pages: `page_view`, `product_view`, `add_to_quote`, `quote_submission_success`, `whatsapp_click`, `wholesale_form_success`, `custom_order_request`. `lead_qualified` and `lead_won` are defined for later staff instrumentation; the admin screen does not emit them yet.

Attribution (`utm_source`, `utm_medium`, `utm_campaign`, landing path, referrer) is stored once in `localStorage` under `manjoor-attribution` and attached to a saved lead only when submission is enabled.

Success events fire only after a reference number returns. A disabled or failed submit does not emit them.

There is no baseline of qualified leads, cost, or conversion rate. Those KPIs start when real inquiries exist.
