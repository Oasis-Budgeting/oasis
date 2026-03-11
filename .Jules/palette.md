## 2024-05-18 - Missing ARIA label on Sidebar Toggle and Theme Toggle Button
**Learning:** Found multiple `size="icon"` `<Button>` components in `ui/src/App.jsx` (such as the sidebar toggle and theme toggler) that lack `aria-label` attributes. Without them, screen readers will announce these simply as "button" or announce their SVG content unhelpfully, reducing accessibility.
**Action:** Add `aria-label` (and `aria-expanded` for the sidebar toggle) to these icon-only buttons to make the UI accessible to assistive technologies.
