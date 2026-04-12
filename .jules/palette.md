## 2024-04-12 - Missing ARIA Labels in Icon-only Shadcn UI Buttons
**Learning:** The project's Shadcn UI implementation of `<Button size="icon">` and similar raw buttons with only icons (like the floating action button) do not enforce or automatically provide `aria-label` attributes.
**Action:** When using or reviewing `<Button size="icon">` or floating action buttons, ensure an explicit `aria-label` is always provided, along with state indicators like `aria-expanded` or `aria-keyshortcuts` where applicable.
