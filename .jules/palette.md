## 2024-05-04 - Accessible Icon Buttons
**Learning:** Found that core navigation icon buttons (menu toggle, theme toggle, quick add FAB) in `App.jsx` were missing essential ARIA labels. This is a common pattern in React codebases that rely heavily on icon libraries.
**Action:** Always verify that buttons lacking textual content have `aria-label` attributes to ensure they are understandable by screen readers. For toggles, use `aria-expanded` to indicate state.
