import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'ec.gob.esmeraldas.geoapi',
  appName: 'Esmeraldas la Bella',
  webDir: 'dist/sakai-ng',
  server: {
    androidScheme: 'https'
  }
};

export default config;