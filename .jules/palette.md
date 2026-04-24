## 2026-04-24 - Adding accessibility attributes to stateful toggles and keyboard-bound FABs
**Learning:** Icon-only stateful toggles (like sidebar menus) need `aria-expanded` to communicate their current state to screen readers. Floating Action Buttons (FABs) bound to keyboard shortcuts need `aria-keyshortcuts` to communicate the available shortcut to assistive technologies.
**Action:** Always include `aria-expanded` on icon-only interactive stateful elements. Use `aria-keyshortcuts` when assigning global shortcuts to UI elements.
