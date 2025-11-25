# phishguard-extension

![React](https://img.shields.io/badge/-React-blue?logo=react&logoColor=white) ![TypeScript](https://img.shields.io/badge/-TypeScript-blue?logo=typescript&logoColor=white)

## 📝 Description

PhishGuard Extension is a cutting-edge browser security tool meticulously crafted with React and TypeScript to safeguard users from phishing attacks. This extension seamlessly integrates into your browser, providing real-time protection as you navigate the web. Leveraging advanced detection algorithms, PhishGuard identifies and blocks malicious websites, preventing you from inadvertently falling victim to phishing scams. Browse with confidence, knowing that PhishGuard Extension is diligently working to keep your personal information secure.

## ✨ Features

- 🕸️ Web


## 🛠️ Tech Stack

- ⚛️ React
- 📜 TypeScript


## 📦 Key Dependencies

```
@reduxjs/toolkit: ^2.10.1
@tailwindcss/vite: ^4.1.17
axios: ^1.13.2
bcrypt: ^6.0.0
i18next: ^23.11.5
react: ^18.2.0
react-dom: ^18.2.0
react-i18next: ^14.1.2
react-redux: ^9.2.0
react-router-dom: ^7.9.6
tailwindcss: ^4.1.17
```

## 🚀 Run Commands

- **dev**: `npm run dev`
- **build**: `npm run build`
- **lint**: `npm run lint`
- **preview**: `npm run preview`


## 📁 Project Structure

```
.
├── admin-dashboard
│   ├── eslint.config.js
│   ├── index.html
│   ├── package.json
│   ├── public
│   │   └── vite.svg
│   ├── src
│   │   ├── App.css
│   │   ├── App.tsx
│   │   ├── app
│   │   │   ├── hooks.ts
│   │   │   └── store.ts
│   │   ├── assets
│   │   │   └── react.svg
│   │   ├── components
│   │   │   ├── Layout.tsx
│   │   │   ├── ProtectedRoutes.tsx
│   │   │   ├── Sidebar.tsx
│   │   │   └── Spinner.tsx
│   │   ├── features
│   │   │   ├── authSlice.ts
│   │   │   ├── blacklistSlice.ts
│   │   │   └── reportsSlice.ts
│   │   ├── index.css
│   │   ├── main.tsx
│   │   ├── pages
│   │   │   ├── BlackListPage.tsx
│   │   │   ├── LoginPage.tsx
│   │   │   └── ReportsPage.tsx
│   │   └── services
│   │       └── api.ts
│   ├── tsconfig.app.json
│   ├── tsconfig.json
│   ├── tsconfig.node.json
│   └── vite.config.ts
├── backend
│   ├── package.json
│   ├── src
│   │   ├── controllers
│   │   │   ├── auth.ts
│   │   │   ├── blacklist.ts
│   │   │   └── reports.ts
│   │   ├── middleware
│   │   │   ├── authApiKey.ts
│   │   │   ├── errorHandler.ts
│   │   │   └── requireAuth.ts
│   │   ├── models
│   │   │   ├── Admin.ts
│   │   │   ├── Blacklist.ts
│   │   │   └── Report.ts
│   │   ├── routers
│   │   │   ├── auth.ts
│   │   │   ├── blacklist.ts
│   │   │   └── report.ts
│   │   ├── schemas
│   │   │   ├── auth.schema.ts
│   │   │   ├── blacklist.schema.ts
│   │   │   └── report.schema.ts
│   │   ├── sentry.ts
│   │   ├── server.ts
│   │   └── utils
│   │       ├── jwt.ts
│   │       └── logger.ts
│   ├── tsconfig.build.json
│   └── tsconfig.json
├── eslint.config.js
├── index.html
├── manifest.json
├── package.json
├── public
│   └── vite.svg
├── scripts
│   └── copy-manifest-and-assets.cjs
├── src
│   ├── App.css
│   ├── App.tsx
│   ├── assets
│   │   └── react.svg
│   ├── background.ts
│   ├── contentScript.ts
│   ├── index.css
│   ├── locales
│   │   ├── en.json
│   │   └── hi.json
│   ├── main.tsx
│   └── popup
│       ├── Popup.tsx
│       ├── i18n.ts
│       └── main.tsx
├── tsconfig.app.json
├── tsconfig.json
├── tsconfig.node.json
├── vite.config.background.ts
├── vite.config.content.ts
├── vite.config.scripts.ts
├── vite.config.ts
└── vite.config.ui.ts
```

## 🛠️ Development Setup

### Node.js/JavaScript Setup
1. Install Node.js (v18+ recommended)
2. Install dependencies: `npm install` or `yarn install`
3. Start development server: (Check scripts in `package.json`, e.g., `npm run dev`)


## 👥 Contributing

Contributions are welcome! Here's how you can help:

1. **Fork** the repository
2. **Clone** your fork: `git clone https://github.com/glenjaysondmello/phishguard-extension.git`
3. **Create** a new branch: `git checkout -b feature/your-feature`
4. **Commit** your changes: `git commit -am 'Add some feature'`
5. **Push** to your branch: `git push origin feature/your-feature`
6. **Open** a pull request

Please ensure your code follows the project's style guidelines and includes tests where applicable.

---
*This README was generated with ❤️ by ReadmeBuddy*
