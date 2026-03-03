## 2026-03-03 - Missing ARIA labels on icon buttons
**Learning:** The application's UI components use `size="icon"` for small buttons (e.g., Edit, Delete) but frequently omit the necessary `aria-label` attributes, creating an accessibility issue for screen readers.
**Action:** Always ensure `aria-label` is explicitly added when using `size="icon"` or whenever an action button lacks visible text content.
