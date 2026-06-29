# Patflow

Patflow is a React Native mobile app for field and facility teams. It connects to a [Parse](https://parseplatform.org/) backend (hosted on [SashiDo](https://www.sashido.io/)) and gives staff a single place to manage tasks, tickets, work hours, and absences — with offline caching and push notifications.

## Features

### Tasks (Aufgaben)
- View and manage assigned work items, grouped by week
- Create and edit tasks with staff assignment, dates, and descriptions
- Admin view for users with elevated roles

### Tickets
- Report and track issues tied to properties and locations
- Filter and browse tickets with pull-to-refresh

### Time tracking (Arbeitszeiten)
- Live timer for recording work sessions
- Weekly calendar overview of recorded hours
- Edit and review time entries

### Profile
- **Abwesenheiten** — request and manage absences
- **Arbeitszeiten** — personal time record history
- **Urlaubskalender** — vacation calendar
- **Profil** — account settings and cache management

### Platform capabilities
- Real-time data sync via Parse Live Queries and subscriptions
- Offline support with SQLite-backed local caching
- Push notifications via Firebase Cloud Messaging and Notifee
- Connection status indicator and pending-update handling
- Light and dark theme support

## Tech stack

| Layer | Technology |
|-------|------------|
| Framework | React Native 0.83, React 19 |
| Language | TypeScript |
| Navigation | React Navigation (bottom tabs) |
| Backend | Parse SDK 8.x (SashiDo) |
| State | Zustand (`useDataStore`) |
| Storage | MMKV, Async Storage, Parse SQLite cache |
| Notifications | Firebase Messaging, Notifee |
| HTTP | Axios with retry |
| Dates | date-fns |

## Project structure

```
patflow/
├── App.tsx                 # Root navigation, providers, subscriptions
├── content/                # Screen-level UI (Tasks, Tickets, Profile, …)
├── src/
│   ├── provider/           # Shared logic, hooks, Parse integration, UI kit
│   └── types/              # TypeScript type definitions
├── android/                # Android native project
├── ios/                    # iOS native project
└── __tests__/              # Jest tests
```

Path aliases (configured in `tsconfig.json` and `babel.config.js`):

| Alias | Path |
|-------|------|
| `@provider` | `src/provider` |
| `@types` | `src/types` |
| `@content` | `content` |

## Prerequisites

- [Node.js](https://nodejs.org/) 20.19.4 (see `engines` in `package.json`)
- [React Native environment](https://reactnative.dev/docs/set-up-your-environment) for Android and/or iOS
- Access to a SashiDo Parse app and a Firebase project (for push notifications)

## Getting started

### 1. Install dependencies

```sh
npm install
```

For iOS, install CocoaPods dependencies:

```sh
bundle install          # first time only
bundle exec pod install # from the ios/ directory
```

### 2. Configure environment variables

Create a `.env` file in the project root. Variables are loaded via [`react-native-dotenv`](https://github.com/goatandsheep/react-native-dotenv):

```env
SASHIDO_APP_ID=
SASHIDO_JS_KEY=
SASHIDO_REST_KEY=
SASHIDO_MASTER_KEY=
SASHIDO_SERVER_URL=
SASHIDO_API_URL=
SASHIDO_FILE_URL=
FIREBASE_APP_ID=
GCMS_SENDER_ID=
```

Obtain Parse credentials from your SashiDo dashboard. Firebase values come from your Firebase project settings.

> **Note:** Never commit `.env` or other files containing secrets.

### 3. Start Metro

```sh
npm start
```

### 4. Run the app

```sh
# Android
npm run android

# iOS
npm run ios
```

## Development

### Scripts

| Command | Description |
|---------|-------------|
| `npm start` | Start the Metro bundler |
| `npm run android` | Build and run on Android |
| `npm run ios` | Build and run on iOS |
| `npm test` | Run Jest tests |
| `npm run lint` | Run ESLint |

### Data layer

App data is fetched centrally and exposed through Zustand. Components read from `useDataStore` and trigger refetches via `useDataRefetch` or `useFindData`. See [QUICK_REFERENCE.md](./QUICK_REFERENCE.md) for common patterns.

### Local cache

Parse SDK caches data in SQLite on device. Cache limits, monitoring, and cleanup are documented in [README_DATABASE.md](./README_DATABASE.md).

## Additional documentation

| Document | Description |
|----------|-------------|
| [QUICK_REFERENCE.md](./QUICK_REFERENCE.md) | Centralized data fetching with `useDataStore` |
| [README_DATABASE.md](./README_DATABASE.md) | SQLite cache management and monitoring |
| [SQLITE_FULL_FIX.md](./SQLITE_FULL_FIX.md) | Handling database-full errors |
| [USEFIND_HOOKS_UPDATE.md](./USEFIND_HOOKS_UPDATE.md) | `useFindData` hook patterns |

## License

Private project — all rights reserved.
