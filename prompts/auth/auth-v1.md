
## Technical Prompt for Auth Module Architecture

**Role:** Senior Full-Stack Architect
**Task:** Build a secure Authentication Module for a Next.js application (Antigravity).

### 1. Core Architecture Requirements

* **Module-Based Pattern:** Separate logic into `services`, `controllers` (or server actions), and `middleware`.
* **Authentication Flow:** Use **JWT (JSON Web Token)**. Access tokens should be stored in **HTTP-Only Cookies** for security against XSS.
* **Route Strategy:** * **Home Route (`/`):** Yahan direct login form render hona chahiye agar user authenticated nahi hai.
* **No Public Signup:** Registration UI se nahi hoga.
* **Seeder System:** Ek database seeder script build karo jo initial user create kare.

* **Password Management:** Implementation of "Forgot Password" using a secure token-based email flow.
used email for.. otp verfication for forgot password

### 2. Database Schema & Initial Seeding

* **User Model:** `id`, `email`, `password_hash`, `reset_token`, `reset_token_expiry`.
* **Default Credentials:** * **Email:** `42rohitkumar@gmail.com`
* **Password:** `427rohit@` (Hash this before saving).

### 3. API & Logic Implementation

* **Login Handler:** Verify email/password, generate a JWT with a 24h expiry, and set it as a `Set-Cookie` header with `httpOnly: true`, `secure: true`, and `sameSite: 'strict'`.
* **Middleware:** Ek global `middleware.ts` file jo `/` aur protected routes ko check kare. Agar valid cookie nahi hai, toh user ko login view par hi rakhe.
* **Forgot Password:** Generate a unique UUID token, store it in the DB with an expiry (1 hour), and simulate/send a reset link.

### 4. UI/UX Specifications

* **Home Page (`/`):** Minimalist login form. No "Create Account" link.
* **Styling:** Youtube Dark theme with red
* **Error Handling:** Proper toast notifications for "Invalid Credentials" or "Rate Limited".

---

### Implementation Tips for You

1. **Seeder Script:** Tum ek simple `scripts/seed.ts` file bana sakte ho jo `bcrypt` use karke password hash kare aur Prisma ya MongoDB (jo tum use kar rahe ho) mein data insert kare.
2. **JWT Secret:** `.env` file mein ek strong `JWT_SECRET` zaroor rakhna.
3. **HTTP-Only Cookie:** Iska fayda ye hai ki client-side JavaScript (`document.cookie`) ise access nahi kar payegi, jo security ke liye top-notch hai.

**Ek logic point dhyan rakhna:** Kyunki tumne kaha ki `/` par hi login ho, toh `middleware.ts` mein logic ye rakho:

* If `url === '/'` AND `token_is_valid` -> Redirect to `/dashboard`.
* If `url === '/dashboard'` AND `no_token` -> Redirect to `/`.

Kya main iska actual **folder structure** aur **middleware code** generate karoon?
