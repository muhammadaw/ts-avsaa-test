# Airline Voucher Seat Assignment Application

A full-stack web application designed for airline crew members to randomly assign 3 unique, non-repeating seat numbers to promotional campaign voucher winners for each flight.

---

## Technical Stack

- **Frontend**: Next.js 14 (TypeScript), Ant Design (`antd`), `@ant-design/nextjs-registry`, Vanilla CSS (Luxury Airline Theme).
- **Backend**: Node.js + Express.js (TypeScript), Prisma ORM, Zod validation, Vitest + Supertest.
- **Database**: SQLite (`vouchers.db`) with unique constraint on `(flight_number, flight_date)`.
- **DevOps**: Docker & Docker Compose setup.

---

## Seat Layout Specifications

The backend generates valid, non-repeating seats matching specific aircraft layouts:

| Aircraft Type | Row Range | Seats per Row | Example Valid Seats | Example Invalid Seats |
| :--- | :--- | :--- | :--- | :--- |
| **ATR** | 1 – 18 | `A, C, D, F` | `1A`, `18F` | `5B`, `5E` |
| **Airbus 320** | 1 – 32 | `A, B, C, D, E, F` | `1A`, `32F` | `33A`, `10G` |
| **Boeing 737 Max** | 1 – 32 | `A, B, C, D, E, F` | `1A`, `32F` | `0A`, `33F` |

---

## Prerequisites

Before running locally, ensure you have installed:
- **Node.js**: v18.0.0 or higher
- **npm**: v9.0.0 or higher
- *(Optional)* **Docker & Docker Compose**: For containerized setup.

---

## Installation & Setup

### 1. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Push database schema to SQLite (creates/syncs vouchers.db)
npx prisma db push

# Generate Prisma Client
npx prisma generate
```

### 2. Frontend Setup

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install
```

---

## Running the Application

### Option A: Local Development Server

1. **Start the Backend Express Server**:
   ```bash
   cd backend
   npm run dev
   ```
   The backend API will run at `http://localhost:5000`.

2. **Start the Frontend Next.js Server**:
   ```bash
   cd frontend
   npm run dev
   ```
   Open your browser and navigate to `http://localhost:3000`.

---

### Option B: Docker Compose

You can launch both the frontend and backend with a single command:

```bash
# From the root directory
docker-compose up --build
```

- Frontend UI: `http://localhost:3000`
- Backend API: `http://localhost:5000`

---

## Testing

### Backend Unit & Integration Tests

Run the test suite powered by Vitest and Supertest:

```bash
cd backend
npm test
```

This runs:
- **Unit tests** verifying seat validation, row/column boundaries, and random uniqueness for all aircraft types.
- **Integration tests** verifying `/api/check` and `/api/generate` API endpoints and double-generation duplicate protection.

---

## API Documentation

### 1. Check Voucher Assignment Status
- **Endpoint**: `POST /api/check`
- **Request Body**:
  ```json
  {
    "flightNumber": "GA102",
    "date": "2025-07-12"
  }
  ```
- **Response**:
  ```json
  {
    "exists": false
  }
  ```

### 2. Generate Seat Vouchers
- **Endpoint**: `POST /api/generate`
- **Request Body**:
  ```json
  {
    "name": "Sarah",
    "id": "98123",
    "flightNumber": "GA102",
    "date": "2025-07-12",
    "aircraft": "Airbus 320"
  }
  ```
- **Response (Success - 201 Created)**:
  ```json
  {
    "success": true,
    "seats": ["3B", "7C", "14D"]
  }
  ```
- **Response (Conflict - 409 Conflict)**:
  ```json
  {
    "success": false,
    "error": "Conflict",
    "message": "Voucher assignments have already been generated for flight GA102 on 2025-07-12."
  }
  ```

---

## Project Structure

```text
ts-avsaa-test/
├── frontend/                  # Next.js 14 React Application
│   ├── src/
│   │   ├── app/               # Next.js App Router (pages, layout, theme provider)
│   │   ├── components/        # VoucherForm & BoardingPassResult UI components
│   │   └── styles/            # Custom CSS styling
│   ├── Dockerfile
│   └── package.json
├── backend/                   # Express.js TypeScript Backend
│   ├── src/
│   │   ├── controllers/       # API route controllers
│   │   ├── routes/            # REST API routing definitions
│   │   ├── services/          # Seat layout logic & database service
│   │   └── utils/             # Validation schemas & error handling
│   ├── prisma/                # Prisma SQLite schema & migrations
│   ├── Dockerfile
│   └── package.json
├── docker-compose.yml         # Container orchestration
└── README.md                  # Instructions and documentation
```