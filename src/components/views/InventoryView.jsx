import { useMemo, useState } from 'react'
import AddStockControl from '../ui/AddStockControl'
import SearchInput from '../ui/SearchInput'
import {
  ALL,
  CATEGORY_BADGE,
  DEFAULT_CATEGORY_BADGE,
  STATUS_META,
  STATUS_ORDER,
  STOCK_STATUS,
} from '../../constants/inventory'
import {
  getCapacityPercent,
  getInventorySummary,
  getStockStatus,
  matchesProductQuery,
} from '../../utils/inventory'

const currency = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
})

const number = new Intl.NumberFormat('en-US')

function CategoryBadge({ category }) {
  const badgeClass = CATEGORY_BADGE[category] ?? DEFAULT_CATEGORY_BADGE

  return (
    <span
      className={`inline-flex whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset ${badgeClass}`}
    >
      {category}
    </span>
  )
}

function StatusBadge({ status }) {
  const meta = STATUS_META[status]

  return (
    <span
      className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset ${meta.badge}`}
    >
      <span aria-hidden="true">{meta.emoji}</span>
      {meta.label}
    </span>
  )
}

// Stock against max capacity, e.g. "45 / 100 max", plus a fill bar.
function StockCell({ product }) {
  const percent = getCapacityPercent(product)
  const barTone =
    percent >= 100
      ? 'bg-emerald-500'
      : percent >= 50
        ? 'bg-brand-500'
        : 'bg-amber-500'

  return (
    <div className="min-w-[8.5rem]">
      <div className="flex items-baseline justify-between gap-2">
        <span className="font-semibold tabular-nums text-slate-800">
          {number.format(product.quantity)}
        </span>
        <span className="text-xs tabular-nums text-slate-500">
          / {number.format(product.capacity)} max
        </span>
      </div>
      <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
        <div
          className={`h-full rounded-full ${barTone}`}
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  )
}

function InventoryView({ products, onAddStock, query, onQueryChange }) {
  const [category, setCategory] = useState(ALL)
  const [status, setStatus] = useState(ALL)

  const categories = useMemo(
    () =>
      [...new Set(products.map((product) => product.category))].sort((a, b) =>
        a.localeCompare(b),
      ),
    [products],
  )

  const summary = getInventorySummary(products)
  const statusCounts = {
    [STOCK_STATUS.IN_STOCK]: summary.inStock,
    [STOCK_STATUS.LOW_STOCK]: summary.lowStock,
    [STOCK_STATUS.OUT_OF_STOCK]: summary.outOfStock,
  }

  const filteredProducts = useMemo(
    () =>
      products.filter((product) => {
        if (category !== ALL && product.category !== category) return false
        if (status !== ALL && getStockStatus(product) !== status) return false
        return matchesProductQuery(product, query)
      }),
    [products, query, category, status],
  )

  const isFiltered = query.trim() !== '' || category !== ALL || status !== ALL

  function resetFilters() {
    onQueryChange('')
    setCategory(ALL)
    setStatus(ALL)
  }

  return (
    <section aria-label="Inventory Table View" className="space-y-6">
      <header>
        <h2 className="text-lg font-bold text-slate-900">Inventory</h2>
        <p className="text-sm text-slate-500">
          {products.length} product{products.length === 1 ? '' : 's'} tracked in
          your store.
        </p>
      </header>

      {/* Search + filter controls */}
      <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-card">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
          <SearchInput
            id="inventory-search"
            value={query}
            onChange={onQueryChange}
            className="flex-1"
          />

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="flex items-center gap-2">
              <label
                htmlFor="inventory-category"
                className="whitespace-nowrap text-sm font-medium text-slate-500"
              >
                Category
              </label>
              <select
                id="inventory-category"
                value={category}
                onChange={(event) => setCategory(event.target.value)}
                className="h-10 rounded-lg border border-slate-300 bg-white px-3 text-sm font-medium text-slate-700 shadow-sm focus:border-brand-500"
              >
                <option value={ALL}>All categories</option>
                {categories.map((name) => (
                  <option key={name} value={name}>
                    {name}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-2">
              <label
                htmlFor="inventory-status"
                className="whitespace-nowrap text-sm font-medium text-slate-500"
              >
                Status
              </label>
              <select
                id="inventory-status"
                value={status}
                onChange={(event) => setStatus(event.target.value)}
                className="h-10 rounded-lg border border-slate-300 bg-white px-3 text-sm font-medium text-slate-700 shadow-sm focus:border-brand-500"
              >
                <option value={ALL}>All statuses</option>
                {STATUS_ORDER.map((value) => (
                  <option key={value} value={value}>
                    {STATUS_META[value].emoji} {STATUS_META[value].label} (
                    {statusCounts[value]})
                  </option>
                ))}
              </select>
            </div>

            {isFiltered && (
              <button
                type="button"
                onClick={resetFilters}
                className="h-10 whitespace-nowrap rounded-lg px-3 text-sm font-semibold text-brand-700 hover:bg-brand-50"
              >
                Clear filters
              </button>
            )}
          </div>
        </div>

        <p className="mt-3 text-xs text-slate-500">
          Showing{' '}
          <span className="font-semibold text-slate-700">
            {number.format(filteredProducts.length)}
          </span>{' '}
          of {number.format(products.length)} products
        </p>
      </div>

      {/* Data table */}
      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-card">
        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50">
                <th scope="col" className="px-4 py-3 font-semibold text-slate-600">
                  SKU
                </th>
                <th scope="col" className="px-4 py-3 font-semibold text-slate-600">
                  Product Name
                </th>
                <th scope="col" className="px-4 py-3 font-semibold text-slate-600">
                  Category
                </th>
                <th scope="col" className="px-4 py-3 text-right font-semibold text-slate-600">
                  Price
                </th>
                <th scope="col" className="px-4 py-3 font-semibold text-slate-600">
                  Stock / Max Capacity
                </th>
                <th scope="col" className="px-4 py-3 text-right font-semibold text-slate-600">
                  Min Threshold
                </th>
                <th scope="col" className="px-4 py-3 font-semibold text-slate-600">
                  Urgency Status
                </th>
                <th scope="col" className="px-4 py-3 text-right font-semibold text-slate-600">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredProducts.map((product) => (
                <tr key={product.id} className="align-middle hover:bg-slate-50">
                  <td className="whitespace-nowrap px-4 py-3 font-mono text-xs text-slate-500">
                    {product.sku}
                  </td>
                  <td className="px-4 py-3 font-semibold text-slate-800">
                    {product.name}
                  </td>
                  <td className="px-4 py-3">
                    <CategoryBadge category={product.category} />
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-right tabular-nums text-slate-700">
                    {currency.format(product.price)}
                  </td>
                  <td className="px-4 py-3">
                    <StockCell product={product} />
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-right tabular-nums text-slate-500">
                    {number.format(product.reorderLevel)}
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge status={getStockStatus(product)} />
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end">
                      <AddStockControl product={product} onRequest={onAddStock} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredProducts.length === 0 && (
          <p className="px-5 py-10 text-center text-sm text-slate-500">
            {isFiltered
              ? 'No products match your filters.'
              : 'No products yet. Use “Add Product” to create one.'}
          </p>
        )}
      </div>
    </section>
  )
}

export default InventoryView