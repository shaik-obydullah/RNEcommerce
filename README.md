# RNEcommerce

A modern e-commerce mobile application built with React Native 0.86, TypeScript, and a clean architecture pattern. Features authentication, product browsing, shopping cart, order management, and dark/light theme support.

## Features

- **Authentication** - User login and registration with token-based auth, persisted via AsyncStorage
- **Product Catalog** - Browse products by categories, view featured products on home screen
- **Product Details** - View detailed product information with images, pricing, and ratings
- **Shopping Cart** - Add/update/remove items from cart with real-time quantity management and cart badge
- **Checkout** - Complete orders with shipping address and payment method selection
- **Order History** - View past orders and their status
- **User Profile** - Manage profile settings and toggle between light/dark themes
- **Responsive UI** - Clean, modern interface with theme support and skeleton loading states

## Tech Stack

- **Framework**: [React Native](https://reactnative.dev/) 0.86.0
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Navigation**: [React Navigation](https://reactnavigation.org/) (Native Stack + Bottom Tabs)
- **State Management**: [Zustand](https://zustand-demo.pmnd.rs/)
- **API Client**: [Axios](https://axios-http.com/)
- **Storage**: [AsyncStorage](https://react-native-async-storage.github.io/async-storage/)
- **UI Components**: React Native Vector Icons, React Native Gesture Handler, React Native Safe Area Context

## Project Structure

```
src/
├── api/           # API client, endpoints, and type definitions
├── components/    # Reusable UI components (ProductCard, SkeletonCard, EmptyState, etc.)
├── navigation/    # Navigation configuration (AppNavigator, HomeTabs)
├── screens/       # App screens (Home, Products, Cart, Orders, Profile, Auth, etc.)
├── stores/        # Zustand stores (auth, cart, theme)
└── theme/         # Theme configuration (colors, spacing, typography)
```

## Prerequisites

- Node.js >= 22.11.0
- React Native development environment set up ([React Native Environment Setup](https://reactnative.dev/docs/set-up-your-environment))
- Android Studio (for Android) or Xcode (for iOS)
- A running backend API at `http://10.0.2.2:8000/api` (see API configuration)

## API Configuration

The app expects a REST API at `http://10.0.2.2:8000/api` by default (configured in `src/api/types.ts`). For different environments, update `API_BASE_URL` accordingly.

## Getting Started

### 1. Install dependencies

```sh
npm install
# or
yarn install
```

### 2. Start Metro bundler

```sh
npm start
# or
yarn start
```

### 3. Run the app

#### Android

```sh
npm run android
# or
yarn android
```

#### iOS

First, install CocoaPods dependencies:

```sh
bundle install
bundle exec pod install
```

Then run the app:

```sh
npm run ios
# or
yarn ios
```

## Docker Development

A Docker setup is available for Android development. See `docker-compose.yml` for configuration.

```sh
docker-compose up -d
```

## Scripts

- `npm start` - Start Metro bundler
- `npm run android` - Build and run on Android
- `npm run ios` - Build and run on iOS
- `npm run lint` - Run ESLint
- `npm test` - Run tests with Jest

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is private.
