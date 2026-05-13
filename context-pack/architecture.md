# Youtify Architecture

**Pattern:** Module-Based Layered Architecture (Inspired by NestJS)

### Backend Layers

1. **API Routes (Next.js App Router):** Entry points jo Controller ko call karte hain.
2. **Controllers:** Request/Response handling aur input validation orchestration.
3. **Services:** Core business logic (Password hashing, logic, AI integration).
4. **Repositories:** Pure Database abstraction layer (Direct MongoDB/Mongoose queries).
5. **DTOs & Validation:** Zod schemas for request body validation.

### Frontend Layers

1. **Server Components:** High-level pages for SEO and initial data fetching.
2. **Client Components:** Interactive elements (Sidebar, Auth Forms).
3. **State Management:** React Context/Zustand (if needed).

# Youtify: Standard Modular Architecture

Every module in the `src/modules/` directory must follow this 6-layer strict separation of concerns:

1. **[name].model.ts**: Mongoose Schema & Model definition. Handles DB-level constraints, indexes, and timestamps.
2. **[name].dto.ts**: Data Transfer Objects using **Zod**. Handles all incoming request validation before it reaches the service.
3. **[name].types.ts**: TypeScript Interfaces and Enums. Ensures full type-safety across all layers.
4. **[name].repository.ts**: Data Access Layer. Contains pure Database queries (CRUD). No business logic allowed here.
5. **[name].service.ts**: Business Logic Layer. Handles AI processing (NVIDIA NIM), complex calculations, and cross-module coordination.
6. **[name].controller.ts**: Entry/Exit Point. Extracts request data, triggers validation, calls service, and returns standardized JSON responses.
