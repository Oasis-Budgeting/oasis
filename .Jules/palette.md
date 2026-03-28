## 2026-03-28 - Missing ARIA Labels on shadcn/ui Icon Buttons
**Learning:** In the shadcn/ui implementation used in this frontend, the `<Button size="icon">` component does not enforce or automatically provide `aria-label` attributes. This leaves icon-only interactive elements inaccessible to screen readers out-of-the-box.
**Action:** Always manually add and verify `aria-label` attributes on all instances of `<Button size="icon">` or any other icon-only interactive elements to ensure accessibility compliance.
