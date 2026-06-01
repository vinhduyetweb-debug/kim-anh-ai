# KIM ANH AI — APK Readiness

## 1. Current PWA Approach

Kim Anh AI is currently a Vite-powered static PWA shell. The Rainbow House, stores, service worker, manifest, and packaged mini apps are all served as static web assets.

The production web build output is `dist/`. The app should remain static-host friendly so it can run from Vercel, local preview, Android PWA install, and future native wrappers.

## 2. Install On Android As PWA

1. Build and deploy or serve the app over HTTPS.
2. Open Kim Anh AI in Chrome on Android.
3. Use the browser menu and choose `Thêm vào màn hình chính` if Chrome does not show the install prompt.
4. Parent Mode may show `Cài Kim Anh AI lên màn hình chính` when the browser exposes the PWA install prompt.

The app should keep working offline after the first successful load, except for content that has not been cached or loaded yet.

## 3. Future APK Path Options

### TWA / Bubblewrap

Trusted Web Activity packaging keeps the PWA as the source of truth and wraps the deployed web app for Play Store distribution. It is a good fit when the app remains mostly web-based.

### Capacitor

Capacitor packages the static web app into an Android project and allows native plugins later. It is a stronger fit if Kim Anh AI needs native Android APIs.

## 4. Recommended Future Path

Keep PWA first.

Use Capacitor later only if native features become necessary. This keeps the current system simple, offline-first, and easy to deploy while preserving an APK path.

## 5. Native Features Likely Needed Later

- Notifications
- File system access
- Audio recording
- Backup and restore file access
- Android alarm integration

## 6. Capacitor-Friendly Structure Notes

- `dist/` is the web build output.
- Keep the app static-host friendly.
- Avoid hardcoded absolute external URLs.
- Keep local browser storage isolated and documented.
- Current local storage keys include `kimAnhProfile`, `kimAnhMemories`, `kimAnhRewards`, `kimAnhParentSettings`, `kimAnhMemoryEvents`, and `kimAnhMemoryRewardEvents`.
- Vinh-XemVideo uses IndexedDB store `videos` inside database `vinhvideo_offline_db_v1`.
