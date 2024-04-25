import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'ec.gob.esmeraldas.labella',
  appName: 'Esmeraldas la Bella',
  webDir: 'dist/sakai-ng',
  server: {
    androidScheme: 'https'
  }
};

export default config;