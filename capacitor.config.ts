import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'edu.jpomares.ionic.cutrello',
  appName: 'Ionic Cutrello',
  webDir: 'www',
  android: {
    allowMixedContent: true
  },
  plugins: {
    SocialLogin: {
      google: {
        // El Client ID del proyecto del profesor que sacamos del JSON
        webClientId: '389388754773-5jflblnhhm4qfmk8mf0egdu5die7epda.apps.googleusercontent.com',
      }
    }
  }
};

export default config;
