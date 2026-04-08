## 2024-04-08 - Icon-Only Buttons Accessibility
**Learning:** shadcn/ui `<Button size="icon">` and custom FAB buttons do not automatically enforce or provide `aria-label` attributes or relevant state indicators (e.g. `aria-expanded` for toggles, `aria-keyshortcuts` for hotkeys), which can lead to poorly accessible micro-interactions.
**Action:** Always manually add explicit `aria-label` and relevant state indicators to all icon-only interactive elements to ensure full keyboard and screen reader accessibility compliance.
