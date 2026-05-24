import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'edu.jpomares.ionic.cutrello',
  appName: 'Ionic Cutrello',
  webDir: 'www',
  android: {
    allowMixedContent: true
  },
  plugins: {
    PushNotifications: {
      presentationOptions: [],
    },
    SocialLogin: {
      providers: {
        google: true,
        facebook: true
      },
      google: {
        // El Client ID del proyecto del profesor que sacamos del JSON
        webClientId: '389388754773-5jflblnhhm4qfmk8mf0egdu5die7epda.apps.googleusercontent.com',
      },
      facebook: {
        appId: '2137417053746557',
        clientToken: '7186128b054a011a92d1dbdfdcdb0e4b',
      },
    }
  }
};

export default config;
