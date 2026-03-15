## 2024-03-14 - shadcn/ui Icon Button Accessibility
**Learning:** In the frontend's shadcn/ui implementation, the `<Button size="icon">` component does not enforce or automatically provide `aria-label` attributes. Developers must manually add and verify `aria-label`s on all icon-only instances for accessibility compliance.
**Action:** Audit all usages of `<Button size="icon">` across pages and components to ensure they have explicit `aria-label`s.
