# react-data-table

A polished, responsive customer/order workspace built with Vite, React, strict TypeScript, Tailwind CSS, TanStack Table, and Lucide icons. All data and interactions run locally, with no backend or API calls.

## Setup

Use Node.js 20.19+ or 22.12+ and npm.

```sh
npm install
npm run dev
```

Open the local URL printed by Vite.

```sh
npm run typecheck # strict TypeScript verification
npm run build     # TypeScript verification and production bundle
npm run preview   # serve the production build locally
```

## Features

- 120 deterministic order records; fixed dates and values do not change between reloads.
- Summary cards show the complete dataset; the table shows total and filtered counts.
- Sortable typed columns, case-insensitive global search across every record field (including hidden fields), and an exact status filter.
- Optional column visibility; the order identifier and selection checkbox stay available.
- Client-side pagination with 10, 20, or 50 rows. Filtering and sorting reset to the first page.
- Individual selection and page-level select-all with indeterminate state. Selection persists across pages and filters; the selected count includes hidden selections. Clear selection resets all selections.
- CSV export includes **all filtered rows across pages**, in the current sort order, with only visible data columns. It ignores row selection. Every cell is quoted, quotes are doubled, lines use CRLF, and a UTF-8 BOM improves spreadsheet compatibility. Dates and amounts export as raw ISO/numeric values. Empty results disable export.
- Empty state with filter reset, accessible control labels, keyboard focus indicators, and horizontal scrolling with a sticky identifier column on narrow screens.
- Local-only state resets on reload; no fake requests, persistence, tests, or unrelated views.

## Screenshot

<img width="1898" height="905" alt="image" src="https://github.com/user-attachments/assets/bce75f1b-4f2f-46ab-bfa8-48b38d44807b" />


## Structure

- `src/App.tsx`: typed column definitions and the workspace interactions.
- `src/data.ts`: stable mock data and currency formatting.
- `src/styles.css`: Tailwind integration and responsive visual styling.

The data and column definitions are stable module-level values; table state is controlled with React state. TanStack handles the filtering → sorting → pagination pipeline. No unnecessary memoization or server layer is used.
