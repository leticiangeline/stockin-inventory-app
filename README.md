# StockIn — Store Inventory Management

A small store inventory app built with React and Vite. It has a home dashboard, a
searchable inventory table, a product catalog, stock status alerts (in stock / low
stock / out of stock), add-product and add-stock modals, and CSV export. Styling is
done with Tailwind CSS (custom `brand` palette in `tailwind.config.js`).

## Prerequisites

- [Node.js](https://nodejs.org) `^20.19.0` or `>=22.12.0` (required by Vite 8)
- npm (bundled with Node)

## Setup

```bash
git clone https://github.com/leticiangeline/stockin-inventory-app.git
cd stockin-inventory-app
npm install
npm run dev
```

The dev server starts at [http://localhost:5173](http://localhost:5173) with hot
module replacement enabled.

## Available scripts

| Script            | What it does                              |
| ----------------- | ----------------------------------------- |
| `npm run dev`     | Start the dev server                      |
| `npm run build`   | Build the production bundle into `dist/`  |
| `npm run preview` | Serve the production build locally        |
| `npm run lint`    | Run ESLint over the project               |

## Project layout

- `src/components/` — shared UI pieces (header, nav, modals, `ui/` primitives)
- `src/components/views/` — the Home, Inventory, and Catalog views
- `src/data/` — seed product data (app state lives in `src/App.jsx`)
- `src/constants/`, `src/utils/` — stock status definitions, CSV export, validation

