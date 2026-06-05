#!/usr/bin/env node
/**
 * Run after `npx cap add ios` and `npx cap add android`.
 * Patches iOS Info.plist with camera permission strings.
 * Android permissions are handled automatically by @capacitor/camera.
 */

const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');

// ── iOS ──────────────────────────────────────────────────────────────────────
const plistPath = path.join(root, 'ios', 'App', 'App', 'Info.plist');

const iosPermissions = [
  [
    'NSCameraUsageDescription',
    'SonoPilot uses your camera to photograph ultrasound screens for AI analysis.',
  ],
  [
    'NSPhotoLibraryUsageDescription',
    'SonoPilot accesses your photo library to select saved ultrasound images.',
  ],
  [
    'NSPhotoLibraryAddUsageDescription',
    'SonoPilot saves annotated scan results to your photo library.',
  ],
];

if (fs.existsSync(plistPath)) {
  let plist = fs.readFileSync(plistPath, 'utf8');
  let changed = false;

  for (const [key, value] of iosPermissions) {
    if (!plist.includes(`<key>${key}</key>`)) {
      plist = plist.replace(
        '</dict>\n</plist>',
        `\t<key>${key}</key>\n\t<string>${value}</string>\n</dict>\n</plist>`
      );
      changed = true;
    }
  }

  if (changed) {
    fs.writeFileSync(plistPath, plist, 'utf8');
    console.log('✓ iOS Info.plist patched with camera permissions');
  } else {
    console.log('✓ iOS Info.plist already has camera permissions');
  }
} else {
  console.log('⚠  iOS platform not found — run: npx cap add ios');
}

// ── Android ───────────────────────────────────────────────────────────────────
const manifestPath = path.join(
  root,
  'android',
  'app',
  'src',
  'main',
  'AndroidManifest.xml'
);

const androidPermissions = [
  'android.permission.CAMERA',
  'android.permission.READ_MEDIA_IMAGES',
  'android.permission.INTERNET',
];

if (fs.existsSync(manifestPath)) {
  let manifest = fs.readFileSync(manifestPath, 'utf8');
  let changed = false;

  for (const perm of androidPermissions) {
    if (!manifest.includes(perm)) {
      manifest = manifest.replace(
        '<application',
        `<uses-permission android:name="${perm}" />\n\n    <application`
      );
      changed = true;
    }
  }

  if (!manifest.includes('android.hardware.camera')) {
    manifest = manifest.replace(
      '<application',
      `<uses-feature android:name="android.hardware.camera" android:required="false" />\n\n    <application`
    );
    changed = true;
  }

  if (changed) {
    fs.writeFileSync(manifestPath, manifest, 'utf8');
    console.log('✓ AndroidManifest.xml patched with camera permissions');
  } else {
    console.log('✓ AndroidManifest.xml already has camera permissions');
  }
} else {
  console.log('⚠  Android platform not found — run: npx cap add android');
}

console.log('\nSetup complete. Next steps:');
console.log('  iOS:     npm run cap:ios     (requires Mac + Xcode)');
console.log('  Android: npm run cap:android (requires Android Studio)');
