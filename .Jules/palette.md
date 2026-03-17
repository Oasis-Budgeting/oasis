
## 2026-03-17 - Accessibility of shadcn/ui `<Button size="icon">` in Oasis
**Learning:** In the shadcn/ui implementation used in this project, standard icon-only buttons (like `<Button size="icon">`) don't automatically enforce or provide `aria-label`s. Interactive elements (like Floating Action Buttons and toggle buttons) need explicit `aria-label`s (and occasionally `aria-expanded` or `aria-keyshortcuts`) for full screen reader accessibility.
**Action:** Always verify and manually add `aria-label` and relevant state indicators (like `aria-expanded` for menus) to all icon-only interactive elements in the `ui` codebase.
