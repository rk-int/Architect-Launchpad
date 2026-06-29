# AI Excellence LaunchPad — Architecture & Flow Diagrams

This document outlines the technical design, application architecture, and user workflow of the **AI Excellence LaunchPad** study tracker.

---

## 1. Application Architecture Diagram

The application is structured as a modern React Progressive Web App (PWA) client-side single-page application (SPA).

```mermaid
graph TD
    %% Define Styling
    classDef main fill:#C8421A,stroke:#333,stroke-width:1px,color:#fff;
    classDef comp fill:#1c1917,stroke:#44403c,stroke-width:1px,color:#e7e5e4;
    classDef storage fill:#1e293b,stroke:#334155,stroke-width:1px,color:#cbd5e1;
    classDef context fill:#581c87,stroke:#701a75,stroke-width:1px,color:#f3e8ff;

    %% Elements
    IndexHTML["index.html (PWA Entry)"]:::main
    MainJSX["main.jsx (Entry Point)"]:::comp
    AppJSX["App.jsx (Root Routing & Guard)"]:::comp
    
    subgraph ContextLayer ["Global Contexts"]
        ThemeCtx["ThemeContext (Dark / Light)"]:::context
    end

    subgraph StateLayer ["Storage & State"]
        LocalStorage["Local Storage (PWA Cache)"]:::storage
        StorageJS["storage.js (API Layer)"]:::storage
        UseProgress["useProgress.js (Custom Hook)"]:::storage
    end

    subgraph UILayout ["UI & Routing Layout"]
        Layout["Layout.jsx (Header, Sidebar, Nav)"]:::comp
        Pages["App Pages"]:::comp
        ThreeD["3D Component System (ThreeJS)"]:::comp
    end

    %% Connections
    IndexHTML --> MainJSX
    MainJSX --> AppJSX
    AppJSX --> ThemeCtx
    ThemeCtx --> Layout
    AppJSX --> Layout
    Layout --> Pages
    Pages --> ThreeD
    
    %% Storage links
    Pages --> UseProgress
    UseProgress --> StorageJS
    StorageJS --> LocalStorage
    ThemeCtx --> LocalStorage
```

---

## 2. Navigation & User Flow Diagram

This flow diagram illustrates the user journey from onboarding to day-to-day study sessions, quiz practice, and progress tracking.

```mermaid
stateDiagram-v2
    [*] --> CheckSetup
    
    state CheckSetup <<choice>>
    CheckSetup --> Onboarding : First Visit (No User Profile)
    CheckSetup --> Dashboard : Setup Completed
    
    state Onboarding {
        [*] --> WelcomeStep
        WelcomeStep --> NameInput : Click 'Get Started'
        NameInput --> ExamDateInput : Name Valid
        ExamDateInput --> SaveConfig : Submit (Calculates 3-Week Default)
        SaveConfig --> [*]
    }
    
    Onboarding --> Dashboard : Redirects to Root
    
    state Dashboard {
        [*] --> Home
        Home --> StudyPlan : Navigate to Plan
        Home --> QuizMain : Navigate to Quiz
        Home --> ProgressView : Navigate to Progress
        Home --> SettingsView : Navigate to Settings
    }

    state StudyPlan {
        [*] --> WeekList
        WeekList --> WeekDetails : Select Week (1-9)
        WeekDetails --> TaskToggle : Complete / Toggle Daily Task
        TaskToggle --> UpdateProgress : Update state
    }
    
    state QuizMain {
        [*] --> QuizSetup
        QuizSetup --> QuizActive : Start Exam Quiz
        QuizActive --> QuizActive : Answer Questions
        QuizActive --> QuizResults : Complete Quiz
        QuizResults --> ReviewAnswers
    }

    state SettingsView {
        [*] --> ViewConfig
        ViewConfig --> UpdateName
        ViewConfig --> UpdateExamDate
        ViewConfig --> ResetData : Clears LocalStorage & Reloads
    }
```

---

## 3. Technology Stack Reference

| Layer | Technology | Key Usage |
| :--- | :--- | :--- |
| **Framework Core** | React 19 + Vite 6 | Fast SPA rendering & hot-reloading dev loop. |
| **Theme System** | Tailwind CSS v4 + HSL | Dynamically inverting standard Tailwind colors. |
| **Routing** | React Router Dom v6 | Client-side routing, route guarding, and nested paths. |
| **3D Rendering** | Three.js + React Three Fiber | Renders responsive particle fields and the interactive Claude Orb. |
| **Caching & PWA** | Vite PWA Plugin + SW | Service Worker implementation for offline study capabilities. |
| **State Persistence** | browser LocalStorage | Keeps name, exam countdown, task checks, and quiz stats persistent. |
