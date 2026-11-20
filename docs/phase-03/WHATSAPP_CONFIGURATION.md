# WhatsApp configuration

Temporary sales number (replace later): `9647871857930`.

Set it as:

```
VITE_BUSINESS_WHATSAPP=9647871857930
```

`src/lib/whatsapp.ts` normalizes Iraqi `07…` to `9647…` and builds `https://wa.me/{digits}?text=`. Buttons hide when the env (and `brand.contact.whatsapp`) are empty. Never build a wa.me link from a visitor phone.

Prefill topics: general, bakarat model, wholesale, custom, and post-save follow-up with the real `MJ-` reference. A click is not a saved lead and is not an automatic send.
