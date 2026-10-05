import {
  STOCK_STATUS,
  STATUS_META,
} from '../../constants/inventory'
import { getCapacityPercent, getStockStatus, matchesProductQuery } from '../../utils/inventory'
import { useMemo } from 'react'
import SearchInput from '../ui/SearchInput'
import AddStockControl from '../ui/AddStockControl'

const currency = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
})

const number = new Intl.NumberFormat('en-US')

// Card border colour by urgency tier: yellow = low stock, red = out of stock.
const STATUS_BORDER = {
  [STOCK_STATUS.IN_STOCK]: 'border-slate-200',
  [STOCK_STATUS.LOW_STOCK]: 'border-amber-400',
  [STOCK_STATUS.OUT_OF_STOCK]: 'border-red-500',
}

// Stock fill bar tone.
const STATUS_BAR_TONE = {
  [STOCK_STATUS.IN_STOCK]: 'bg-emerald-500',
  [STOCK_STATUS.LOW_STOCK]: 'bg-amber-500',
  [STOCK_STATUS.OUT_OF_STOCK]: 'bg-red-500',
}

// Current Stock value colour, matching the tier urgency.
const STOCK_VALUE_TONE = {
  [STOCK_STATUS.IN_STOCK]: 'text-slate-900',
  [STOCK_STATUS.LOW_STOCK]: 'text-amber-600',
  [STOCK_STATUS.OUT_OF_STOCK]: 'text-red-600',
}

function DetailRow({ label, value, valueClass = 'text-slate-900' }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <span className="text-xs font-medium text-slate-500">{label}</span>
      <span className={`text-sm font-bold tabular-nums ${valueClass}`}>
        {value}
      </span>
    </div>
  )
}

function ProductCard({ product, onAddStock }) {
  const status = getStockStatus(product)
  const borderTone = STATUS_BORDER[status] ?? 'border-slate-200'
  const barTone = STATUS_BAR_TONE[status] ?? 'bg-slate-400'
  const valueTone = STOCK_VALUE_TONE[status] ?? 'text-slate-900'
  const percent = getCapacityPercent(product)

  return (
    <article
      className={`flex flex-col rounded-xl border-2 bg-white shadow-card transition-shadow hover:shadow-header ${borderTone}`}
    >
      {/* SKU badge (top left) + status badge (top right) */}
      <div className="flex items-start justify-between gap-2 p-4 pb-0">
        <span className="inline-flex whitespace-nowrap rounded-md bg-slate-100 px-2 py-1 font-mono text-[11px] font-semibold uppercase tracking-wide text-slate-600">
          {product.sku}
        </span>
        <span
          className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-2.5 py-1 text-[11px] font-semibold ring-1 ring-inset ${STATUS_META[status].badge}`}
        >
          <span aria-hidden="true">{STATUS_META[status].emoji}</span>
          {STATUS_META[status].label}
        </span>
      </div>

      {/* Title + category */}
      <div className="px-4 pt-3">
        <h3 className="line-clamp-2 text-sm font-bold leading-snug text-slate-900">
          {product.name}
        </h3>
        <p className="mt-1 text-xs font-medium text-slate-500">
          {product.category}
        </p>
      </div>

      {/* Details box */}
      <dl className="mx-4 mt-3 space-y-2 rounded-lg border border-slate-200 bg-slate-50 p-3">
        <DetailRow label="Price" value={currency.format(product.price)} />
        <DetailRow
          label="Current Stock"
          value={number.format(product.quantity)}
          valueClass={valueTone}
        />
        <DetailRow
          label="Max Capacity"
          value={number.format(product.capacity)}
        />
        <DetailRow
          label="Reorder Threshold"
          value={number.format(product.reorderLevel)}
        />
      </dl>

      {/* Stock fill */}
      <div className="px-4 pt-3">
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
          <div
            className={`h-full rounded-full ${barTone}`}
            style={{ width: `${percent}%` }}
          />
        </div>
        <p className="mt-1 text-[11px] text-slate-400">
          {percent}% of capacity used
        </p>
      </div>

      {/* Full-width action */}
      <div className="mt-auto p-4 pt-3">
        <AddStockControl
          product={product}
          onRequest={onAddStock}
          fullWidth
        />
      </div>
    </article>
  )
}

function CatalogView({ products, onAddStock, query, onQueryChange }) {
  // Same search rule the Inventory table uses, so one query filters both views.
  const visibleProducts = useMemo(
    () => products.filter((p) => matchesProductQuery(p, query)),
    [products, query],
  )

  const isFiltered = query.trim() !== ''

  return (
    <section aria-label="Catalog Cards View" className="space-y-6">
      <header>
        <h2 className="text-lg font-bold text-slate-900">Catalog</h2>
        <p className="text-sm text-slate-500">
          Browse every product as a card.
        </p>
      </header>

      <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-card">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <SearchInput
            id="catalog-search"
            value={query}
            onChange={onQueryChange}
            className="flex-1"
          />
          <p className="text-xs text-slate-500">
            Showing{' '}
            <span className="font-semibold text-slate-700">
              {visibleProducts.length}
            </span>{' '}
            of {products.length} products
          </p>
        </div>
      </div>

      {/* 3-column responsive grid */}
      <div className="grid grid-cols-1 gap-x-5 gap-y-6 sm:grid-cols-2 lg:grid-cols-3">
        {visibleProducts.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            onAddStock={onAddStock}
          />
        ))}
      </div>

      {visibleProducts.length === 0 && (
        <p className="rounded-xl border border-slate-200 bg-white px-5 py-10 text-center text-sm text-slate-500 shadow-card">
          {isFiltered
            ? 'No products match your search.'
            : 'No products yet. Use “Add Product” to create one.'}
        </p>
      )}
    </section>
  )
}

export default CatalogView