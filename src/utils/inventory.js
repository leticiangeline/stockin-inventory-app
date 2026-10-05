import { STOCK_STATUS } from '../constants/inventory'

const CSV_COLUMNS = [
  'id',
  'name',
  'sku',
  'category',
  'price',
  'quantity',
  'capacity',
  'reorderLevel',
  'status',
  'stockValue',
]

function escapeCell(value) {
  const text = value === null || value === undefined ? '' : String(value)
  // Guard against spreadsheet formula injection, then quote when needed.
  const safe = /^[=+\-@\t\r]/.test(text) ? `'${text}` : text
  return `"${safe.replace(/"/g, '""')}"`
}

export function productsToCsv(products) {
  const header = CSV_COLUMNS.map((column) => escapeCell(column)).join(',')
  const rows = products.map((product) =>
    CSV_COLUMNS.map((column) => escapeCell(product[column])).join(','),
  )
  // Prepend BOM so Excel renders UTF-8 correctly.
  return `\uFEFF${[header, ...rows].join('\r\n')}`
}

export function downloadCsv(filename, csv) {
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')

  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

/**
 * Urgency tiers:
 *  - Out of Stock Alert : quantity === 0
 *  - Low Stock Alert    : 0 < quantity <= reorderLevel (min threshold)
 *  - In Stock           : quantity > reorderLevel
 */
export function getStockStatus(product) {
  if (product.quantity === 0) return STOCK_STATUS.OUT_OF_STOCK
  if (product.quantity <= product.reorderLevel) return STOCK_STATUS.LOW_STOCK
  return STOCK_STATUS.IN_STOCK
}

/** 0-100 fill of the SKU against its max capacity. */
export function getCapacityPercent(product) {
  if (!product.capacity) return 0
  return Math.min(100, Math.round((product.quantity / product.capacity) * 100))
}

/** Units of headroom left before the SKU hits max capacity. */
export function getHeadroom(product) {
  return Math.max(0, product.capacity - product.quantity)
}

/**
 * Real-time search rule shared by the Inventory table and the Catalog cards:
 * a product matches when the term appears in its SKU, name or category.
 */
export function matchesProductQuery(product, rawTerm) {
  const term = String(rawTerm ?? '').trim().toLowerCase()
  if (!term) return true

  return (
    product.sku.toLowerCase().includes(term) ||
    product.name.toLowerCase().includes(term) ||
    product.category.toLowerCase().includes(term)
  )
}

/** Filter a product list with the shared search rule. */
export function filterByQuery(products, rawTerm) {
  return products.filter((product) => matchesProductQuery(product, rawTerm))
}

/**
 * Clamp a requested add-stock amount to 1..headroom.
 * Returns 0 when the request is invalid or the SKU is already full.
 */
export function resolveAddAmount(requested, product) {
  const headroom = getHeadroom(product)
  if (headroom <= 0) return 0

  const parsed = Number(requested)
  if (!Number.isFinite(parsed) || parsed <= 0) return 0

  return Math.min(Math.floor(parsed), headroom)
}

export function getInventorySummary(products) {
  return products.reduce(
    (summary, product) => {
      summary.totalUnits += product.quantity
      summary.stockValue += product.quantity * product.price
      if (product.quantity === 0) summary.outOfStock += 1
      else if (product.quantity <= product.reorderLevel) summary.lowStock += 1
      else summary.inStock += 1
      return summary
    },
    {
      totalProducts: products.length,
      totalUnits: 0,
      stockValue: 0,
      inStock: 0,
      lowStock: 0,
      outOfStock: 0,
    },
  )
}