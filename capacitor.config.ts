import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.esmeraldas.app',
  appName: 'admin',
  webDir: 'dist/admin',
  server: {
    androidScheme: 'https'
  }
};

export default config;
