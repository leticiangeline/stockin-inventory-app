// Single source of truth for the three stock urgency tiers.
// Used by the Home rules box, the Inventory status badges, filters and CSV export.

export const STOCK_STATUS = {
  IN_STOCK: 'In Stock',
  LOW_STOCK: 'Low Stock Alert',
  OUT_OF_STOCK: 'Out of Stock Alert',
}

// Display order: healthiest first.
export const STATUS_ORDER = [
  STOCK_STATUS.IN_STOCK,
  STOCK_STATUS.LOW_STOCK,
  STOCK_STATUS.OUT_OF_STOCK,
]

export const STATUS_META = {
  [STOCK_STATUS.IN_STOCK]: {
    label: STOCK_STATUS.IN_STOCK,
    emoji: '🟢',
    badge: 'bg-emerald-50 text-emerald-700 ring-emerald-600/20',
  },
  [STOCK_STATUS.LOW_STOCK]: {
    label: STOCK_STATUS.LOW_STOCK,
    emoji: '🟡',
    badge: 'bg-amber-50 text-amber-700 ring-amber-600/20',
  },
  [STOCK_STATUS.OUT_OF_STOCK]: {
    label: STOCK_STATUS.OUT_OF_STOCK,
    emoji: '🔴',
    badge: 'bg-red-50 text-red-700 ring-red-600/20',
  },
}

// Summary key used by getInventorySummary for each status.
export const STATUS_SUMMARY_KEY = {
  [STOCK_STATUS.IN_STOCK]: 'inStock',
  [STOCK_STATUS.LOW_STOCK]: 'lowStock',
  [STOCK_STATUS.OUT_OF_STOCK]: 'outOfStock',
}

export const CATEGORY_BADGE = {
  Electronics: 'bg-blue-50 text-blue-700 ring-blue-600/20',
  Stationery: 'bg-sky-50 text-sky-700 ring-sky-600/20',
  Packaging: 'bg-emerald-50 text-emerald-700 ring-emerald-600/20',
}

export const DEFAULT_CATEGORY_BADGE = 'bg-slate-100 text-slate-600 ring-slate-500/20'

export const ALL = 'all'