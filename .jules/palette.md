## 2024-04-27 - Sidebar Menu Toggle Accessibility
**Learning:** Stateful icon-only toggles (like sidebar menus) must include `aria-expanded` reflecting their open/closed state.
**Action:** Always add `aria-expanded={isOpen}` to such toggles.
