## 2024-03-01 - Add ARIA Labels to shadcn/ui Icon-Only Buttons
**Learning:** The shadcn/ui `<Button size="icon">` component in this project does not automatically enforce or supply `aria-label`s. Without them, screen readers simply read "button" with no context for these interactive icon-only elements.
**Action:** Always manually verify and attach `aria-label` (and attributes like `aria-expanded` for toggles) to all `<Button size="icon">` usages to guarantee accessibility.
