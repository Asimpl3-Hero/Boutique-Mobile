# Boutique Mobile

React Native (TypeScript) app for the Boutique store. Consumes the Boutique backend API.

> Full documentation (setup, architecture, tests, coverage and build artifacts) is completed in the delivery task. Architecture conventions live in [Claude.md](Claude.md).

## Requirements

- Node ≥ 22.11
- Android SDK (or Xcode on macOS for iOS)
- A running Boutique backend (see `.env.example` for per-platform base URLs)

## Quick start

```sh
npm install
cp .env.example .env   # adjust API_URL for your target (emulator/simulator/device)

npm start              # Metro
npm run android        # build & install on Android
npm run ios            # (macOS) pod install first, then build
```

## Scripts

- `npm test` — Jest test suite
- `npm run lint` — ESLint
- `npx tsc --noEmit` — typecheck
