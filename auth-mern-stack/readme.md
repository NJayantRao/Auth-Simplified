# 🔐 Auth-Simplified

A production-ready fullstack authentication boilerplate — **MERN Stack (MongoDB + Express + React + Node.js) + Redis**. Clone it, fill in your `.env`, and start shipping features instead of auth.

> **Repo:** https://github.com/NJayantRao/Auth-Simplified

---

## ⚡ Quick Start

```bash
npx degit NJayantRao/Auth-Simplified/auth-mern-stack my-app
cd my-app
```

No git history. Just the code.

---

## ✨ Features

### Authentication

* **JWT Access + Refresh Tokens** — 15m access / 7d refresh with silent rotation
* **httpOnly Cookie Security** — Tokens in secure httpOnly cookies, never localStorage
* **Single-Device Sessions** — Session ID in JWT validated against Redis on every request. New login kills all previous sessions automatically
* **Token Blacklisting** — Refresh tokens blacklisted in Redis on logout
* **Axios Interceptor** — Auto-refreshes expired access tokens and replays the original request transparently

### OAuth

* **Google OAuth** — PKCE flow via Arctic library
* **GitHub OAuth** — With private email fallback (`/user/emails`)
* **OAuthProvider Collection** — Supports linking multiple providers to one account
* **State in Redis** — OAuth state stored in Redis (5 min TTL), not cookies

### Password Flows

* **Forgot Password** — 6-digit OTP sent via email, stored in Redis (10 min TTL)
* **Reset Password** — Verify OTP + set new password
* **Change Password** — Authenticated route, validates old password, blocks OAuth-only accounts
* **Email Verification** — Time-limited token link on registration + resend-on-demand

### Access Control

* **Role-Based Access** — `User` and `Admin` roles
* **RBAC Middleware** — `authorizeAdmin` middleware for admin-only routes

### Infrastructure

* **Zod Env Validation** — Startup crash with clear error messages if any required env var is missing
* **Redis Rate Limiter** — 10 req/min per IP, Redis-backed
* **Profile Caching** — User profile cached in Redis (1 min TTL)
* **Mongoose Transactions** — User + OAuthProvider created atomically
* **Swagger API Docs** — Auto-generated at `/api-docs`
* **Docker Compose** — MongoDB + Redis Stack with one command

### Frontend

* **React Auth Context** — Global auth state with `isInitialized` flag
* **Protected Routes** — No flash-to-sign-in on page refresh or post-OAuth redirect
* **Dark / Light Theme** — Animated theme toggler, persisted
* **Full Auth Pages** — Sign In, Sign Up, Dashboard, Forgot Password, Reset Password, Not Found

---

## 🛠 Tech Stack

### Backend

| Layer         | Technology                          |
| ------------- | ----------------------------------- |
| Runtime       | Node.js + TypeScript (`tsx`)        |
| Framework     | Express 5                           |
| ODM           | Mongoose (MongoDB)                  |
| Session Store | Redis (ioredis)                     |
| Auth          | JWT (`jsonwebtoken`) + bcrypt       |
| OAuth         | Arctic (Google PKCE + GitHub)       |
| Email         | Nodemailer + Gmail OAuth2 + Mailgen |
| Validation    | Zod (requests + environment)        |
| API Docs      | Swagger UI Express                  |

### Frontend

| Layer         | Technology                 |
| ------------- | -------------------------- |
| Framework     | React 19 + TypeScript      |
| Build Tool    | Vite                       |
| Routing       | React Router 7             |
| Styling       | Tailwind CSS 4 + shadcn/ui |
| HTTP Client   | Axios + interceptor        |
| Notifications | React Hot Toast            |

### Infrastructure

| Service          | Tool           |
| ---------------- | -------------- |
| Database         | MongoDB        |
| Cache / Sessions | Redis Stack    |
| Orchestration    | Docker Compose |

---

## 📁 Project Structure

