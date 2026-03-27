## 2024-05-18 - Missing aria-labels on icon-only Buttons
**Learning:** In the frontend's shadcn/ui implementation, `<Button size="icon">` does not enforce or automatically provide `aria-label` attributes, leading to accessibility issues for screen readers.
**Action:** Always manually add and verify `aria-label`s on all icon-only instances of `<Button>` for accessibility compliance.
