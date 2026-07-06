# MediCore HMS — Admin Panel UI

Hospital Management System admin panel UI (Part 1: Project Setup & Common Components), built with React + Vite, ready for backend API integration.

## Stack
- React 19 + Vite
- React Router DOM (routing + protected routes)
- Tailwind CSS v4
- Axios (with interceptors for auth token + 401 handling)
- Context API (`AuthContext`)
- Chart.js / react-chartjs-2
- lucide-react (icons)

## Getting started
```bash
npm install
npm run dev      # start dev server
npm run build    # production build
```

Demo login: any email + password works (mocked in `AuthContext`, ready to swap for a real `/auth/login` call in `src/services/api.js`).

## Folder structure
```
src/
├── components/
│   ├── common/       # Button, Input, Select, Modal, Table, Loader, Card, StatusBadge
│   └── layout/       # Sidebar, Header, Layout, AuthLayout
├── context/          # AuthContext (Context API)
├── pages/
│   ├── auth/         # Login, ForgotPassword
│   ├── dashboard/    # Dashboard, Placeholder (for modules not yet built)
│   └── NotFound.jsx
├── routes/           # AppRoutes, ProtectedRoute
├── services/         # api.js (Axios instance)
├── hooks/            # (reserved for shared hooks)
└── index.css         # Tailwind + design tokens
```

## Design tokens
- **Colors**: navy (sidebar/auth panel), teal (primary/brand), surface (background),
  success/warning/danger (status states) — all defined in `src/index.css` under `@theme`.
- **Type**: Lexend for headings (`font-display`), Inter for body/UI (`font-sans`).

## Connecting to a real backend
1. Set `VITE_API_BASE_URL` in a `.env` file.
2. In `src/context/AuthContext.jsx`, replace the mocked `login()` body with the commented-out
   `api.post('/auth/login', credentials)` call.
3. Replace mock data in `Dashboard.jsx` and other pages with `api.get(...)` calls as endpoints
   become available.

## Responsive behavior
- Sidebar collapses to an off-canvas drawer below the `lg` breakpoint, toggled from the header.
- Auth screens hide the left signature panel on small screens.
- Tables scroll horizontally on narrow viewports.
