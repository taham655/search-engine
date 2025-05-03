# Application Security

This document outlines the key security measures implemented in this application.

## 1. Authentication

User authentication is handled using NextAuth.js, specifically utilizing the Credentials provider for email/password login.

**Implementation (`app/(auth)/auth.ts`):**

```typescript
import { compare } from "bcrypt-ts";
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";

import { getUser } from "@/lib/db/queries";
import { authConfig } from "./auth.config";

// ...

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
} = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      credentials: {},
      async authorize({ email, password }: any) {
        const users = await getUser(email);
        if (users.length === 0) return null;
        // biome-ignore lint: Forbidden non-null assertion.
        const passwordsMatch = await compare(password, users[0].password!);
        if (!passwordsMatch) return null;
        return users[0] as any;
      },
    }),
  ],
  // ... callbacks
});
```

Passwords are hashed using `bcrypt` before being stored and compared during login.

## 2. Database Encryption

Encryption of data at rest (database encryption) is managed at the infrastructure level by the database provider (e.g., PostgreSQL hosting service). The application connects to the database using credentials stored securely, but the encryption/decryption of the underlying database files is handled by the database system itself.

## 3. Environment Variables for Secrets

Sensitive information such as database connection strings, API keys, and secret keys are stored securely in environment variables (`.env` files) and are not hardcoded into the source code.

**Examples:**

- **Database Connection (`drizzle.config.ts`):**

  ```typescript
  import { defineConfig } from "drizzle-kit";
  import * as dotenv from "dotenv";

  dotenv.config({ path: ".env.local" });

  export default defineConfig({
    schema: "./lib/db/schema.ts",
    out: "./lib/db/migrations",
    dialect: "postgresql",
    dbCredentials: {
      url: process.env.POSTGRES_URL!,
    },
    verbose: true,
    strict: true,
  });
  ```

- **Email Service API Key (`lib/email.ts`):**

  ```typescript
  import { Resend } from "resend";

  const resend = new Resend(process.env.RESEND_API_KEY);
  // ...
  ```

These variables are loaded during runtime and are excluded from version control via `.gitignore`.

## 4. API Request Security

API routes (under `app/api/` or similar) are protected using NextAuth middleware. The middleware intercepts requests and ensures that only authenticated users can access protected API endpoints.

**Middleware Configuration (`middleware.ts`):**

```typescript
import NextAuth from "next-auth";
import { authConfig } from "@/app/(auth)/auth.config";

export default NextAuth(authConfig).auth;

export const config = {
  // Protect API routes along with other pages
  matcher: ["/", "/:id", "/api/:path*", "/login", "/register"],
};
```

Backend domains or direct database access details are not exposed to the client-side. Client-side code interacts with the application's own protected API routes.

## 5. Session Management

Session management is handled by NextAuth.js. The application uses a JSON Web Token (JWT) strategy by default.

**Session Callback (`app/(auth)/auth.ts`):**

The `session` callback is used to include essential user information (like the user ID) in the session object, which is accessible in server components and API routes.

```typescript
// ... inside NextAuth config
callbacks: {
  async jwt({ token, user }) {
    if (user) {
      token.id = user.id; // Add user ID to the JWT token
    }
    return token;
  },
  async session({
    session,
    token,
  }: {
    session: ExtendedSession; // Assuming ExtendedSession adds `id`
    token: any;
  }) {
    if (session.user) {
      session.user.id = token.id as string; // Add user ID from token to the session object
    }
    return session;
  },
},
// ...
```

## 6. Middleware Protection

Route access control is implemented using NextAuth middleware defined in `middleware.ts` and configured in `app/(auth)/auth.config.ts`.

**Authorization Logic (`app/(auth)/auth.config.ts`):**

The `authorized` callback contains the logic to determine if a user is allowed to access a specific route based on their authentication status.

```typescript
import type { NextAuthConfig } from "next-auth";

export const authConfig = {
  pages: {
    signIn: "/login",
    newUser: "/",
  },
  providers: [
    // ...
  ],
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isOnChat = nextUrl.pathname.startsWith("/"); // Assuming '/' is the main chat area
      const isOnRegister = nextUrl.pathname.startsWith("/register");
      const isOnLogin = nextUrl.pathname.startsWith("/login");

      // Redirect logged-in users away from login/register
      if (isLoggedIn && (isOnLogin || isOnRegister)) {
        return Response.redirect(new URL("/", nextUrl as unknown as URL));
      }

      // Allow access to login/register regardless of auth status
      if (isOnRegister || isOnLogin) {
        return true;
      }

      // Protect chat routes
      if (isOnChat) {
        if (isLoggedIn) return true; // Allow if logged in
        return false; // Redirect unauthenticated users to login page
      }

      // Redirect logged-in users trying to access other potentially non-chat public pages to chat
      if (isLoggedIn) {
        return Response.redirect(new URL("/", nextUrl as unknown as URL));
      }

      // Allow access to any other page by default (might need refinement)
      return true;
    },
  },
} satisfies NextAuthConfig;
```

This configuration ensures that:

- Unauthenticated users trying to access protected pages (like the chat) are redirected to the login page.
- Authenticated users trying to access login or register pages are redirected to the main application page.
