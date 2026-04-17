## 2024-05-20 - Icon Buttons Require Manual Labels
**Learning:** The shadcn/ui `<Button size="icon">` component does not enforce or automatically provide `aria-label` attributes. This can lead to accessibility issues where screen readers encounter unlabeled buttons.
**Action:** Always manually verify and add explicit `aria-label` attributes to all icon-only button instances (like the theme toggle and menu toggle) for accessibility compliance.
