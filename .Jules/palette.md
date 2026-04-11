## 2025-02-12 - Icon-only buttons lacking ARIA labels
**Learning:** In the frontend's shadcn/ui implementation, the `<Button size="icon">` component does not enforce or automatically provide `aria-label` attributes, leading to accessibility issues for screen reader users where buttons lack descriptive labels.
**Action:** When adding or modifying icon-only buttons in this app, ensure an explicit `aria-label` attribute is provided for each button to describe its action.
