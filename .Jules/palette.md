## 2024-03-10 - Missing ARIA Labels on Shadcn Icon Buttons
**Learning:** The project's implementation of the Shadcn `<Button size="icon">` component does not enforce or automatically provide `aria-label` attributes. This means developers must explicitly remember to add them to all icon-only instances for accessibility compliance, which is often missed.
**Action:** Always manually verify and add `aria-label` attributes to `<Button size="icon">` components to ensure icon-only buttons remain accessible to screen readers.
