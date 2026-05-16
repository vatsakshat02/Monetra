# Monetra — Loan Management System

A full-stack Loan Management System built with the MERN stack and Next.js. Borrowers can apply for loans through a multi-step application process, while internal executives manage loans through their lifecycle via a role-based operations dashboard.

---

## Tech Stack

- **Frontend:** Next.js (App Router) + TypeScript + Tailwind CSS
- **Backend:** Node.js + Express.js + TypeScript
- **Database:** MongoDB Atlas + Mongoose
- **Auth:** JWT + bcrypt

---

## Features

### Borrower Portal

- Sign up / Login with JWT authentication
- Personal details form with Business Rule Engine (BRE) eligibility check
- Salary slip upload (PDF/JPG/PNG, max 5MB)
- Loan configuration with live interest calculator (Simple Interest @ 12% p.a.)
- Real-time loan status tracking

### Operations Dashboard

- **Sales** — Lead tracking (users who registered but haven't applied)
- **Sanction** — Review and approve/reject loan applications
- **Disbursement** — Mark sanctioned loans as disbursed
- **Collection** — Record payments with UTR validation, auto-closes loan when fully paid
- **Admin** — Access to all modules

### Security

- JWT-based authentication
- Role-based access control (RBAC) on both frontend and backend
- Passwords hashed with bcrypt
- BRE runs server-side only

---

## Project Structure

Monetra/
├── client/ # Next.js frontend
│ ├── app/
│ │ ├── (auth)/ # Login, Signup
│ │ ├── (borrower)/ # Profile, Upload, Apply, Status
│ │ └── (dashboard)/ # Operations dashboard
│ └── lib/
│ └── api.ts # All API calls
└── server/ # Express backend
└── src/
├── models/ # User, Loan, Payment
├── routes/ # Auth, Borrower, Dashboard
├── controllers/ # Business logic
├── middleware/ # authenticate, authorize
└── config/ # DB connection, Multer

---

## Setup Instructions

### Prerequisites

- Node.js v18+
- MongoDB Atlas account

### 1. Clone the repository

```bash
git clone https://github.com/yourusername/Monetra.git
cd Monetra
```

### 2. Setup Backend

```bash
cd server
npm install
```

Create `.env` file:
PORT=8000
MONGO_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_jwt_secret_key
Run seed script to create test accounts:

```bash
npm run seed
```

Start the server:

```bash
npm run dev
```

### 3. Setup Frontend

```bash
cd client
npm install
npm run dev
```

Frontend runs on `http://localhost:3000`
Backend runs on `http://localhost:8000`

---

## Login Credentials

| Role         | Email                    | Password        |
| ------------ | ------------------------ | --------------- |
| Admin        | admin@monetra.com        | admin123        |
| Sales        | sales@monetra.com        | sales123        |
| Sanction     | sanction@monetra.com     | sanction123     |
| Disbursement | disbursement@monetra.com | disbursement123 |
| Collection   | collection@monetra.com   | collection123   |
| Borrower     | borrower@monetra.com     | borrower123     |

---

## BRE Rules

Loan applications are rejected if:

| Rule       | Condition                               |
| ---------- | --------------------------------------- |
| Age        | Not between 23 and 50 years             |
| Salary     | Below ₹25,000/month                     |
| PAN        | Does not match format (e.g. ABCDE1234F) |
| Employment | Applicant is unemployed                 |

---

## Loan Interest Calculation

Simple Interest formula:
SI = (P × R × T) / (365 × 100)
where R = 12% p.a., T = tenure in days
Total Repayment = Principal + SI

---

## API Endpoints

### Auth

- `POST /api/auth/signup`
- `POST /api/auth/login`

### Borrower

- `POST /api/borrower/profile`
- `POST /api/borrower/upload`
- `POST /api/borrower/apply`
- `GET /api/borrower/loan`

### Dashboard

- `GET /api/dashboard/sales`
- `GET /api/dashboard/sanction`
- `PATCH /api/dashboard/sanction/:loanId/approve`
- `PATCH /api/dashboard/sanction/:loanId/reject`
- `GET /api/dashboard/disbursement`
- `PATCH /api/dashboard/disbursement/:loanId/disburse`
- `GET /api/dashboard/collection`
- `POST /api/dashboard/collection/:loanId/payment`
