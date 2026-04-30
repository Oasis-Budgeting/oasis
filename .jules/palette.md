## 2024-05-18 - Keyboard Shortcuts Accessibility Pattern
**Learning:** In the Oasis layout (`App.jsx`), icon-only buttons (like the Quick Add FAB) are mapped to global keyboard shortcuts using `useKeyboardShortcuts`. Without explicitly declaring these shortcuts on the buttons, screen reader users are unaware of the alternative navigation method.
**Action:** Always add `aria-keyshortcuts` to interactive elements when they trigger an action that is also mapped to a global keyboard shortcut hook in this app.
