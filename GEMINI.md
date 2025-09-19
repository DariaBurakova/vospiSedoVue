# GEMINI Code Guide: vospi-sedo

This document provides a comprehensive guide to the vospi-sedo project, intended for use by the Gemini AI assistant.

## Project Overview

This is a web application built with Vue.js 3. It appears to be an electronic document management system ("sedo" is a common abbreviation for such systems in Russian). The project is bootstrapped with `create-vue` and uses Vite for fast development and builds.

### Key Technologies

*   **Framework:** [Vue.js](https://vuejs.org/) (v3)
*   **Language:** [TypeScript](https://www.typescriptlang.org/)
*   **Build Tool:** [Vite](https://vitejs.dev/)
*   **Routing:** [Vue Router](https://router.vuejs.org/)
*   **State Management:** [Pinia](https://pinia.vuejs.org/)
*   **UI Library:** [PrimeVue](https://primevue.org/) (unstyled) and [VueDatePicker](https://vue3datepicker.com/)
*   **CSS Framework:** [Tailwind CSS](https://tailwindcss.com/)
*   **Linting & Formatting:** [ESLint](https://eslint.org/) and [Prettier](https://prettier.io/)

### Architecture

The application follows a standard single-page application (SPA) architecture:

*   `src/main.ts`: The application entry point, where Vue, Pinia, PrimeVue, and the router are initialized.
*   `src/App.vue`: The root Vue component that contains the `<router-view>`.
*   `src/router/index.ts`: Defines the application's routes, including nested routes for different sections like "Входящие" (Inbox), "Исходящие" (Outgoing), etc.
*   `src/views/`: Contains the main page components for each route.
*   `src/components/`: Contains reusable UI components used across different views.
*   `src/stores/`: Contains Pinia store modules for managing global application state. For example, `NavStore.ts` manages the state of the navigation menus.
*   `src/assets/`: Contains static assets like CSS and images.

## Building and Running

The project uses `npm` as the package manager. Key commands are defined in `package.json`.

*   **Install Dependencies:**
    ```sh
    npm install
    ```

*   **Run for Development:** Starts a hot-reloading development server.
    ```sh
    npm run dev
    ```

*   **Build for Production:** Compiles, type-checks, and minifies the code for production deployment into the `dist` directory.
    ```sh
    npm run build
    ```

*   **Preview Production Build:** Starts a local server to preview the production build.
    ```sh
    npm run preview
    ```

*   **Lint and Fix:** Runs ESLint to check for and automatically fix code style issues.
    ```sh
    npm run lint
    ```

*   **Format Code:** Runs Prettier to format all files in the `src` directory.
    ```sh
    npm run format
    ```

## Development Conventions

*   **Code Style:** The project uses ESLint with `@vue/eslint-config-typescript` and Prettier for consistent code style. The configuration is in `eslint.config.ts`.
*   **File Naming:** Components and views use PascalCase (e.g., `HomeView.vue`).
*   **Component API:** The `<script setup>` syntax is used for the Composition API, which is the standard for this project.
*   **State Management:** Global state should be managed using Pinia. New stores should be created in the `src/stores` directory.
*   **Routing:** New pages should be added as views in `src/views` and their routes defined in `src/router/index.ts`.
*   **Styling:** Utility-first styling is provided by Tailwind CSS. The configuration in `tailwind.config.ts` can be extended as needed.
*   **Type Safety:** The project is fully typed with TypeScript. All new code should include type annotations.
