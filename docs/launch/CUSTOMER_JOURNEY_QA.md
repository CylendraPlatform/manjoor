# Customer journey QA

Date: 2026-11-20. Combined code: `709e17e`. Local app was `http://localhost:8081` (Vite). After `npm ci` that process was stopped. No public URL.

Test inquiries are labeled **اختبار تقني منجور**. Phone numbers are omitted from this report.

## Journey A — Product inquiry

| Step | Result |
|---|---|
| Homepage | Loads; official logo; cinematic hero; 14 images, 0 broken at 1440px |
| Catalog `/products` | Static wooden bakarat, not DB inventory |
| Model `/products/bakara-02` | Image loads; inquiry link to `/wholesale?model=bakara-02` |
| WhatsApp on model | `9647871857930` + bakarat copy including `bakara-02` |
| Formal save | Bakarat quote line-items are not DB products; pathway is wholesale form (by design) |
| Admin record | Not opened this session |

## Journey B — Wholesale

| Step | Result |
|---|---|
| `/wholesale?model=bakara-02` | Interest prefills «استفسار عن بكار خشبي — نموذج 02» |
| Empty submit | Client errors: name, Iraqi phone, governorate |
| Valid form submit | UI showed a saved **رقم مرجعي** (wait succeeded) |
| Anon RPC | `MJ-261120-D75773`, `MJ-261120-8CD0D6` (labeled tests) |
| Duplicate RPC | `duplicate submission` |
| Follow-up WhatsApp | Wired after save (`متابعة الطلب عبر واتساب`); wholesale CTA uses wholesale Arabic copy |

## Journey C — Custom manufacturing

| Step | Result |
|---|---|
| `/custom-orders` | 10 concept links; disclaimer that images are not stock |
| `?concept=lamp-bases` | Status: الفكرة المختارة: قواعد مصابيح خشبية; textarea prefills `lamp-bases` |
| WhatsApp | Custom Arabic copy |
| RPC | `MJ-261120-0CE6A4` (`custom_order`) |

## Journey D — WhatsApp

Verified destinations `https://wa.me/9647871857930` on header, footer, one floating control, contact/wholesale/custom/product. Messages URL-encoded. No claim of auto-send in the saved-lead copy.

## Journey E — Admin

`/admin/login` presents email + password fields. **Not signed in this session.** Lead list/status update and non-admin denial are documented historically in `docs/phase-03/ADMIN_ACCESS.md` and are **unverified here**.

## Journey F — Safety

| Check | Result |
|---|---|
| `/checkout` | Internal-only: الشراء المباشر غير مفعّل |
| Anon lead table | 401 |
| Invalid RPC | `invalid contact` |
| Duplicate RPC | blocked |
| Indexing | `noindex,nofollow` |
| Overflow | none at 360, 390, 768, 1440; one floating WhatsApp |
| Console | React `fetchPriority` warning on hero `<img>` (React 18). Not a functional failure. |
| Fake prices | Catalog does not show invented SKU prices for bakarat |

## Viewports

Checked 1440, 768, 390, 360. **1280 not separately captured**; layout matches the 1440 desktop header path (`lg:`).
