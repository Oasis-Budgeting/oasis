
## 2024-05-15 - Missing ARIA labels on `<Button size="icon">`
**Learning:** The frontend's shadcn/ui implementation of `<Button size="icon">` does not enforce or automatically provide `aria-label` attributes for accessibility. Without this, icon-only buttons remain inaccessible to screen readers.
**Action:** Always manually check and add explicit `aria-label` attributes (and state indicators like `aria-expanded` when applicable) to all icon-only button components in this application to ensure full accessibility compliance.
