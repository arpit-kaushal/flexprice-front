# Storybook Showcase (`storybook-showcase`)

This folder holds **UI pieces for Storybook**. They use the same design tokens as the rest of the app. Names start with **`Sb`** so it is obvious they belong to this showcase.

---

## Approach

1. **Small basics first** — Buttons, inputs, labels, badges stay simple so they stay easy to reuse in stories.

2. **Billing-style examples** — Some pieces match common product ideas: usage meters, invoice status, price tiers, tables, filters. Story examples look like mini flows, not empty grey boxes.

3. **Stories that help review** — Where it matters, each piece has a default story, extra states (loading, error, empty, disabled), **Controls** for props, and sometimes a **`play`** test that checks something **visible on the page** (text, counts), not only a mock callback.

4. **Tiny helpers here** — Small files like `lib/cn.ts`, ref merge, and invoice label text keep this tree easy to open and reason about without pulling the whole app.

5. **Tests** — Vitest covers helpers (money formatting, price labels, invoice status text, fingerprints) plus a few **render checks** on showcase components so small edits do not break labels or roles by accident.

---

## Importing

Public exports live in `index.ts`:

```ts
import { SbButton, SbDataTable, getInvoiceStatusDisplayLabel } from '@/components/storybook-showcase';
```

Add new public components to `index.ts` when they should be part of this API.

---

## Components

### Small building blocks

| Name                                | File                                   | Purpose                                                             |
| ----------------------------------- | -------------------------------------- | ------------------------------------------------------------------- |
| **SbButton**                        | `sb-button.tsx`                        | Actions: variants, sizes, loading, optional `asChild` via `SbSlot`. |
| **SbInput**                         | `sb-input.tsx`                         | Text field with label, error line, optional prefix.                 |
| **SbLabel**                         | `sb-label.tsx`                         | Label next to inputs.                                               |
| **SbBadge**                         | `sb-badge.tsx`                         | Read-only status pill.                                              |
| **SbChip**                          | `sb-chip.tsx`                          | Clickable pill (filters, tags).                                     |
| **SbSpinner** / **SbSpinIndicator** | `sb-spinner.tsx`, `spin-indicator.tsx` | Spinners.                                                           |
| **SbSkeleton**                      | `sb-skeleton.tsx`                      | Loading placeholder shape.                                          |
| **SbDivider**                       | `sb-divider.tsx`                       | Horizontal line.                                                    |
| **SbProgress**                      | `sb-progress.tsx`                      | Progress bar (Radix).                                               |
| **SbTooltip** (+ parts)             | `sb-tooltip.tsx`                       | Tooltip wrapper for demos.                                          |
| **SbIcons**                         | `sb-icons.tsx`                         | Simple stroke icons.                                                |

### Larger patterns

| Name                          | File                          | Purpose                                    |
| ----------------------------- | ----------------------------- | ------------------------------------------ |
| **SbCard** / **SbCardHeader** | `sb-card.tsx`                 | Card panel and header row.                 |
| **SbDateRangePicker**         | `sb-date-range-picker.tsx`    | Two date fields for ranges.                |
| **SbSearchBar**               | `sb-search-bar.tsx`           | Search-style field.                        |
| **SbSearchableSelect**        | `sb-searchable-select.tsx`    | Searchable dropdown.                       |
| **SbSortDropdown**            | `sb-sort-dropdown.tsx`        | Multi-sort UI.                             |
| **SbMetricCard**              | `sb-metric-card.tsx`          | Metric with optional trend icon.           |
| **SbUsageMeterProgress**      | `sb-usage-meter-progress.tsx` | Used vs limit with bar.                    |
| **SbInvoiceStatusBadge**      | `sb-invoice-status-badge.tsx` | Invoice status chip.                       |
| **SbPricingTierTable**        | `sb-pricing-tier-table.tsx`   | Tier table (read-only).                    |
| **SbEmptyState**              | `sb-empty-state.tsx`          | Empty panel with optional button.          |
| **SbLoadingState**            | `sb-loading-state.tsx`        | Big centered loader.                       |
| **SbDataTable**               | `sb-data-table.tsx`           | Table layout, optional row virtualisation. |

### Navigation

| Name                        | File                             | Purpose                                                      |
| --------------------------- | -------------------------------- | ------------------------------------------------------------ |
| **SbCollapsibleSidebarNav** | `sb-collapsible-sidebar-nav.tsx` | Sidebar with collapsible groups (needs router in Storybook). |

### Stories only (not all in barrel)

| Story                                    | What it shows                                  |
| ---------------------------------------- | ---------------------------------------------- |
| `sb-sidebar-nav.stories.tsx`             | Sidebar wiring.                                |
| `sb-query-cache.stories.tsx`             | Query cache presets / `createQueryConfig`.     |
| `sb-data-table-with-filters.stories.tsx` | Filters, `useFilterStore`, fingerprint, table. |

---

## Helpers (non-UI)

| File                                  | Role                                                         |
| ------------------------------------- | ------------------------------------------------------------ |
| `preview-decorator.tsx`               | Story wrapper: fonts, theme, layout.                         |
| `story-interaction-helpers.tsx`       | e.g. **StoryFeedbackSlot** for click → status text in tests. |
| `lib/cn.ts`                           | Class name merge.                                            |
| `lib/merge-refs.ts`                   | Merge refs for slot child.                                   |
| `lib/invoice-status-display-label.ts` | **`getInvoiceStatusDisplayLabel`** — code → label string.    |
| `sb-slot.tsx`                         | Slot-style single child (for `asChild` on button).           |

---

## Commands

- **Storybook:** `npm run storybook`
- **Tests once:** `npx vitest run`

Showcase tests sit next to files here (`*.test.tsx`). Shared logic may be tested under `src/constants`, `src/utils/common`, or `src/lib`.

---

## Quick start

Open **`index.ts`** for the export list, then run **Storybook** and use **Controls** and **Interactions** on a story before reading every source file.
