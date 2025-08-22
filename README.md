# Inventory Management Frontend (Next.js)

This repository contains the frontend for an Inventory Management system built with Next.js, React, TypeScript, and Tailwind CSS. It provides a dashboard and forms to add, view, and update resource allocations while integrating with a FastAPI backend.

## Contents
- Overview
- Tech stack and scripts
- Project structure
- Pages and user flows
- Validation rules
- Backend integration (API contracts)
- Getting started
- Configuration and environment
- Troubleshooting
- Future improvements

## Overview
The frontend provides:
- A dashboard with inventory insights and charts.
- A form to add new resource allocations with strict validation.
- A page to search and update existing resource allocations by serial number.
- A person-centric search view to find allocations by name and email.

All API calls assume a local FastAPI server at `http://127.0.0.1:8000`.

## Tech stack and scripts
- Next.js: `15.4.6`
- React: `19.1.0`
- TypeScript: `^5`
- Tailwind CSS: `^4`
- Icons: `@heroicons/react`, `lucide-react`
- Charts: `recharts`

Scripts (in [inventory-dashboard/package.json](./inventory-dashboard/package.json:0:0-0:0)):
- `npm run dev` — Start Next.js dev server with Turbopack
- `npm run build` — Production build
- `npm run start` — Start production server
- `npm run lint` — Run ESLint

## Project structure
Frontend root: `inventory-dashboard/`

Key paths:
- [src/app/page.tsx](./inventory-dashboard/src/app/page.tsx:0:0-0:0) — Root route (`/`), renders the dashboard.
- [src/app/add-resource-allocation/page.tsx](./inventory-dashboard/src/app/add-resource-allocation/page.tsx:0:0-0:0) — `/add-resource-allocation` page.
- [src/app/update-resource-allocation/page.tsx](./inventory-dashboard/src/app/update-resource-allocation/page.tsx:0:0-0:0) — `/update-resource-allocation` page.
- [src/app/person-view/page.tsx](./inventory-dashboard/src/app/person-view/page.tsx:0:0-0:0) — `/person-view` page.
- [src/app/api/dashboard/route.ts](./inventory-dashboard/src/app/api/dashboard/route.ts:0:0-0:0) — Mock API route for dashboard charts.
- [src/components/DashboardContent.tsx](./inventory-dashboard/src/components/DashboardContent.tsx:0:0-0:0) — Dashboard composition component.
- [src/app/layout.tsx](./inventory-dashboard/src/app/layout.tsx:0:0-0:0), [src/app/globals.css](./inventory-dashboard/src/app/globals.css:0:0-0:0) — App layout and global styles.

Directory layout (simplified):

inventory-dashboard/ src/ app/ add-resource-allocation/ page.tsx update-resource-allocation/ page.tsx person-view/ page.tsx api/ dashboard/ route.ts layout.tsx page.tsx globals.css components/ DashboardContent.tsx


Dashboard widgets used by [DashboardContent.tsx](./inventory-dashboard/src/components/DashboardContent.tsx:0:0-0:0):
- `InventoryInsights`
- `DeployedModelView`
- `StockModelView`
- `DeployedModelSubStatus`
- `StockModelSubStatus`

These consume mock data from [src/app/api/dashboard/route.ts](./inventory-dashboard/src/app/api/dashboard/route.ts:0:0-0:0) and render with `recharts`.

## Pages and user flows

