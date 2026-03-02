## 2025-03-02 - Icon-Only Button Accessibility Pattern
**Learning:** Icon-only buttons without `aria-label` or `title` attributes are completely inaccessible to screen readers and confusing to sighted users. When adding these labels, using context-specific values (like "Delete rule for [value]" instead of just "Delete") significantly improves the experience.
**Action:** Always include both `title` (for sighted users hovering) and `aria-label` (for screen readers) on buttons that only contain icons. Make the label descriptive based on the item being interacted with.
