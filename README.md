# Nurses Alliance Network (NAN)

Welcome to the **Nurses Alliance Network (NAN)** platform. This repository contains the complete codebase for a professional health organization platform designed to support nurses with continuing education credits, career opportunities, advocacy campaigns, and member communication.

The application is built using a modern decoupled architecture: a **React + Vite** client for the user interface, and a **Node + Express** API server connected to a **PostgreSQL** database hosted on Neon.

---

## Table of Contents
1. [Architecture & Technologies](#architecture--technologies)
2. [Healthcare Branding Design System](#healthcare-branding-design-system)
3. [Database Schema & Migrations](#database-schema--migrations)
4. [Environment Configuration](#environment-configuration)
5. [Local Development Setup](#local-development-setup)
6. [Production Build & Deployment Guide](#production-build--deployment-guide)
7. [Admin Dashboard & Content Management](#admin-dashboard--content-management)

---

## Architecture & Technologies

### 1. Frontend Client
- **Core Framework**: React (v18) initialized with Vite for rapid hot-reloading and building.
- **Styling**: Tailwind CSS (v3) using a strict, modern healthcare palette.
- **Navigation & Routing**: `react-router-dom` (v6) for multi-page client-side SPA routing.
- **State & Data Fetching**: TanStack React Query (v5) for caching and robust client-server state synchronization; `zustand` for client-side state.
- **Icons**: Lucide React for consistent clinical and navigation iconography.
- **Animations**: Framer Motion / Motion for premium and responsive transitions.

### 2. Backend API Server
- **Server Framework**: Node.js with Express.js.
- **Database Connection**: Neon Serverless PostgreSQL (`@neondatabase/serverless`).
- **Security & Session Management**:
  - JWT (`jsonwebtoken`) for secure administrative authorization.
  - `cookie-parser` for secure HTTP-only cookies storing sessions.
  - `express-rate-limit` to restrict brute force requests on public forms and authentication.
- **File Uploads**: `multer` for managing administrative assets and image uploads.
- **Production Integration**: Express serves the static React build (`dist/` folder) and maps single-page application routes back to `index.html`.

---

## Healthcare Branding Design System

All public-facing pages use a clean, professional, clinical color scheme representing safety, hygiene, and trust. Gradients are excluded to maintain a high-trust, natural feel.

| Role | Color Name | Hex Code | Applied Elements |
| :--- | :--- | :--- | :--- |
| **Primary** | Medical Blue | `#2563EB` | Active nav links, tabs, key focus states, regular buttons, loading indicator. |
| **Secondary** | Clean White | `#FFFFFF` | Core page backgrounds, cards, content blocks. |
| **Accent** | Emerald Green | `#10B981` | CTA buttons ("Join", "Subscribe"), success states, badges/tags, map/contact icons. |
| **Background** | Light Gray | `#F8FAFC` | Subtle alternates, input fields, header base, footers. |
| **Text** | Dark Gray | `#1F2937` | Main typography, headings, paragraphs, descriptions. |

*Note: The Administrative portal (`/admin`) is styled separately using a robust dark slate dashboard theme to distinguish management operations from the public brand.*

---

## Database Schema & Migrations

NAN uses PostgreSQL to store page settings, membership packages, initiatives, and inquiries. The tables are configured inside `server/migrate.js`:

1. **`users`**: Administrative accounts (includes seed login `admin@nursesalliancenetwork.org`).
2. **`site_settings`**: Key-value metadata powering public text dynamically (e.g., hero headlines, statistics).
3. **`initiatives`**: Campaigns, outreach events, and project portfolio.
4. **`programs`**: Continuing education and representation benefits.
5. **`member_spotlights`**: Testimonials from clinical personnel.
6. **`membership_packages`**: Subscription pricing plans.
7. **`contact_inquiries`**: Submitted customer inquiry forms.
8. **`blog_posts`**: News and advocacy articles.

### Running Migrations
To initialize tables and default settings on your database instance:
```bash
node server/migrate.js
```

---

## Environment Configuration

Create a `.env` file in the root directory (based on `.env.example`):

```ini
# Neon PostgreSQL Connection URL
DATABASE_URL=postgresql://<user>:<password>@<host>/<dbname>?sslmode=require

# JWT Secret Key for authenticating administrative accounts
JWT_SECRET=your_jwt_secret_key_here

# Express Server Port
PORT=5001

# Allowed origins for CORS separation (comma-separated list for Dev & Production)
FRONTEND_URL=http://localhost:4001,http://localhost:4000
```

---

## Local Development Setup

### 1. Install Dependencies
In the root directory, run:
```bash
npm install
```

### 2. Database Synchronization
Ensure your `.env` contains a valid `DATABASE_URL` link, then trigger the migration script:
```bash
node server/migrate.js
```

### 3. Run Development Servers
Start both the Express API server (port `5001`) and the Vite Client dev server (port `4001` or `4000`) concurrently using:
```bash
npm run dev
```
Open your browser and navigate to `http://localhost:4001/` to view the website.

---

## Production Build & Deployment Guide

For optimal performance, the application can be deployed as a single, unified Node process where the Express server hosts the built React client.

### Step 1: Build the Client
Generate the static assets for the React single page app:
```bash
npm run build
```
This compile step bundles code, minimizes CSS/JS, and places all static output in the `dist` directory.

### Step 2: Test Production Build Locally
Verify the unified server can run in production mode on your system:
```bash
npm start
```
This launches `server/index.js` on port `5001` (or whichever `PORT` is defined in `.env`). The server automatically:
- Serves API routes at `/api/*`
- Serves images uploaded to administrative sections at `/uploads/*`
- Serves the static React build inside `dist/`
- Points all client fallback routes (e.g. `/about`, `/pricing`) back to `dist/index.html` for React Router handler execution.

---

## Deploying to Cloud Providers

### A. Unified Hosting (Single Process - Recommended)
Services like **Render**, **Railway**, or **Heroku** can compile and host the monorepo in a single container.

1. **Create Web Service**: Connect your GitHub repository to the hosting platform.
2. **Configure Environment Variables**: Add `DATABASE_URL`, `JWT_SECRET`, `PORT`, and `FRONTEND_URL` to the environment variables settings panel.
3. **Build Command**: Instruct the platform to install and bundle:
   ```bash
   npm install && npm run build
   ```
4. **Start Command**:
   ```bash
   npm start
   ```

### B. Decoupled Hosting (Split Process)
Alternatively, you can host the frontend and backend on distinct platforms (e.g., frontend on **Vercel/Netlify** and backend on **Render/Railway**).

#### 1. Backend Server Deployment
- Deploy the server folder to a container service.
- Configure `DATABASE_URL`, `JWT_SECRET`, and `PORT`.
- Set `FRONTEND_URL` to point to your live frontend address (e.g. `https://nursesalliance.vercel.app`) to authorize CORS requests.

#### 2. Frontend SPA Deployment
- Deploy the root workspace to Vercel/Netlify.
- Set the build output directory to `dist`.
- Build Command: `npm run build`.
- **Crucial Redirect Configuration**: Since React Router handles URL routing, configure redirects so that all page reloads route back to `index.html`.
  - **For Vercel**: Create a `vercel.json` in the root:
    ```json
    {
      "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
    }
    ```
  - **For Netlify**: Create a `_redirects` file in `public/` folder:
    ```text
    /*    /index.html   200
    ```

---

## Admin Dashboard & Content Management

The administration section is located at `/admin/content`. It is a protected panel where alliance administrators can:
- **Configure Site Settings**: Update homepage headlines, contact emails, numbers, and descriptive text dynamically.
- **Manage Programs & Benefits**: Create, edit, and delete Continuing Education items.
- **Publish Initiatives**: Control active policy campaigns and local community projects shown on the portfolio page.
- **Read Contact Inquiries**: Track incoming feedback forms submitted by public users.

To log in:
1. Navigate to `/login`.
2. Enter the default administrator account credentials:
   - **Email**: `admin@nursesalliancenetwork.org`
   - **Password**: `admin123`
3. *Note: For security in production, administrators should update their password directly in the user database or settings.*
