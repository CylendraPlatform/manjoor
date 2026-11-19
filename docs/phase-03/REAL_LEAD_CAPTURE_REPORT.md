# Real lead capture report

Lead submission is on in local `.env`. The function exists on MANJOOR.

## Saved test rows
All are labeled اختبار تقني منجور and are not customers.

| Reference | Source | How |
|---|---|---|
| `MJ-261119-09F39C` | wholesale | SQL call |
| `MJ-261119-D3A1B6` | contact | anonymous REST RPC |
| `MJ-261119-04870C` | contact | the website form at `/contact` showed the reference after save |

## Rejected
- Same payload again: `duplicate submission`
- Phone `123`: `invalid contact`
- Quote for an unknown product: `product not approved`
- Anonymous `GET /rest/v1/leads`: permission denied (401)
- `SET ROLE authenticated` with no admin identity: 0 visible leads
- `SET ROLE anon`: permission denied on `leads`

## Admin screen
`/admin/leads` requires a signed-in `profiles.role = 'admin'`. There are no auth users yet, so that screen was not opened. A new signup becomes `customer` and cannot read leads until the role is set to `admin`.