```
auth-mern-stack/
├── CHANGES.md
├── docker-compose.yml
├── readme.md
│
├── client/                         # React + Vite frontend
│   └── src/
│       ├── App.tsx                 # Routes + initialization
│       ├── components/
│       │   ├── Protected.tsx       # Route guard (uses isInitialized)
│       │   └── ui/                 # shadcn/ui components
│       ├── context/
│       │   ├── AuthContext.tsx     # Global auth state
│       │   └── ThemeContext.tsx    # Dark/light theme
│       ├── hooks/
│       │   └── useAuth.ts          # register, login, logout, getUser, verifyEmail
│       ├── pages/
│       │   ├── Home.tsx
│       │   ├── SignIn.tsx
│       │   ├── SignUp.tsx
│       │   ├── Dashboard.tsx
│       │   ├── ForgotPassword.tsx
│       │   ├── ResetPassword.tsx
│       │   └── NotFound.tsx
│       └── services/
│           └── auth.api.ts         # Axios instance + refresh interceptor
│
└── server/                         # Express + TypeScript backend
    └── src/
        ├── app.ts                  # Express app, middleware, routes
        ├── server.ts               # Entry point
        ├── controllers/
        │   ├── auth.controller.ts
        │   ├── oauth.controller.ts
        │   └── user.controller.ts
        ├── middlewares/
        │   ├── auth-middleware.ts
        │   ├── rate-limit-middleware.ts
        │   └── zod-validation.ts
        ├── lib/
        │   ├── env.ts
        │   ├── mongoose.ts
        │   ├── redis.ts
        │   └── nodemailer.ts
        ├── models/
        │   ├── user.model.ts
        │   └── oauth-provider.model.ts
        ├── utils/
        │   ├── google.ts
        │   ├── github.ts
        │   ├── constants.ts
        │   ├── api-error.ts
        │   ├── api-response.ts
        │   └── async-handler.ts
        ├── validators/
        │   ├── auth-schema.ts
        │   └── env-schema.ts
        └── emails/
```

---

## 🗄 Database Schema (Mongoose)

```ts
// user.model.ts
import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  role: { type: String, enum: ["User", "Admin"], default: "User" },
  isVerified: { type: Boolean, default: false },
}, { timestamps: true });

export const User = mongoose.model("User", userSchema);
```

```ts
// oauth-provider.model.ts
const oauthProviderSchema = new mongoose.Schema({
  providerName: { type: String, enum: ["LOCAL", "GOOGLE", "GITHUB"] },
  providerUserId: String,
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
}, { timestamps: true });

export const OAuthProvider = mongoose.model("OAuthProvider", oauthProviderSchema);
```

---

## 🚀 Setup

### 1. Clone

```bash
npx degit NJayantRao/Auth-Simplified/auth-mern-stack my-app
cd my-app
```

### 2. Start infrastructure

```bash
docker compose up -d
```

Starts MongoDB on port `27017` and Redis Stack on port `6379`.

### 3. Server setup

```bash
cd server
npm install
cp .env.sample .env
npm run dev
```

Server → `http://localhost:5000`
Swagger → `http://localhost:5000/api-docs`

### 4. Client setup

```bash
cd ../client
npm install
npm run dev
```

Client → `http://localhost:5173`

---

## 🔑 Environment Variables

### `/server/.env`

```env
MONGO_URI=mongodb://localhost:27017/auth-db
REDIS_URL=redis://localhost:6379
JWT_ACCESS_SECRET=your_secret
JWT_REFRESH_SECRET=your_secret
```

### `/client/.env`

```env
VITE_BACKEND_URL=http://localhost:5000/api/v1
```

---

## 📡 API Reference

### Auth — `/api/v1/auth`

| Method | Endpoint           | Access  | Description                                     |
| ------ | ------------------ | ------- | ----------------------------------------------- |
| POST   | `/register`        | Public  | Register, send verification email, issue tokens |
| POST   | `/login`           | Public  | Login, issue tokens                             |
| POST   | `/logout`          | 🔒 Auth | Blacklist refresh token, delete session         |
| GET    | `/verify-email`    | Public  | Verify email from link                          |
| POST   | `/forgot-password` | Public  | Send OTP to email                               |
| POST   | `/reset-password`  | Public  | Verify OTP + set new password                   |
| POST   | `/refresh-token`   | Public  | Issue new access token from refresh token       |
| GET    | `/google`          | Public  | Redirect to Google OAuth                        |
| GET    | `/google/callback` | Public  | Google OAuth callback                           |
| GET    | `/github`          | Public  | Redirect to GitHub OAuth                        |
| GET    | `/github/callback` | Public  | GitHub OAuth callback                           |

