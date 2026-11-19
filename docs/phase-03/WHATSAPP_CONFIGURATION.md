# WhatsApp configuration

Not configured. No number was invented.

Set the approved business number in `src/config/brand.ts`:

```ts
contact: {
  phone: "",
  whatsapp: "", // digits, for example 9647XXXXXXXX — only after the number is confirmed
}
```

`buildWhatsAppUrl` returns null while `whatsapp` is empty. The button then reads "واتساب (قيد التهيئة)". A click, once a number exists, is tracked as `whatsapp_click` and is not a saved lead.

Do not put the number only in a page component. The header, product, wholesale, and contact actions all read this field.
