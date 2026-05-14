# Store Assets — Yelkenli Yaşam Tycoon

Generated store-ready assets for App Store (iOS) and Google Play (Android) submission.
Source masters: `assets/app-icon-master.png` (1254×1254) and `assets/splash-feature-master.png` (1794×876).

## iOS (App Store)

| File | Size | Use |
|---|---|---|
| `ios/icon-1024.png` | 1024×1024 PNG (no alpha) | App Store marketing icon (App Store Connect "App Icon") |

Apple auto-generates all device icon sizes from this 1024×1024 source at build time
(via Xcode AppIcon asset catalog). Do **not** add transparency or rounded corners — Apple applies the mask.

### iOS screenshots required (App Store Connect)
At least one set must be provided. Apple now accepts the **6.9″ iPhone** set as the only required iPhone size.

| Device | Resolution (portrait) | Required |
|---|---|---|
| 6.9″ iPhone (15/16 Pro Max) | 1290×2796 | **Required** |
| 6.5″ iPhone (XS Max/11 Pro Max) | 1242×2688 or 1284×2778 | Recommended fallback |
| 13″ iPad Pro | 2048×2732 | Required if iPad build shipped |

Each size: 3–10 screenshots. Optional 15–30 sec App Preview video.

## Android (Google Play)

| File | Size | Use |
|---|---|---|
| `android/icon-512.png` | 512×512 32-bit PNG | Play Console "App icon" (store listing) |
| `android/icon-adaptive-fg-1024.png` | 1024×1024 PNG | Source for adaptive icon foreground layer (`mipmap-anydpi-v26`) |
| `android/icon-launcher-192.png` | 192×192 PNG | Legacy launcher icon (`mipmap-xxxhdpi`) |
| `android/feature-graphic-1024x500.png` | 1024×500 PNG | Play Store feature graphic (banner on listing) |

### Android launcher icon densities (generate from `icon-adaptive-fg-1024.png`)
When Capacitor/Android wrapper is set up, run `cordova-res` or Android Studio's
Image Asset Studio to produce: mdpi 48, hdpi 72, xhdpi 96, xxhdpi 144, xxxhdpi 192.

### Android screenshots required (Play Console)
- **Phone screenshots**: 2–8 images, 16:9 or 9:16, min 320 px, max 3840 px on long side.
- **7″ tablet**: optional, 2–8 images.
- **10″ tablet**: optional, 2–8 images.
- **Feature graphic**: required, 1024×500 (`feature-graphic-1024x500.png` above).

Recommended phone target: 1080×1920 portrait PNG/JPG, 24-bit.

## Screenshots (to be captured)

Place captured screenshots in `assets/store/screenshots/` using this naming:
```
screenshots/
  ios-6.9/
    01-hub.png         (1290×2796)
    02-content.png
    03-sea.png
    04-arrival.png
    05-upgrades.png
  android-phone/
    01-hub.png         (1080×1920)
    02-content.png
    03-sea.png
    04-arrival.png
    05-upgrades.png
```

See `backlog/store-launch-checklist.md` §3.4 for the storyboard plan.
