import assert from 'node:assert/strict';
import test from 'node:test';
import { readFileSync, existsSync } from 'node:fs';
const src = (path) => readFileSync(new URL(`../${path}`, import.meta.url), 'utf8');
test('original credentials absent from working tree', () => {
  assert.equal(existsSync(new URL('../.env', import.meta.url)), false);
  assert.equal(existsSync(new URL('../.env.local', import.meta.url)), false);
});
test('public commerce disabled by default', () => {
  assert.match(src('src/config/bounty.ts'), /VITE_ENABLE_PUBLIC_SALES === "true"/);
  assert.match(src('src/App.tsx'), /publicPage\(<Checkout \/>\)/);
  assert.match(src('src/App.tsx'), /publicPage\(<Index \/>\)/);
  assert.match(src('src/App.tsx'), /publicPage\(<AgentOrders \/>\)/);
});
test('inventory uses atomic RPC rather than split update and movement insert', () => {
  const inventory = src('src/pages/admin/Inventory.tsx');
  assert.match(inventory, /rpc\("bounty_adjust_stock"/);
  assert.doesNotMatch(inventory, /from\("stock_movements"\)\.insert/);
});
test('backend migration contains public order lock and stock transaction', () => {
  const migration = src('supabase/migrations/20261116000100_bounty_p0_stock_and_lockdown.sql');
  assert.match(migration, /REVOKE EXECUTE ON FUNCTION %s FROM PUBLIC, anon, authenticated/);
  assert.match(migration, /FOR UPDATE/);
});
