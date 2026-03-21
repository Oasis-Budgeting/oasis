
## $(date +%Y-%m-%d) - Missing ARIA Labels on Icon-only shadcn/ui Buttons
**Learning:** The `<Button size="icon">` component from shadcn/ui does not enforce or automatically provide `aria-label` attributes, making it very easy for developers to accidentally create inaccessible icon buttons (e.g. for closing modals, toggling menus). This pattern was found repeatedly across `Transactions.jsx`, `Budget.jsx`, and `App.jsx`.
**Action:** Always manually verify that any `<Button size="icon">` or generic `variant="ghost"` icon-only button includes an explicit `aria-label` to ensure screen reader compatibility.
