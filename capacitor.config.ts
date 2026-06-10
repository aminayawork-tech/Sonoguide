import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.sonopilot',
  appName: 'SonoPilot',
  webDir: 'public',
  server: {
    // Production Vercel deployment — all API routes, auth, and Stripe stay server-side.
    url: 'https://sonopilot.app',
    cleartext: false,
    androidScheme: 'https',
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2500,
      launchAutoHide: true,
      backgroundColor: '#ffffff',
      androidSplashResourceName: 'splash',
      androidScaleType: 'CENTER_CROP',
      showSpinner: false,
      splashFullScreen: true,
      splashImmersive: true,
    },
    PushNotifications: {
      presentationOptions: ['badge', 'sound', 'alert'],
    },
    StatusBar: {
      style: 'DEFAULT',
      backgroundColor: '#ffffff',
    },
  },
  ios: {
    contentInset: 'always',
    backgroundColor: '#ffffff',
    allowsLinkPreview: false,
    scrollEnabled: true,
    // Restricts WebView navigation to sonopilot.app only — required for limitsNavigationsToAppBoundDomains
    limitsNavigationsToAppBoundDomains: true,
  },
  android: {
    backgroundColor: '#ffffff',
    allowMixedContent: false,
    captureInput: true,
  },
};

export default config;
