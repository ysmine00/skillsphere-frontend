# SkillSphere — Frontend

> A community skill-exchange platform for Al Akhawayn University, built with React.

SkillSphere enables students, faculty, and staff to offer and request skills within the AUI community, coordinating exchanges through a clean and intuitive interface.

---

## Table of Contents

- [Overview](#overview)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Pages & Routes](#pages--routes)
- [How Authentication Works](#how-authentication-works)
- [Related Repository](#related-repository)

---

## Overview

SkillSphere is a database-driven web application originally developed as a capstone project for a Database Systems course. The frontend is a single-page React application that communicates with a RESTful Express API backed by PostgreSQL.

Key features:
- Register and log in with an AUI email (`@aui.ma`)
- Browse a marketplace of skill offerings and requests
- Create and manage your own offerings and requests
- Initiate, accept, and complete skill exchanges
- Track engagement through a personal activity score
- Manage your skill profile with proficiency levels

---

## Tech Stack

| Technology | Purpose |
|---|---|
| React 19 | UI framework |
| React Router 7 | Client-side routing |
| Redux Toolkit | Global state management (auth) |
| Axios | HTTP client for API calls |
| React Bootstrap | UI component library |
| Framer Motion | Page and component animations |
| React Icons | Icon library |
| Formik + Yup | Form handling and validation |

---

## Project Structure

```
src/
├── assets/
│   ├── images/              # Logo, hero image, SVG icons
│   └── styles/
│       └── variables.css    # Global CSS variables (AUI color palette, spacing)
├── components/
│   ├── common/
│   │   ├── Header/          # Public navigation bar
│   │   ├── Footer/          # Public footer
│   │   └── Loader/          # Loading spinner
│   ├── dashboard/
│   │   ├── DashboardNavbar/ # Authenticated navigation bar
│   │   ├── RecentActivity/  # Exchange activity feed widget
│   │   ├── SkillsOffered/   # User offerings summary widget
│   │   ├── SkillsRequested/ # User requests summary widget
│   │   ├── UserProfile/     # Profile summary card
│   │   └── UserStats/       # Stats row and activity score
│   └── PrivateRoute.jsx     # Route guard for authenticated pages
├── features/
│   └── auth/
│       └── authSlice.js     # Redux slice for authentication state
├── pages/
│   ├── Home/                # Public landing page
│   ├── Login/               # Sign in
│   ├── Register/            # Sign up
│   ├── Dashboard/           # Main user dashboard
│   ├── SkillsMarketplace/   # Browse all offerings and requests
│   ├── Offerings/           # List, create, and view offerings
│   ├── Requests/            # List, create, and view requests
│   ├── Exchanges/           # User exchanges and status management
│   ├── Profile/             # View and edit profile
│   ├── ProfileSkills/       # Manage personal skills
│   └── NotFound/            # 404 page
├── services/
│   ├── api.js               # Axios instance with JWT interceptor
│   ├── authService.js       # register, login, logout, getCurrentUser
│   ├── dashboardService.js  # Dashboard data
│   ├── offeringsService.js  # CRUD for skill offerings
│   ├── requestsService.js   # CRUD for skill requests
│   ├── exchangesService.js  # CRUD for exchanges
│   ├── skillsService.js     # Skills and categories
│   └── profileService.js    # Profile read and update
├── store/
│   └── index.js             # Redux store configuration
├── utils/
│   ├── constants.js         # App-wide constants and enums
│   ├── formatters.js        # Date, text, and mode formatting helpers
│   └── validators.js        # Form validation functions
├── App.js                   # Route definitions
└── index.js                 # React entry point
```

---

## Getting Started

### Prerequisites

- Node.js 18+
- The [SkillSphere backend](https://github.com/ysmine00/skillsphere-backend) running on port `5000`

### Installation

```bash
# Clone the repository
git clone https://github.com/ysmine00/skillsphere-frontend.git
cd skillsphere-frontend

# Install dependencies
npm install

# Start the development server
npm start
```

The app will open at `http://localhost:3000`.

> Make sure the backend is running before starting the frontend.

---

## Environment Variables

Create a `.env` file at the root of the project:

```env
REACT_APP_API_URL=http://localhost:5000/api
```

If not set, the app defaults to `http://localhost:5000/api`.

---

## Pages & Routes

| Route | Auth Required | Description |
|---|---|---|
| `/` | No | Landing page |
| `/login` | No | Sign in |
| `/register` | No | Create account |
| `/dashboard` | ✓ | User dashboard with stats and activity |
| `/skills-marketplace` | ✓ | Browse all offerings and requests |
| `/offerings` | ✓ | All skill offerings |
| `/offerings/new` | ✓ | Create a new offering |
| `/offerings/:id` | ✓ | Offering detail and exchange initiation |
| `/requests` | ✓ | All skill requests |
| `/requests/new` | ✓ | Create a new request |
| `/requests/:id` | ✓ | Request detail and matching offerings |
| `/exchanges` | ✓ | User exchanges |
| `/exchanges/:id` | ✓ | Exchange detail with status timeline |
| `/profile` | ✓ | View profile |
| `/profile/edit` | ✓ | Edit profile information |
| `/profile/skills` | ✓ | Manage personal skills |

---

## How Authentication Works

1. User registers or logs in — the backend validates credentials and returns a **JWT token**
2. The token is stored in `localStorage`
3. Every API call includes the token as a `Bearer` token in the `Authorization` header, handled automatically by the Axios interceptor in `services/api.js`
4. If a token is missing or expired, the user is redirected to `/login`
5. `PrivateRoute.jsx` checks for a valid token before rendering any protected page

Only `@aui.ma` email addresses are accepted at registration, enforced on both the frontend and the database level.

---

## Related Repository

- [skillsphere-backend](https://github.com/ysmine00/skillsphere-backend) — Node.js / Express / PostgreSQL API

