## 2024-04-23 - Accessibility for Layout Icon Buttons
**Learning:** Stateful icon-only toggles (like sidebar menus) need `aria-expanded` and shortcut-mapped icon buttons (like FABs) need `aria-keyshortcuts` to meet basic accessibility standards, which were missing in the core application layout.
**Action:** Always ensure icon-only buttons have descriptive `aria-label`s, stateful toggles manage `aria-expanded`, and globally mapped shortcut buttons document their bindings via `aria-keyshortcuts`.
