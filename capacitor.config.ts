import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.example.app',
  appName: 'admin',
  webDir: 'dist/admin',
  server: {
    androidScheme: 'https'
  }
};

export default config;
