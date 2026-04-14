## 2024-05-18 - Missing ARIA Labels in shadcn/ui Button Components
**Learning:** The shadcn/ui `<Button size="icon">` component does not automatically enforce ARIA labels, which makes icon-only buttons globally inaccessible to screen readers without explicit attributes.
**Action:** Always manually add and verify `aria-label` attributes on all icon-only instances of `<Button size="icon">`, alongside explicit state indicators like `aria-expanded` for toggles or `aria-keyshortcuts` for actions with keyboard shortcuts.