### 1) Dashboard (`/`)
- Renders [DashboardContent](cci:1://file:///Users/A118390615/Library/CloudStorage/OneDrive-DeutscheTelekomAG/Projects/COE_Projects/inventory_management/inventory-dashboard/src/components/DashboardContent.tsx:8:0-44:1), aggregating charts and insights.
- Uses mocked dashboard data for local development.

### 2) Add Resource Allocation (`/add-resource-allocation`)
File: [src/app/add-resource-allocation/page.tsx](./inventory-dashboard/src/app/add-resource-allocation/page.tsx:0:0-0:0)
- Purpose: Create a new resource allocation record.
- Fields: `name`, `serialNumber`, `allocationDate` (date picker), `po`, `location` (dropdown), `email`, `details`.
- Behavior:
  - Validates all fields (see Validation rules).
  - On success: calls `POST /addResourceAllocation`, displays success alert, resets form, and shows a saved summary table.
  - On failure: shows field errors when provided and an “Unsuccessful operation” alert.

### 3) Update Resource Allocation (`/update-resource-allocation`)
File: [src/app/update-resource-allocation/page.tsx](./inventory-dashboard/src/app/update-resource-allocation/page.tsx:0:0-0:0)
- Purpose: Search by Mac serial number, load existing allocation, edit, and update.
- Flow:
  1. Enter Mac Serial Number → “Search”.
  2. If found, edit fields: `name`, `allocation_date` (date picker), `cost_center`, `location` (Pune/Bangalore), `email`, `detail`.
  3. Click “Update Info” to persist changes.
- UX highlights:
  - Allocation Date uses an HTML date input and normalizes to `YYYY-MM-DD`.
  - Location is sanitized to only Pune/Bangalore; non-matching values are cleared.
  - Email accepts any valid format; empty is allowed. Invalid non-empty blocks update.
  - Buttons have loading/disabled states during network calls or invalid states.
- Backend:
  - `POST /getSerialnumberAllocation` — fetch record by serial number.
  - `POST /updateResourceAllocation` — update record.

### 4) Person View (`/person-view`)
File: [src/app/person-view/page.tsx](./inventory-dashboard/src/app/person-view/page.tsx:0:0-0:0)
- Purpose: Search allocations by `name` and `email`.
- Email requires `@t-systems.com` domain.
- Results appear as responsive cards; details open in a modal.
- Backend: `POST /getResourceAllocation`.

## Validation rules

- Add Resource Allocation:
  - All fields are required.
  - Email must end with `@t-systems.com`.
  - Location must be one of: `Pune`, `Bangalore`.
  - Allocation Date required, via date picker.

- Update Resource Allocation:
  - Search requires serial number.
  - Email: any valid format; can be empty. Invalid non-empty blocks update.
  - Location limited to `Pune`/`Bangalore`.
  - Allocation Date normalized to `YYYY-MM-DD`.

- Person View:
  - Name and email are required.
  - Email must be `@t-systems.com`.

## Backend integration (API contracts)
Base URL: `http://127.0.0.1:8000`

Endpoints used:

- `POST /addResourceAllocation`
  - Request body:
    ```json
    {
      "name": "Alice",
      "serialNumber": "XYZ123",
      "allocationDate": "2025-08-15",
      "po": "PO-0001",
      "location": "Pune",
      "email": "alice@t-systems.com",
      "detail": "MacBook Pro 14"
    }
    ```
  - Response: `{ "status": "Success" }` on success; may include `errors` for fields.

- `POST /getSerialnumberAllocation`
  - Request:
    ```json
    { "serialnumber": "XYZ123" }
    ```
  - Response: An object/array with `name`, `allocation_date`, `cost_center`, `location`, `email`, `detail` (or `details`).

- `POST /updateResourceAllocation`
  - Request:
    ```json
    {
      "serialnumber": "XYZ123",
      "name": "Alice",
      "allocation_date": "2025-08-16",
      "cost_center": "CC-01",
      "location": "Bangalore",
      "email": "alice@example.com",
      "detail": "Reassigned"
    }
    ```
  - Response: `{ "status": "Success" }` on success.

- `POST /getResourceAllocation`
  - Request:
    ```json
    { "name": "Alice", "email": "alice@t-systems.com" }
    ```
  - Response: Array with `service_tag_number`, `name`, `allocation_date`, `cost_center`, `location`, `email`.

Notes:
- Dashboard charts use [src/app/api/dashboard/route.ts](./inventory-dashboard/src/app/api/dashboard/route.ts:0:0-0:0) for mock data in development.
- Ensure FastAPI is running locally for form pages.

## Getting started

1) Install dependencies (from `inventory-dashboard/`):
```bash
npm install
undefined
Run the frontend:
bash
npm run dev
Open http://localhost:3000

Ensure backend is running:
FastAPI at http://127.0.0.1:8000.
Production build:
bash
npm run build
npm run start
Configuration and environment
API base URL is hardcoded in:
src/app/add-resource-allocation/page.tsx
src/app/update-resource-allocation/page.tsx
src/app/person-view/page.tsx
Recommended improvement:
Use NEXT_PUBLIC_API_BASE_URL and centralize fetch logic.
Tailwind CSS v4 configured via @tailwindcss/postcss.
Global styles: 
src/app/globals.css
.
Troubleshooting
CORS errors:
Allow http://localhost:3000 in the FastAPI CORS settings.
Network errors/404:
Confirm backend endpoints and that FastAPI is running at 127.0.0.1:8000.
Date format issues:
Update page normalizes to YYYY-MM-DD. If backend differs, adjust normalization.
Email validation discrepancies:
Add/Person View require @t-systems.com; Update page allows any valid email or empty.
Future improvements
Centralize API base URL and request utilities.
Adopt React Hook Form for consistent form/state handling.
Share a single source for location options.
Replace alerts with a toast/notification system.
Wire dashboard to live backend endpoints.
Add end-to-end tests for critical flows.
Frontend: inventory-dashboard/
Backend: action_server/
Run both for full functionality.



Dashboard widgets used by [DashboardContent.tsx](./inventory-dashboard/src/components/DashboardContent.tsx:0:0-0:0):
- `InventoryInsights`
- `DeployedModelView`
- `StockModelView`
- `DeployedModelSubStatus`
- `StockModelSubStatus`

These consume mock data from [src/app/api/dashboard/route.ts](./inventory-dashboard/src/app/api/dashboard/route.ts:0:0-0:0) and render with `recharts`.

## Pages and user flows

### 1) Dashboard (`/`)
- Renders [DashboardContent](cci:1://file:///Users/A118390615/Library/CloudStorage/OneDrive-DeutscheTelekomAG/Projects/COE_Projects/inventory_management/inventory-dashboard/src/components/DashboardContent.tsx:8:0-44:1), aggregating charts and insights.
- Uses mocked dashboard data for local development.

### 2) Add Resource Allocation (`/add-resource-allocation`)
File: [src/app/add-resource-allocation/page.tsx](./inventory-dashboard/src/app/add-resource-allocation/page.tsx:0:0-0:0)
- Purpose: Create a new resource allocation record.
- Fields: `name`, `serialNumber`, `allocationDate` (date picker), `po`, `location` (dropdown), `email`, `details`.
- Behavior:
  - Validates all fields (see Validation rules).
  - On success: calls `POST /addResourceAllocation`, displays success alert, resets form, and shows a saved summary table.
  - On failure: shows field errors when provided and an “Unsuccessful operation” alert.

### 3) Update Resource Allocation (`/update-resource-allocation`)
File: [src/app/update-resource-allocation/page.tsx](./inventory-dashboard/src/app/update-resource-allocation/page.tsx:0:0-0:0)
- Purpose: Search by Mac serial number, load existing allocation, edit, and update.
- Flow:
  1. Enter Mac Serial Number → “Search”.
  2. If found, edit fields: `name`, `allocation_date` (date picker), `cost_center`, `location` (Pune/Bangalore), `email`, `detail`.
  3. Click “Update Info” to persist changes.
- UX highlights:
  - Allocation Date uses an HTML date input and normalizes to `YYYY-MM-DD`.
  - Location is sanitized to only Pune/Bangalore; non-matching values are cleared.
  - Email accepts any valid format; empty is allowed. Invalid non-empty blocks update.
  - Buttons have loading/disabled states during network calls or invalid states.
- Backend:
  - `POST /getSerialnumberAllocation` — fetch record by serial number.
  - `POST /updateResourceAllocation` — update record.

### 4) Person View (`/person-view`)
File: [src/app/person-view/page.tsx](./inventory-dashboard/src/app/person-view/page.tsx:0:0-0:0)
- Purpose: Search allocations by `name` and `email`.
- Email requires `@t-systems.com` domain.
- Results appear as responsive cards; details open in a modal.
- Backend: `POST /getResourceAllocation`.

## Validation rules

- Add Resource Allocation:
  - All fields are required.
  - Email must end with `@t-systems.com`.
  - Location must be one of: `Pune`, `Bangalore`.
  - Allocation Date required, via date picker.

- Update Resource Allocation:
  - Search requires serial number.
  - Email: any valid format; can be empty. Invalid non-empty blocks update.
  - Location limited to `Pune`/`Bangalore`.
  - Allocation Date normalized to `YYYY-MM-DD`.

- Person View:
  - Name and email are required.
  - Email must be `@t-systems.com`.

## Backend integration (API contracts)
Base URL: `http://127.0.0.1:8000`

