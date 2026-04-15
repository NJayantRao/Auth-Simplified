# 🔐 Auth-Simplified

A production-ready fullstack authentication boilerplate built with **React + Express + PostgreSQL + Redis**. Use it as a project template via `degit` to skip the auth setup and jump straight into building your app.

> **Template repo:** [github.com/NJayantRao/Auth-Simplified](https://github.com/NJayantRao/Auth-Simplified)

---

## ✨ Features

- **JWT Authentication** — Access token (15m) + Refresh token (7d) with automatic rotation
- **HTTP-only Cookie Security** — Tokens stored in secure, httpOnly cookies (not localStorage)
- **Email Verification** — Time-limited verification links via Nodemailer + Gmail OAuth2
- **Redis Session Management** — Refresh tokens stored in Redis; blacklisting on logout
- **Rate Limiting** — Redis-backed IP-level rate limiter (10 req/min per IP)
- **Role-based Access** — `User` and `Admin` roles via Prisma enum
- **Zod Validation** — Schema validation on all auth endpoints
- **Swagger API Docs** — Auto-generated docs at `/api-docs`
- **React Auth Context** — Global auth state with `useAuth` hook
- **Protected Routes** — Frontend route guards baked in

---

## 🛠 Tech Stack

### Backend (`/server`)
| Layer | Technology |
|---|---|
| Runtime | Node.js + TypeScript (`tsx`) |
| Framework | Express 5 |
| ORM | Prisma 7 (PostgreSQL) |
| Session Store | Redis (ioredis) |
| Auth | JWT (`jsonwebtoken`) + bcrypt |
| Email | Nodemailer + Gmail OAuth2 + Mailgen |
| Validation | Zod |
| API Docs | Swagger UI Express |

### Frontend (`/client`)
| Layer | Technology |
|---|---|
| Framework | React 19 + TypeScript |
| Build Tool | Vite 8 |
| Routing | React Router 7 |
| Styling | Tailwind CSS 4 + shadcn/ui |
| HTTP Client | Axios |
| Notifications | React Hot Toast |

### Infrastructure
| Service | Tool |
|---|---|
| Database | PostgreSQL 16 |
| Cache / Session | Redis Stack |
| Orchestration | Docker Compose |

---

## 📁 Project Structure

```
Auth-Simplified/
├── docker-compose.yml          # PostgreSQL + Redis Stack
├── client/                     # React frontend
│   ├── src/
│   │   ├── context/
│   │   │   └── AuthContext.tsx # Global auth state
│   │   ├── hooks/
│   │   │   └── useAuth.ts      # register, login, logout, getUser
│   │   ├── pages/
│   │   │   ├── Home.tsx
│   │   │   ├── SignIn.tsx
│   │   │   ├── SignUp.tsx
│   │   │   └── Dashboard.tsx
│   │   ├── services/
│   │   │   └── auth.api.ts     # Axios instance
│   │   └── App.tsx             # Routes + guards
│   └── .env                    # VITE_BACKEND_URL
└── server/                     # Express backend
    ├── src/
    │   ├── controllers/
    │   │   ├── auth.controller.ts   # register, login, logout, verifyEmail, refreshToken
    │   │   └── user.controller.ts   # getProfile, verifyUserEmail
    │   ├── middlewares/
    │   │   ├── auth-middleware.ts       # JWT verify + token generators
    │   │   ├── rate-limit-middleware.ts # Redis rate limiter
    │   │   └── zod-validation.ts        # Request body validation
    │   ├── routes/
    │   │   ├── auth.routes.ts      # /api/v1/auth/*
    │   │   └── user.routes.ts      # /api/v1/users/*
    │   ├── prisma/
    │   │   └── schema.prisma       # User model + Role enum
    │   ├── lib/                    # DB, Redis, Nodemailer, Swagger, bcrypt
    │   ├── utils/                  # ApiError, ApiResponse, AsyncHandler
    │   └── validators/
    │       └── auth-schema.ts      # Zod schemas
    └── .env                        # Server environment variables
```

---

## 🚀 Quick Start (via degit)

### 1. Scaffold the template

```bash
npx degit NJayantRao/Auth-Simplified my-app
cd my-app
```

### 2. Start infrastructure (Docker required)

```bash
docker compose up -d
```

This starts:
- **PostgreSQL 16** on port `5431`
- **Redis Stack** on ports `6379` (Redis) and `8001` (RedisInsight UI)

### 3. Set up the server

```bash
cd server
npm install
```

Create a `.env` file in `/server` (see [Environment Variables](#-environment-variables) below):

```bash
cp .env.sample .env
# Then fill in your values
```

Run database migrations:

```bash
npx prisma migrate dev
```

Start the dev server:

```bash
npm run dev
```

Server runs at `http://localhost:5000`  
Swagger docs at `http://localhost:5000/api-docs`

### 4. Set up the client

```bash
cd ../client
npm install
```

The `.env` is pre-configured:

```env
VITE_BACKEND_URL=http://localhost:5000/api/v1
```

Start the dev client:

```bash
npm run dev
```

Client runs at `http://localhost:5173`

---

## 🔑 Environment Variables

### `/server/.env`

```env
# App
NODE_ENV=DEVELOPMENT
PORT=5000

# PostgreSQL (matches docker-compose defaults)
DATABASE_URL=postgresql://admin:admin@localhost:5431/postgres

# JWT Secrets — generate strong random strings
ACCESS_TOKEN_SECRET=your_access_token_secret_here
REFRESH_TOKEN_SECRET=your_refresh_token_secret_here

# Gmail OAuth2 (for email verification)
EMAIL_USER=your_gmail@gmail.com
CLIENT_ID=your_google_oauth_client_id
CLIENT_SECRET=your_google_oauth_client_secret
GMAIL_REFRESH_TOKEN=your_gmail_refresh_token
```

> **Note:** Never commit your `.env` to version control. A `.gitignore` is already set up.

### `/client/.env`

```env
VITE_BACKEND_URL=http://localhost:5000/api/v1
```

---

## 📡 API Reference

### Auth Routes — `/api/v1/auth`

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| `POST` | `/register` | Public | Register new user, sends verification email |
| `POST` | `/login` | Public | Login, returns tokens in cookies |
| `POST` | `/logout` | 🔒 Private | Blacklists refresh token, clears cookies |
| `GET` | `/verify-email` | Public | Verifies email via token link (`?id=&verifyToken=`) |
| `POST` | `/refresh-token` | 🔒 Private | Issues new access token from valid refresh token |

### User Routes — `/api/v1/users`

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| `GET` | `/profile` | 🔒 Private | Returns authenticated user's profile |
| `POST` | `/verify-email` | 🔒 Private | Trigger re-send of verification email |

---

## 🗄 Database Schema

```prisma
model User {
  id         String   @id @default(uuid())
  name       String
  email      String   @unique
  password   String
  role       Role     @default(User)
  createdAt  DateTime @default(now())
  updatedAt  DateTime @updatedAt
  isVerified Boolean  @default(false)
}

enum Role {
  User
  Admin
}
```

---

## 🔒 Auth Flow

```
Register/Login
  └─► Generate Access Token (15m) + Refresh Token (7d)
       ├─► Store Refresh Token in Redis (key: refresh-token:{userId})
       └─► Set both as httpOnly cookies

Protected Request
  └─► authMiddleware verifies Access Token from cookie or Authorization header

Token Refresh (/refresh-token)
  └─► Validate Refresh Token from Redis → Issue new Access Token

Logout
  └─► Blacklist Refresh Token in Redis (key: blackList-token:{token})
       └─► Delete from refresh-token:{userId}
       └─► Clear cookies

Email Verification
  └─► On register: generate crypto token → store in Redis (10 min TTL)
       └─► Email link: /api/v1/auth/verify-email?id=...&verifyToken=...
       └─► On click: validate token → update isVerified=true → delete from Redis
```

---

## 🛡 Security Highlights

- Passwords hashed with **bcrypt**
- Tokens in **httpOnly** cookies (XSS-resistant)
- `sameSite: lax` + `secure: true` in production (CSRF-resistant)
- Refresh tokens stored and validated in Redis — no DB query on every request
- Logout invalidates the token via blacklisting
- Rate limiter blocks > 10 requests/min per IP
- Zod validation on all inputs before controller execution

---

## 📜 Available Scripts

### Server

| Script | Description |
|--------|-------------|
| `npm run dev` | Start dev server with hot reload (`tsx watch`) |
| `npm run build` | Compile TypeScript to `/dist` |
| `npm start` | Run compiled production build |
| `npm run swagger` | Regenerate `swagger-output.json` |
| `npm run format` | Format code with Prettier |

### Client

| Script | Description |
|--------|-------------|
| `npm run dev` | Start Vite dev server |
| `npm run build` | Type-check + build for production |
| `npm run preview` | Preview production build locally |
| `npm run lint` | Run ESLint |

---

## 🧩 Extending the Template

This template is intentionally minimal on business logic so it's easy to build on top of:

- **Add new models** → Update `schema.prisma`, run `npx prisma migrate dev`
- **Add new routes** → Create a controller + route file, register in `app.ts`
- **Add new pages** → Create a page in `client/src/pages/`, add a `<Route>` in `App.tsx`
- **Restrict by role** → Check `req.user.role` in any controller after `authMiddleware`
- **Change email provider** → Swap out `src/lib/nodemailer.ts`

---

## 📦 Docker Services

```yaml
# docker-compose.yml
postgres:   localhost:5431  (PostgreSQL 16)
redis:      localhost:6379  (Redis)
redisinsight: localhost:8001 (Redis UI)
```

Data is persisted in named Docker volumes (`postgres_auth_data`, `redis_auth_data`).

---

## 🤝 Contributing

Pull requests are welcome. For major changes, please open an issue first.

---

## 📄 License

[License](LICENSE)