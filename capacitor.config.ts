import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.example.app',
  appName: 'sakai-ng',
  webDir: 'dist/sakai-ng',
  server: {
    androidScheme: 'https'
  }
};

export default config;
