
# Tech Stack - Antigravity (Milk Billing System)

## 🏗️ Core Frameworks

* **Next.js (v14/15+):** React framework for server-side rendering (SSR) and App Router architecture.
* **TypeScript:** Type-safe development for catching errors during build time.
* **React:** For building modular UI components.

## 🔐 Authentication & Security

* **JWT (JSON Web Tokens):** For stateless session management.
* **HTTP-Only Cookies:** Storage mechanism for JWT to prevent XSS attacks.
* **Bcrypt.js:** Password hashing for secure user storage (Seeder based).
* **Next.js Middleware:** Server-side route protection and authentication checks.

## 🎨 UI & Styling

* **Tailwind CSS:** Utility-first CSS for rapid UI development.
* **React-Icons:** For lightweight and scalable icons (Lucide, Fa, etc.).
* **Theme Identity:** VS Code Dark Blue concept.
* **Background:** `#0D1117`
* **Accents/Primary:** red

## 📦 State & Data Management

* **Server Actions:** To handle form submissions (Login, Rate Updates) without manual API route boilerplate.
* **Zod:** For schema validation (Login credentials & Milk rate inputs).
* **Database (Seeder):** Manual seeder script to initialize the first user.

## 🛠️ Key Features (Planned)

* **Modular Architecture:** Separate folders for `auth`, `billing`, and `ui` logic.
* **Budget Calculator:** Logic to determine milk quantity based on a fixed budget (e.g., ₹3000).
* **Dual Price Tracking:** Handling both CP (Cost Price) and SP (Selling Price).

---
