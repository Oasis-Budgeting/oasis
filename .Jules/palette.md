## 2024-05-14 - Shadcn Button Component Lacks ARIA Enforcement
**Learning:** The `<Button size="icon">` component in this project's shadcn/ui implementation does not enforce or automatically provide `aria-label` attributes.
**Action:** Always manually add and verify `aria-label`s on all icon-only button instances across the codebase to ensure screen reader accessibility.
