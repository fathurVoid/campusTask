# CampusTask

A lightweight academic task management web application built with TypeScript and Vite. CampusTask helps students organize coursework, track deadlines, and monitor assignment progress through a responsive dashboard.

The application runs entirely in the browser and uses LocalStorage for data persistence. No backend or external database is required.

## Overview

CampusTask was developed as an individual project for the Web Application Development course. It demonstrates the implementation of a client-side web application using modern frontend tooling and TypeScript.

## Features

- **Task Management** — Create, edit, delete, and update assignments.
- **Task Status** — Track assignments as pending or completed.
- **Dashboard Statistics** — View total assignments, completed tasks, pending tasks, overdue tasks, and completion rate.
- **Search and Filtering** — Find assignments by title or course and filter them by status or priority.
- **Sorting** — Organize assignments by due date, priority, or title.
- **Form Validation** — Validate task information before saving.
- **Persistent Storage** — Preserve assignment data using browser LocalStorage.
- **Responsive Interface** — Desktop sidebar navigation and mobile bottom navigation.
- **Notifications** — Display feedback for user actions.

## Technology Stack

| Technology | Purpose |
|---|---|
| TypeScript 5 | Application logic and static type checking |
| Vite 8 | Development server and production build tooling |
| HTML5 | Application document structure |
| CSS3 | Custom styling and responsive layout |
| Tailwind CSS 4 | Utility-first styling |
| npm | Package and dependency management |
| Git & GitHub | Version control and source code hosting |
| LocalStorage | Client-side data persistence |

The application uses Vanilla TypeScript without a frontend UI framework such as React, Vue, or Angular.

### Dependencies

CampusTask has no runtime dependencies. Its development dependencies include:

- `vite`
- `typescript`
- `tailwindcss`
- `@tailwindcss/vite`

## Project Architecture

The application follows a modular client-side architecture. Application state and rendering are orchestrated by the main entry point, while UI components, storage operations, types, and utility functions are separated into dedicated modules.

```text
campusTask/
├── index.html
├── package.json
├── package-lock.json
├── tsconfig.json
├── vite.config.ts
├── .env.example
├── .gitignore
├── README.md
└── src/
    ├── vite-env.d.ts
    ├── styles/
    │   ├── main.css
    │   └── components.css
    └── scripts/
        ├── main.ts
        ├── types/
        │   └── assignment.ts
        ├── services/
        │   └── storage.ts
        ├── components/
        │   ├── dashboard.ts
        │   ├── dashboard-header.ts
        │   ├── task-list.ts
        │   ├── task-form.ts
        │   └── notifications.ts
        └── utils/
            ├── date.ts
            ├── filters.ts
            ├── html.ts
            └── statistics.ts
```

### Application Structure

| Module | Responsibility |
|---|---|
| `main.ts` | Application initialization, state management, event handling, and rendering orchestration |
| `types/assignment.ts` | Assignment interfaces and type definitions |
| `services/storage.ts` | LocalStorage operations and stored-data validation |
| `components/` | Dashboard, task list, task form, and notification UI |
| `utils/` | Date formatting, filtering, HTML escaping, and statistics calculations |
| `styles/` | Global styles, Tailwind imports, and component refinements |

## Technical Implementation

### TypeScript

TypeScript provides static typing for application data and functions. The project uses strict compiler settings to improve type safety and maintainability.

The implementation demonstrates:

- Primitive types: `string`, `number`, and `boolean`.
- Arrays and typed collections.
- Interfaces for structured application data.
- Type aliases and union types for constrained values.
- Generics for reusable storage utilities.
- Type guards for runtime data validation.

The central assignment model is defined using an interface:

```ts
export interface Assignment {
  id: string;
  title: string;
  course: string;
  description: string;
  dueDate: string;
  priority: Priority;
  status: AssignmentStatus;
  createdAt: string;
}
```

Priority and assignment status use union types:

```ts
export type Priority = 'low' | 'medium' | 'high';

export type AssignmentStatus = 'pending' | 'completed';
```

Generic functions are used in the storage service to support reusable, typed data operations.

### State Management

Application state is maintained on the client side and coordinated through `main.ts`. User interactions update the application state, persist the changes, and trigger the rendering process.

### Data Persistence

Assignment data is stored in browser LocalStorage under the following key:

```text
campustask_assignments
```

The storage service validates retrieved data before treating it as assignment records. Invalid or corrupted stored data is handled through a fallback mechanism.

### Security Considerations

- User-provided content is HTML-escaped before being inserted into HTML templates.
- Stored data is validated before being used by the application.
- No authentication credentials or server-side secrets are required.
- Environment variables exposed to the browser must not contain sensitive information.

## Environment Configuration

The project uses environment variables for application configuration.

| Variable | Description |
|---|---|
| `VITE_APP_NAME` | Application display name |
| `VITE_APP_VERSION` | Application version |
| `VITE_APP_ENV` | Application environment label |
| `VITE_BASE_PATH` | Base path for generated assets |

`.env.example` provides the configuration template. The local `.env` file is excluded from version control through `.gitignore`.

Variables prefixed with `VITE_` are exposed to client-side code during the build process. They must only contain public configuration values, never API keys, passwords, or other secrets.

## Development and Build

The project uses npm scripts defined in `package.json`.

| Command | Description |
|---|---|
| `npm install` | Install project dependencies |
| `npm run dev` | Start the Vite development server |
| `npm run typecheck` | Run TypeScript type checking |
| `npm run build` | Type-check and generate the production build |
| `npm run preview` | Preview the production build locally |

Production output is generated in the `dist/` directory.

## Deployment

CampusTask is designed for static hosting. Its production build can be deployed to platforms such as Vercel or other static web hosting providers.

The Vite base path is configurable through `VITE_BASE_PATH` to support different hosting paths.

## Limitations

- Assignment data is stored locally in the browser and is not synchronized across devices.
- The application does not provide authentication or multi-user functionality.
- There is no backend API or external database.
- Clearing browser storage removes locally saved assignments.

## Project Status

CampusTask has completed its core feature development, including assignment management, task filtering, search, sorting, and responsive interface implementation. The application has passed TypeScript type checking and production build verification.

---

**Built with TypeScript, Vite, and Tailwind CSS.**