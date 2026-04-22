## 2024-05-17 - Missing Accessibility Attributes on Global Icon Buttons
**Learning:** Found multiple global action buttons (theme toggle, sidebar toggle, floating action button) lacking proper ARIA labels or `aria-expanded` states, preventing screen reader users from understanding their purpose or current state.
**Action:** Always verify icon-only buttons have descriptive `aria-label`s, and ensure stateful toggles (like sidebar menu) use `aria-expanded` to communicate their state to assistive technologies. For keyboard shortcuts, `aria-keyshortcuts` should be used to hint at the shortcut.
