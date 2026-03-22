## 2025-02-19 - ARIA labels missing on generic shadcn/ui icon buttons
**Learning:** When utilizing shadcn/ui generic `<Button size="icon">` components, the component relies entirely on the developer to manually supply an `aria-label` property since it does not automatically enforce or determine accessibility data.
**Action:** Audit interactive icon-only components across new pages/components and manually add `aria-label` properties appropriately.
