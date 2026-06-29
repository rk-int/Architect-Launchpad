# AI Excellence LaunchPad — System Requirements & Dependencies

This file details all the technologies, software versions, and libraries required to build, run, and develop the **AI Excellence LaunchPad** study tracker.

---

## 1. System & Engine Requirements

To build and run this application locally, you need the following runtime engines installed:

*   **Node.js**: `^20.0.0` or newer (Recommended: LTS v22+)
*   **Package Manager**: `npm` (v10+), `pnpm`, or `yarn`

---

## 2. Core Frontend Technologies

*   **Runtime Library**: **React 19** (`^19.1.0`)
*   **Compiler/Build Tool**: **Vite 6** (`^6.3.3`)
*   **Styling Engine**: **Tailwind CSS v4** (`^4.1.4`)
*   **Routing System**: **React Router DOM v7** (`^7.5.3`)
*   **3D Graphics Rendering**: **Three.js** (`^0.185.0`) + **React Three Fiber** (`^9.6.1`)

---

## 3. Libraries & Dependencies (`dependencies`)

These are the libraries bundled into the production build of the website:

| Package Name | Version | Purpose |
| :--- | :--- | :--- |
| **`react`** | `^19.1.0` | Core UI state library. |
| **`react-dom`** | `^19.1.0` | DOM rendering bindings for React. |
| **`react-router-dom`** | `^7.5.3` | Client-side routing, query parameter mapping, and layout guards. |
| **`three`** | `^0.185.0` | Low-level WebGL 3D graphics library. |
| **`@react-three/fiber`** | `^9.6.1` | React wrapper and renderer for Three.js. |
| **`@react-three/drei`** | `^10.7.7` | Helper utilities, shaders, and controls for React Three Fiber. |
| **`framer-motion`** | `^12.42.0` | Interactive physics-based UI transitions and animations. |
| **`lucide-react`** | `^1.21.0` | Vector icon suite used across the sidebar, buttons, and navigation. |

---

## 4. Development & Build Tools (`devDependencies`)

These tools are utilized only during local development and assets bundling:

| Package Name | Version | Purpose |
| :--- | :--- | :--- |
| **`vite`** | `^6.3.3` | Next-generation frontend tooling and local dev server. |
| **`@vitejs/plugin-react`** | `^4.4.1` | Official Vite plugin for React Fast Refresh and JSX transformation. |
| **`tailwindcss`** | `^4.1.4` | Utility-first styling framework (v4 engine). |
| **`@tailwindcss/vite`** | `^4.1.4` | Vite bundler integration for Tailwind v4 compilation. |
| **`vite-plugin-pwa`** | `^1.0.0` | PWA support, generating Service Workers, cache manifest, and offline assets mapping. |

---

## 5. Development Command Reference

Use the following commands from the root directory of the project:

### Install Dependencies
```bash
npm install
```

### Start Development Server (Local Host)
```bash
npm run dev
```

### Build Production Bundle
```bash
npm run build
```

### Preview Production Build Locally
```bash
npm run preview
```
