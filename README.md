# MediCore HMS — Admin Panel UI

Hospital Management System admin panel UI, built with React + Vite, ready for backend API integration.

## Module status
- ✅ Part 1 — Project setup, auth, layout & common components
- ✅ Part 2 — Dashboard module (stat cards, revenue/appointment/department charts, notifications, quick widgets, search & filter)
- ✅ Part 3 — OPD
- ✅ Part 4 — IPD
- ✅ Part 5 — Pharmacy
- ✅ Part 6 — User Management
- ✅ Part 7 — Reports & Analytics
- ✅ Part 8 — Finalization

## Branching convention
Each module is developed on its own branch off `main` (e.g. `feature/dashboard-module`,
`feature/opd-module`) and merged in via PR once reviewed, so modules can be built,
reviewed, and rolled back independently.

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

Demo login: 
id: admin@medicore.com
password: Admin@123
## Folder structure
```
src/
├── components/
│   ├── common/       # Button, Input, Select, Modal, Table, Loader, Card, StatusBadge
│   ├── layout/       # Sidebar, Header, Layout, AuthLayout
│   └── dashboard/    # Module-specific: StatCard, RevenueChart, AppointmentChart,
│                     # DepartmentLoadChart, NotificationsPanel, QuickWidgets, DashboardToolbar
├── context/          # AuthContext (Context API)
├── data/             # Mock data per module (dashboardData.js, ...) — swap for API calls later
├── pages/
│   ├── auth/         # Login, ForgotPassword
│   ├── dashboard/    # Dashboard, Placeholder (for modules not yet built)
│   └── NotFound.jsx
├── routes/           # AppRoutes, ProtectedRoute
├── services/         # api.js (Axios instance)
├── hooks/            # (reserved for shared hooks)
└── index.css         # Tailwind + design tokens
```

Each module follows the same pattern: page component in `pages/<module>/`, module-specific
building blocks in `components/<module>/`, and mock data in `data/<module>Data.js` — so
swapping mock data for real endpoints later only touches one file per page.


## Connecting to a real backend
1. Set `VITE_API_BASE_URL` in a `.env` file.
2. In `src/context/AuthContext.jsx`, replace the mocked `login()` body with the commented-out
   `api.post('/auth/login', credentials)` call.
3. Replace mock data in `Dashboard.jsx` and other pages with `api.get(...)` calls as endpoints
   become available.

## Responsive behavior
- mobile responsiveness.
- Sidebar collapses to an off-canvas drawer below the `lg` breakpoint, toggled from the header.
- Auth screens hide the left signature panel on small screens.
- Tables scroll horizontally on narrow viewports.
