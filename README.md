# QuickHire — Server

RESTful API backend for the QuickHire job board, built with **Express 5**, **Prisma 7**, **PostgreSQL (Neon)**, and **TypeScript**. Handles authentication, job management, file uploads, and application processing.

## Live Demo

- **Backend:** [https://quickhire-server-three.vercel.app](https://quickhire-server-three.vercel.app)
- **Frontend:** [https://quickhire-client.vercel.app](https://quickhire-client.vercel.app)

## GitHub Repositories

- **Server:** [https://github.com/EtherSphere01/quickhire-server](https://github.com/EtherSphere01/quickhire-server)
- **Client:** [https://github.com/EtherSphere01/quickhire-client](https://github.com/EtherSphere01/quickhire-client)

## Tech Stack

| Technology | Version      |
| ---------- | ------------ |
| Express    | 5.2.1        |
| Prisma     | 7.4.1        |
| PostgreSQL | Neon         |
| TypeScript | 5.x          |
| Cloudinary | 2.x          |
| JWT        | jsonwebtoken |
| bcrypt     | 5.x          |

## Features

- JWT authentication with httpOnly cookies (access + refresh tokens)
- Role-based access control (ADMIN / USER)
- Full CRUD for job postings (admin only)
- Job search with keyword, location, category, and job type filters
- Pagination support with limit/page query params
- Company logo upload via Cloudinary
- Job application submission
- Request validation with Zod
- Soft delete for jobs
- Database seeding (admin user + 29 sample jobs)

## Prerequisites

- **Node.js** >= 18
- **pnpm** >= 10
- **PostgreSQL** database (recommended: [Neon](https://neon.tech))
- **Cloudinary** account for image uploads

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/EtherSphere01/quickhire-server.git
cd quickhire-server
```

### 2. Install dependencies

```bash
pnpm install
```

### 3. Environment setup

Copy the example env file and fill in your values:

```bash
cp .env.example .env
```

| Variable                   | Description                  | Default                 |
| -------------------------- | ---------------------------- | ----------------------- |
| `DATABASE_URL`             | PostgreSQL connection string | —                       |
| `PORT`                     | Server port                  | `5000`                  |
| `NODE_ENV`                 | Environment                  | `development`           |
| `JWT_SECRET`               | Secret for access tokens     | —                       |
| `REFRESH_TOKEN_SECRET`     | Secret for refresh tokens    | —                       |
| `JWT_EXPIRES_IN`           | Access token expiry          | `15m`                   |
| `REFRESH_TOKEN_EXPIRES_IN` | Refresh token expiry         | `30d`                   |
| `SALT_ROUNDS`              | bcrypt salt rounds           | `12`                    |
| `CLIENT_URL`               | Frontend URL (CORS)          | `http://localhost:3000` |
| `CLOUDINARY_CLOUD_NAME`    | Cloudinary cloud name        | —                       |
| `CLOUDINARY_API_KEY`       | Cloudinary API key           | —                       |
| `CLOUDINARY_API_SECRET`    | Cloudinary API secret        | —                       |

### 4. Run database migrations

```bash
pnpm prisma:migrate
```

### 5. Seed the database

```bash
pnpm seed
```

This creates an admin user and 29 sample job listings.

**Admin credentials:**

| Email           | Password |
| --------------- | -------- |
| admin@gmail.com | 123456   |

### 6. Start the development server

```bash
pnpm dev
```

Server runs at [http://localhost:5000](http://localhost:5000).

## Available Scripts

| Script            | Command                | Description                     |
| ----------------- | ---------------------- | ------------------------------- |
| `dev`             | `pnpm dev`             | Start dev server with tsx watch |
| `build`           | `pnpm build`           | Compile TypeScript              |
| `start`           | `pnpm start`           | Run compiled output             |
| `seed`            | `pnpm seed`            | Seed database with sample data  |
| `prisma:generate` | `pnpm prisma:generate` | Generate Prisma client          |
| `prisma:migrate`  | `pnpm prisma:migrate`  | Run database migrations         |
| `prisma:deploy`   | `pnpm prisma:deploy`   | Deploy migrations (production)  |

## API Endpoints

Base URL: `/api`

### Authentication — `/api/auth`

| Method | Endpoint              | Auth | Description          |
| ------ | --------------------- | ---- | -------------------- |
| POST   | `/auth/register`      | No   | Register a new user  |
| POST   | `/auth/login`         | No   | Login and get tokens |
| POST   | `/auth/logout`        | No   | Clear auth cookies   |
| POST   | `/auth/refresh-token` | No   | Refresh access token |

#### POST `/api/auth/register`

```json
{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123"
}
```

#### POST `/api/auth/login`

```json
{
    "email": "admin@gmail.com",
    "password": "123456"
}
```

### Jobs — `/api/jobs`

| Method | Endpoint    | Auth  | Description              |
| ------ | ----------- | ----- | ------------------------ |
| GET    | `/jobs`     | No    | List jobs (with filters) |
| GET    | `/jobs/:id` | No    | Get job by ID            |
| POST   | `/jobs`     | ADMIN | Create a new job         |
| PATCH  | `/jobs/:id` | ADMIN | Update a job             |
| DELETE | `/jobs/:id` | ADMIN | Soft delete a job        |

**Query parameters for `GET /api/jobs`:**

| Param      | Type   | Description                                 |
| ---------- | ------ | ------------------------------------------- |
| `search`   | string | Search in title, company, location          |
| `location` | string | Filter by location                          |
| `category` | string | Filter by category                          |
| `job_type` | string | Filter by type (FULL_TIME, PART_TIME, etc.) |
| `page`     | number | Page number (default: 1)                    |
| `limit`    | number | Items per page (default: 9)                 |

### Applications — `/api/applications`

| Method | Endpoint                   | Auth  | Description                |
| ------ | -------------------------- | ----- | -------------------------- |
| POST   | `/applications`            | No    | Submit a job application   |
| GET    | `/applications/job/:jobId` | ADMIN | Get applications for a job |

#### POST `/api/applications`

```json
{
    "job_id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "resume_link": "https://example.com/resume.pdf",
    "cover_note": "I'm excited to apply..."
}
```

## Database Schema

### User

| Field    | Type   | Notes             |
| -------- | ------ | ----------------- |
| id       | Int    | Auto-increment PK |
| name     | String |                   |
| email    | String | Unique, indexed   |
| password | String | Hashed            |
| role     | Role   | ADMIN / USER      |

### Job

| Field        | Type    | Notes             |
| ------------ | ------- | ----------------- |
| id           | Int     | Auto-increment PK |
| title        | String  |                   |
| company      | String  |                   |
| company_logo | String? | Cloudinary URL    |
| location     | String  |                   |
| category     | String  |                   |
| job_type     | JobType | Enum              |
| salary       | Int?    | Optional          |
| description  | String  |                   |
| isDeleted    | Boolean | Soft delete flag  |

### Application

| Field       | Type   | Notes             |
| ----------- | ------ | ----------------- |
| id          | Int    | Auto-increment PK |
| job_id      | Int    | FK → Job          |
| name        | String |                   |
| email       | String | Indexed           |
| resume_link | String |                   |
| cover_note  | String |                   |

### Enums

- **Role:** `ADMIN`, `USER`
- **JobType:** `FULL_TIME`, `PART_TIME`, `CONTRACT`, `INTERNSHIP`, `FREELANCE`

## Project Structure

```
src/
├── app.ts                   # Express app setup
├── server.ts                # Server entry point
├── seed.ts                  # Database seeder
├── config/
│   └── index.ts             # Environment config
├── app/
│   ├── middlewares/
│   │   ├── auth.ts          # JWT + role guard
│   │   ├── upload.ts        # Multer file upload (5MB max)
│   │   └── validateRequest.ts # Zod validation
│   ├── modules/
│   │   ├── auth/            # Register, login, logout, refresh
│   │   ├── job/             # CRUD with search & pagination
│   │   └── application/     # Apply & list by job
│   ├── routes/
│   │   └── index.ts         # Route aggregator
│   └── utils/
│       ├── prisma.ts        # Prisma client instance
│       └── cloudinary.ts    # Cloudinary config
prisma/
├── schema/
│   ├── schema.prisma        # Generator & datasource
│   ├── user.prisma          # User model
│   ├── job.prisma           # Job model
│   ├── application.prisma   # Application model
│   └── enum.prisma          # Role & JobType enums
└── migrations/              # Migration history
```
