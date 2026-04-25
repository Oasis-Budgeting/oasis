## 2024-04-25 - App Shell Icon Button Accessibility
**Learning:** Icon-only buttons in the main app shell, particularly those toggling state (like sidebar menus) and those with keyboard shortcuts (like FABs), frequently lack explicit accessibility cues, limiting their usability for screen-reader users and power users.
**Action:** When auditing app shell components, always ensure stateful icon toggles include `aria-expanded` and buttons linked to keyboard shortcuts expose them using `aria-keyshortcuts`.