### Users — `/api/v1/users`

| Method | Endpoint           | Access  | Description                    |
| ------ | ------------------ | ------- | ------------------------------ |
| GET    | `/profile`         | 🔒 Auth | Get authenticated user profile |
| POST   | `/verify-email`    | 🔒 Auth | Resend email verification link |
| PATCH  | `/change-password` | 🔒 Auth | Change password                |

---

## 🔒 Auth Flow

```
Register / Login
  └─► Generate sessionId (crypto.randomBytes)
  └─► Issue Access Token (15m) + Refresh Token (7d)
  └─► Store refresh-token:{userId} in Redis (7d TTL)
  └─► Store active-session:{userId} = sessionId in Redis (7d TTL)
  └─► Set both as httpOnly cookies

Every Protected Request
  └─► authMiddleware verifies JWT signature
  └─► Checks active-session:{userId} === JWT.sessionId
  └─► Mismatch → 401 (logged in elsewhere)

Token Refresh
  └─► Check refresh token not blacklisted
  └─► Verify JWT signature
  └─► Validate against Redis stored token
  └─► Validate session ID match
  └─► Issue new access token

Logout
  └─► Blacklist refresh token in Redis
  └─► Delete refresh-token:{userId}
  └─► Delete active-session:{userId}
  └─► Clear cookies

Google / GitHub OAuth
  └─► Generate state + codeVerifier → store in Redis (5 min)
  └─► Redirect to provider
  └─► Callback: validate state, exchange code
  └─► Find or create User + OAuthProvider row ($transaction)
  └─► Issue JWT pair → same flow as login

Forgot Password
  └─► Generate 6-digit OTP → store verify-otp:{email} (10 min)
  └─► Send OTP email (ambiguous response regardless of user existence)
  └─► Reset: verify OTP → hash new password → delete OTP key
```

---

## 🛡 Security Design

| Concern             | Approach                                                       |
|---------------------|----------------------------------------------------------------|
| Password storage    | bcrypt with salt round 10                                      |
| Token transport     | httpOnly cookies — inaccessible to JavaScript                  |
| XSS protection      | httpOnly cookies + no tokens in localStorage                   |
| CSRF protection     | `sameSite: lax` (dev) / `sameSite: none + secure` (prod)      |
| Session hijacking   | Session ID in JWT validated against Redis on every request     |
| Concurrent sessions | New login overwrites session ID — old sessions auto-invalidate |
| Token replay        | Refresh tokens blacklisted on logout                           |
| Brute force         | Redis-backed rate limiter, 10 req/min per IP                   |
| User enumeration    | Forgot password returns same message for existing/non-existing |
| Input validation    | Zod schema validation on all auth endpoints                    |
| Env safety          | Zod validates all env vars at startup — crashes early          |
| OAuth CSRF          | State parameter validated against Redis on every callback      |

---

## 📜 Scripts

### Server

| Script            | Description                           |
|-------------------|---------------------------------------|
| `npm run dev`     | Hot-reload dev server (`tsx watch`)   |
| `npm run build`   | Compile TypeScript to `/dist`         |
| `npm start`       | Run compiled production build         |
| `npm run swagger` | Regenerate `swagger-output.json`      |
| `npm run format`  | Format with Prettier                  |

### Client

| Script            | Description                        |
|-------------------|------------------------------------|
| `npm run dev`     | Vite dev server                    |
| `npm run build`   | Type-check + production build      |
| `npm run preview` | Preview production build           |
| `npm run lint`    | Run ESLint                         |

---

## 🧩 Extending

- **New model** → Add to `schema.prisma`, run `npx prisma migrate dev`
- **New protected route** → `router.get("/route", authMiddleware, controller)`
- **Admin-only route** → `router.get("/route", authMiddleware, authorizeAdmin, controller)`
- **New page** → Create in `client/src/pages/`, add `<Route>` in `App.tsx`
- **New email** → Add template in `server/src/emails/`, add sender in `send-mails.ts`

---

## 🤝 Contributing

Contributions are welcome and appreciated!

---

## 📄 License

MIT
