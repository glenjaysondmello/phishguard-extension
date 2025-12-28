# 🛡️ PhishGuard Extension

A robust browser extension engineered to proactively detect and protect users from sophisticated phishing attacks.

![Version](https://img.shields.io/badge/version-1.0.0-blue)
![License](https://img.shields.io/badge/license-None-red)
![Stars](https://img.shields.io/github/stars/glenjaysondmello/phishguard-extension?style=social)
![Forks](https://img.shields.io/github/forks/glenjaysondmello/phishguard-extension?style=social)

![PhishGuard Extension Preview](/preview_example.png)

## ✨ Features

*   **✨ Real-time Phishing Detection:** Utilizes advanced algorithms to analyze URLs and page content, identifying malicious patterns on the fly to safeguard your browsing.
*   **🔗 Seamless Browser Integration:** Installs easily as a browser extension, providing unobtrusive protection without interrupting your online experience.
*   **📊 Centralized Admin Dashboard:** Offers administrators a comprehensive overview of detected threats, user activity, and system health through an intuitive web interface.
*   **⚙️ Robust Backend Analysis:** Powers the extension with a scalable backend infrastructure capable of processing and analyzing vast amounts of data for threat intelligence.
*   **🔔 Customizable Alert System:** Notifies users immediately upon encountering a potential phishing threat, with options to customize alert preferences and severity.

## 🚀 Installation Guide

To get PhishGuard Extension up and running, you'll need to set up the backend, admin dashboard, and the browser extension.

### Prerequisites

Ensure you have the following installed:
*   [Node.js](https://nodejs.org/en/) (LTS version recommended)
*   [npm](https://www.npmjs.com/) (comes with Node.js) or [Yarn](https://yarnpkg.com/)
*   [Git](https://git-scm.com/)

### Step-by-Step Installation

1.  **Clone the Repository**
    Start by cloning the project repository to your local machine:

    ```bash
    git clone https://github.com/glenjaysondmello/phishguard-extension.git
    cd phishguard-extension
    ```

2.  **Backend Setup**
    Navigate to the `backend` directory, install dependencies, and start the server.

    ```bash
    cd backend
    npm install # or yarn install
    npm start   # or yarn start
    ```
    The backend server should now be running, typically on `http://localhost:3000` (check backend logs for exact port).

3.  **Admin Dashboard Setup**
    In a new terminal, navigate to the `admin-dashboard` directory, install dependencies, and start the development server.

    ```bash
    cd ../admin-dashboard
    npm install # or yarn install
    npm run dev   # or yarn start
    ```
    The admin dashboard will usually be accessible at `http://localhost:5173` (or similar, check console output).

4.  **Extension Setup**
    Finally, set up the browser extension.

    ```bash
    cd ../extension
    npm install # or yarn install
    npm run build # or yarn build
    ```

    After building, load the extension into your browser:
    *   **Chrome/Brave/Edge:** (Not Implemented Yet)
        1.  Open your browser and go to `chrome://extensions` (or `edge://extensions`).
        2.  Enable "Developer mode" in the top right corner.
        3.  Click "Load unpacked".
        4.  Select the `phishguard-extension/extension/dist` directory.
    *   **Firefox:**
        1.  Open your browser and go to `about:debugging#/runtime/this-firefox`.
        2.  Click "Load Temporary Add-on...".
        3.  Select any file inside the `phishguard-extension/extension/dist` directory (e.g., `manifest.json`).

5. **Environment Configuration (Optional)**
    Some components might require specific environment variables. Create a .env file in the respective root directories (extension, admin-dashboard, backend) based on provided .env.example files.

    Example for admin-dashboard/.env:
    (check admin-dashboard/.env.example)

    ```bash
    VITE_APP_API_URL=RENDER_BACKEND_URL
    ```

    Example for backend/.env:
    (check backend/.env.example)

    ```bash
    PORT=8080
    NODE_ENV=development
    MONGODB_URI=
    ADMIN_API_KEY=phishguard-admin-key
    JWT_ACCESS_SECRET=
    JWT_REFRESH_SECRET=
    JWT_ACCESS_EXPIRES=15m
    JWT_REFRESH_EXPIRES=7d
    REFRESH_COOKIE_NAME=jid
    COOKIE_DOMAIN=localhost
    RATE_LIMIT_WINDOW_MS=60000
    RATE_LIMIT_MAX=60
    SENTRY_DSN=
    ```

The PhishGuard extension icon should now appear in your browser's toolbar.

## 💡 Usage Examples

### Browser Extension

Once installed, the PhishGuard extension operates silently in the background.

*   **Browsing:** When you navigate to a webpage, the extension will analyze its content and URL.
*   **Alerts:** If a potential phishing threat is detected, the extension icon will change (e.g., turn red) and a notification will appear, warning you about the suspicious site.
*   **Details:** Click on the extension icon to view more details about the current page's safety status or to manage extension settings.

![Extension UI Placeholder](/extension_ui_placeholder.png)

### Admin Dashboard

Access the admin dashboard (e.g., `http://localhost:5173`) to manage and monitor the system.

1.  **Login:** Use your administrator credentials to log in.
2.  **Dashboard Overview:** View statistics on detected threats, user activity, and system performance.
3.  **Threat Management:** Review reported phishing attempts, blacklist or whitelist URLs, and update detection rules.

### Configuration Options

The extension and dashboard offer various configuration options:

| Option               | Description                                           | Type    | Default Value |
| :------------------- | :---------------------------------------------------- | :------ | :------------ |
| `backendApiUrl`      | URL for the PhishGuard backend API.                   | `string`| `http://localhost:3000/api` |
| `detectionThreshold` | Sensitivity level for phishing detection (0-100).     | `number`| `75`          |
| `enableNotifications`| Toggle browser notifications for threats.             | `boolean`| `true`        |
| `adminEmail`         | Email for critical system alerts (Admin Dashboard).   | `string`| `[placeholder]` |

## 🗺️ Project Roadmap

PhishGuard Extension is continuously evolving. Here's a glimpse of what's planned:

*   **V1.1.0 - Enhanced Threat Intelligence:**
    *   Integration with external threat intelligence feeds (e.g., Google Safe Browsing API).
    *   Improved AI/ML models for more accurate and proactive phishing detection.
*   **V1.2.0 - Cross-Browser Compatibility & Publishing:**
    *   Official support and publishing for Firefox and Microsoft Edge browser add-on stores.
    *   Streamlined installation process for all supported browsers.
*   **Future - User Reporting System:**
    *   Allow users to report suspicious sites directly through the extension, contributing to community threat intelligence.
*   **Future - Advanced Whitelisting/Blacklisting:**
    *   More granular control for users and administrators to manage trusted and blocked sites.
    *   Import/export functionality for custom lists.

## 🤝 Contribution Guidelines

We welcome contributions to PhishGuard Extension! To ensure a smooth collaboration, please follow these guidelines:

1.  **Fork the Repository:** Start by forking the `phishguard-extension` repository to your GitHub account.
2.  **Create a New Branch:**
    *   For new features: `git checkout -b feature/your-feature-name`
    *   For bug fixes: `git checkout -b bugfix/issue-description`
3.  **Code Style:**
    *   Adhere to the existing TypeScript, JavaScript, HTML, and CSS code styles.
    *   Use Prettier and ESLint (configured in the project) to format your code before committing.
4.  **Commit Messages:**
    *   Follow the [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/) specification.
    *   Example: `feat: add real-time URL analysis` or `fix: resolve dashboard login issue`.
5.  **Pull Requests (PRs):**
    *   Submit your PRs to the `main` branch of the `glenjaysondmello/phishguard-extension` repository.
    *   Include a clear and concise description of your changes.
    *   Link to any relevant issues (e.g., `Closes #123`).
6.  **Testing Requirements:**
    *   Write unit and/or integration tests for new features and bug fixes.
    *   Ensure all existing tests pass before submitting your PR.
    *   Run tests using `npm test` (or `yarn test`) in the respective project directories.

## 📜 License Information

This project is currently **unlicensed**.

This means that by default, standard copyright law applies, and you do not have explicit permission to copy, distribute, or modify this software. For any usage, distribution, or modification, explicit permission from the copyright holder (`glenjaysondmello`) is required.

**Copyright (c) 2025 glenjaysondmello**

© 2025 GitReadMe. All rights reserved.