import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.deraks.yelkenliyasamtycoon',
  appName: 'Yelkenli Yaşam Tycoon',
  webDir: 'dist',
  android: {
    backgroundColor: '#0E3A5F',
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 1200,
      launchAutoHide: true,
      backgroundColor: '#0E3A5F',
      showSpinner: false,
      androidSplashResourceName: 'splash',
      androidScaleType: 'CENTER_CROP',
      splashFullScreen: true,
      splashImmersive: true,
    },
    StatusBar: {
      overlaysWebView: false,
      backgroundColor: '#0E3A5F',
      style: 'DARK',
    },
  },
};

export default config;
