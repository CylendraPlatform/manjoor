import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  // NOTE: appId (native bundle identifier) intentionally unchanged in Phase 01.
  // Renaming it to a com.manjoor.* identifier desynchronizes the existing
  // android/ (com.sabaa.store) and ios/ native projects and requires
  // regenerating them via `npx cap sync`; that is a deliberate Phase 02 task.
  appId: 'com.dukany.store',
  appName: 'MANJOOR',
  webDir: 'dist',
  server: {
    androidScheme: 'https',
  },
  android: {
    allowMixedContent: true,
  },
};

export default config;
