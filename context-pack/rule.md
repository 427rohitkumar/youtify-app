# Development Rules & Standards

1. **Type Safety:** - No `any`. Strict TypeScript everywhere.
   - Use Interfaces/Types for every layer.
2. **Validation:** - Mandatory **Zod** validation for every API request and Environment variable.
3. **Database:** - Primary DB: `momentflow_db`.
   - All users must be authenticated via `authSource=admin`.
4. **Auth Roles:** - Strict RBAC (Role-Based Access Control). Roles: `root`, `admin`, `user`.
5. **UI Consistency:** - Theme: VS Code Dark Blue (#0D1117 Background, #007ACC Accents).
   - Component library: Tailwind CSS + React Icons.
6. **Auth Logic:**- "Always use Stateless JWT for authentication stored in HTTP-only cookies."

7. **Registration:** "Strictly NO public registration routes. Users must be created via internal seeding scripts or by a 'root' user only."

# Core Development Rules

- **Zero-Footprint Policy:** No code should be written outside of the `src/` directory.
- **Layered Strictness:** - Services must NEVER call the Database directly; they must use Repositories.
  - Controllers must ALWAYS validate requests using DTOs (Zod) before any action.
- **Naming Convention:** Use kebab-case for file names and camelCase for variables/functions.
  - Example: `auth.controller.ts`, `findUserByEmail()`.
- **Database:** All models must point to `momentflow_db` on the VPS.
- **AI Integration:** Use OpenAI-compatible SDK for NVIDIA NIM calls within the Service layer.
