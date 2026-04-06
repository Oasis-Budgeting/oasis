## 2026-04-06 - Add ARIA Labels to Icon-Only FABs
**Learning:** Icon-only floating action buttons (FABs) in this application sometimes use `title` attributes for tooltips but frequently omit explicit `aria-label`s, which makes them inaccessible to screen readers.
**Action:** Always verify that newly added or existing icon-only buttons, specifically FABs, include an `aria-label` attribute alongside the `title` to guarantee accessibility compliance.
