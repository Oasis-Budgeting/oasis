## 2026-03-24 - Missing ARIA Labels on Icon-Only Buttons
**Learning:** Found that shadcn/ui `<Button size="icon">` instances frequently omit `aria-label` attributes, making them inaccessible to screen readers since they rely entirely on icons (e.g., Lucide React icons) for meaning.
**Action:** When adding or reviewing icon-only buttons in the UI, ensure an explicit `aria-label` attribute is provided to describe the button's action.
