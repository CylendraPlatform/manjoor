import assert from 'node:assert/strict';
import test from 'node:test';
import { readFileSync } from 'node:fs';
import { execSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const src = (path) => readFileSync(join(root, path), 'utf8');

// A local, gitignored `.env` is harmless developer config and must NOT fail the
// suite. What matters for security is that no environment file is COMMITTED and
// that the example template leaks no real credentials. These checks are
// deterministic and independent of local developer configuration.
test('no environment file is tracked by git', () => {
  let tracked = '';
  try {
    tracked = execSync('git ls-files .env .env.local .env.*.local .env.production', {
      cwd: root,
      encoding: 'utf8',
    });
  } catch {
    // Not a git repo (or git unavailable): fall back to the .gitignore assertion
    // below, which still guarantees these files cannot be committed.
    tracked = '';
  }
  assert.equal(tracked.trim(), '', 'An environment file is committed to git — remove it from version control');
});

test('environment files are gitignored and the example holds no real secrets', () => {
  const gitignore = src('.gitignore');
  assert.match(gitignore, /^\.env$/m, '.env must be gitignored');
  assert.match(gitignore, /^\.env\.\*\.local$/m, '.env.*.local must be gitignored');

  // The committed template must contain placeholders only — no real Supabase
  // project URL, publishable/secret key, or JWT.
  const example = src('.env.example');
  assert.doesNotMatch(example, /[a-z0-9]{20}\.supabase\.co/, 'real Supabase URL in .env.example');
  assert.doesNotMatch(example, /sb_(secret|publishable)_[A-Za-z0-9]{10,}/, 'real Supabase key in .env.example');
  assert.doesNotMatch(example, /eyJ[A-Za-z0-9_-]{20,}/, 'JWT in .env.example');
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
