# WhatsApp configuration

Not configured. No number was invented.

Set the approved business number in `src/config/brand.ts`:

```ts
contact: {
  phone: "",
  whatsapp: "", // digits, for example 9647XXXXXXXX — only after the number is confirmed
}
```

`buildWhatsAppUrl` returns null while `whatsapp` is empty. Public WhatsApp buttons are hidden until a number is set; form-based inquiries stay available. A click, once a number exists, is tracked as `whatsapp_click` and is not a saved lead.

Do not put the number only in a page component. The header, product, wholesale, and contact actions all read this field.