Endpoints used:

- `POST /addResourceAllocation`
  - Request body:
    ```json
    {
      "name": "Alice",
      "serialNumber": "XYZ123",
      "allocationDate": "2025-08-15",
      "po": "PO-0001",
      "location": "Pune",
      "email": "alice@t-systems.com",
      "detail": "MacBook Pro 14"
    }
    ```
  - Response: `{ "status": "Success" }` on success; may include `errors` for fields.

- `POST /getSerialnumberAllocation`
  - Request:
    ```json
    { "serialnumber": "XYZ123" }
    ```
  - Response: An object/array with `name`, `allocation_date`, `cost_center`, `location`, `email`, `detail` (or `details`).

- `POST /updateResourceAllocation`
  - Request:
    ```json
    {
      "serialnumber": "XYZ123",
      "name": "Alice",
      "allocation_date": "2025-08-16",
      "cost_center": "CC-01",
      "location": "Bangalore",
      "email": "alice@example.com",
      "detail": "Reassigned"
    }
    ```
  - Response: `{ "status": "Success" }` on success.

- `POST /getResourceAllocation`
  - Request:
    ```json
    { "name": "Alice", "email": "alice@t-systems.com" }
    ```
  - Response: Array with `service_tag_number`, `name`, `allocation_date`, `cost_center`, `location`, `email`.

Notes:
- Dashboard charts use [src/app/api/dashboard/route.ts](./inventory-dashboard/src/app/api/dashboard/route.ts:0:0-0:0) for mock data in development.
- Ensure FastAPI is running locally for form pages.

## Getting started

1) Install dependencies (from `inventory-dashboard/`):
```bash
npm install