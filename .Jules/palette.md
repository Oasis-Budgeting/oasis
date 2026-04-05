## 2024-05-24 - Accessibility for shadcn/ui Icon Buttons
**Learning:** The shadcn/ui implementation of `<Button size="icon">` does not enforce or automatically provide `aria-label` attributes, making it necessary to manually add them for accessibility compliance, especially for core navigation elements.
**Action:** Always manually verify and add `aria-label` and relevant state indicators (like `aria-expanded`) to icon-only buttons.
