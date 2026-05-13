# Data Flow: Authentication

1. **Client:** User inputs credentials -> `LoginForm.tsx` (Client).
2. **API:** Request reaches `app/api/auth/login/route.ts`.
3. **Controller:** Route calls `AuthController`. Controller validates input with Zod.
4. **Service:** Controller calls `AuthService`. Service hashes/checks password.
5. **Repository:** Service calls `AuthRepository` to fetch user from MongoDB.
6. **Response:** Controller returns JWT or Session + Role info to Client.
7. **Login Success:** Service generates JWT -> Controller sets HTTP-Only Cookie.
8. **Middleware:** Middleware reads cookie -> Decodes JWT using jose -> Injects user role into request headers.
