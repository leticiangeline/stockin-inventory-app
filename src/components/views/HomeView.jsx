import {
  AlertIcon,
  BoxesIcon,
  DollarIcon,
  TagIcon,
} from '../ui/icons'
import { getInventorySummary } from '../../utils/inventory'

const currency = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
})

const number = new Intl.NumberFormat('en-US')

// Border colour carries the urgency signal: amber = low stock, red = out of stock.
const CARD_STYLES = {
  neutral: {
    chip: 'bg-brand-50 text-brand-700',
    border: 'border-slate-200',
    value: 'text-slate-900',
  },
  valuation: {
    chip: 'bg-emerald-50 text-emerald-700',
    border: 'border-slate-200',
    value: 'text-emerald-700',
  },
  warning: {
    chip: 'bg-amber-50 text-amber-700',
    border: 'border-amber-400',
    value: 'text-amber-600',
  },
  critical: {
    chip: 'bg-red-50 text-red-700',
    border: 'border-red-500',
    value: 'text-red-600',
  },
}

// Explains how every product is classified into the three urgency tiers.
const URGENCY_RULES = [
  {
    emoji: '🟢',
    name: 'In Stock',
    condition: 'quantity > min_threshold',
    description: 'Healthy level, no action needed.',
    metric: 'inStock',
    chip: 'bg-emerald-50 text-emerald-700',
  },
  {
    emoji: '🟡',
    name: 'Low Stock Alert',
    condition: '0 < quantity <= min_threshold',
    description: 'Reorder soon to avoid running out.',
    metric: 'lowStock',
    chip: 'bg-amber-50 text-amber-700',
  },
  {
    emoji: '🔴',
    name: 'Out of Stock Alert',
    condition: 'quantity === 0',
    description: 'Urgent — customers cannot buy this item.',
    metric: 'outOfStock',
    chip: 'bg-red-50 text-red-700',
  },
]

function KpiCard({ icon: Icon, label, value, hint, variant = 'neutral' }) {
  const style = CARD_STYLES[variant]

  return (
    <div className={`rounded-xl border-2 bg-white p-5 shadow-card ${style.border}`}>
      <div className="flex items-center gap-3">
        <span
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${style.chip}`}
        >
          <Icon className="h-5 w-5" aria-hidden="true" />
        </span>
        <p className="text-sm font-medium text-slate-500">{label}</p>
      </div>
      <p className={`mt-3 text-2xl font-bold tabular-nums ${style.value}`}>
        {value}
      </p>
      {hint ? <p className="mt-1 text-xs text-slate-500">{hint}</p> : null}
    </div>
  )
}

function HomeView({ products, onNavigate }) {
  const summary = getInventorySummary(products)
  const needsAttention = products
    .filter((p) => p.quantity <= p.reorderLevel)
    .sort((a, b) => a.quantity - b.quantity)

  return (
    <section aria-label="KPI Overview" className="space-y-6">
      <header>
        <h2 className="text-lg font-bold text-slate-900">KPI Overview</h2>
        <p className="text-sm text-slate-500">
          Snapshot of your store inventory health.
        </p>
      </header>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard
          icon={TagIcon}
          label="Total SKUs Registered"
          value={number.format(summary.totalProducts)}
          hint="Every product on record"
          variant="neutral"
        />
        <KpiCard
          icon={DollarIcon}
          label="Total Valuation"
          value={currency.format(summary.stockValue)}
          hint="Quantity x unit price"
          variant="valuation"
        />
        <KpiCard
          icon={AlertIcon}
          label="Low Stock Warning"
          value={number.format(summary.lowStock)}
          hint="Above zero, at or under threshold"
          variant="warning"
        />
        <KpiCard
          icon={BoxesIcon}
          label="Out of Stock Alert"
          value={number.format(summary.outOfStock)}
          hint="Quantity has hit zero"
          variant="critical"
        />
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-card">
        <h3 className="text-sm font-bold text-slate-900">
          Stock Status Urgency Rules
        </h3>
        <p className="mt-1 text-sm text-slate-500">
          Every product is classified into exactly one tier, and the counts above
          are derived from these rules.
        </p>

        <ul className="mt-4 grid gap-3 sm:grid-cols-3">
          {URGENCY_RULES.map((rule) => (
            <li
              key={rule.name}
              className="rounded-lg border border-slate-200 bg-slate-50 p-4"
            >
              <div className="flex items-center justify-between gap-2">
                <span className="flex items-center gap-2">
                  <span aria-hidden="true" className="text-base leading-none">
                    {rule.emoji}
                  </span>
                  <span className="text-sm font-semibold text-slate-800">
                    {rule.name}
                  </span>
                </span>
                <span
                  className={`rounded-full px-2 py-0.5 text-xs font-bold tabular-nums ${rule.chip}`}
                >
                  {summary[rule.metric]}
                </span>
              </div>

              <p className="mt-3 rounded bg-white px-2 py-1 font-mono text-[11px] leading-snug text-slate-600 ring-1 ring-slate-200">
                {rule.condition}
              </p>
              <p className="mt-2 text-xs text-slate-500">{rule.description}</p>
            </li>
          ))}
        </ul>

        <p className="mt-4 border-t border-slate-100 pt-3 text-xs text-slate-500">
          <span className="font-semibold text-slate-600">min_threshold</span>{' '}
          is each product&rsquo;s reorder level. Items with quantity{' '}
          <span className="font-mono">0 &lt; quantity &lt;= min_threshold</span>{' '}
          raise a yellow warning; only <span className="font-mono">quantity === 0</span>{' '}
          raises a red alert.
        </p>
      </div>

      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-card">
        <div className="flex items-center justify-between border-b border-slate-200 px-5 py-3">
          <h3 className="text-sm font-bold text-slate-900">
            Needs attention
          </h3>
          <button
            type="button"
            onClick={() => onNavigate('inventory')}
            className="text-xs font-semibold text-brand-700 hover:text-brand-800"
          >
            View all
          </button>
        </div>

        {needsAttention.length === 0 ? (
          <p className="px-5 py-8 text-center text-sm text-slate-500">
            Everything is well stocked.
          </p>
        ) : (
          <ul className="divide-y divide-slate-100">
            {needsAttention.map((product) => (
              <li
                key={product.id}
                className="flex items-center justify-between gap-4 px-5 py-3"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-slate-800">
                    {product.name}
                  </p>
                  <p className="text-xs text-slate-500">
                    {product.sku} &middot; reorder at {product.reorderLevel}
                  </p>
                </div>
                <span
                  className={[
                    'shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold',
                    product.quantity === 0
                      ? 'bg-rose-50 text-rose-700'
                      : 'bg-amber-50 text-amber-700',
                  ].join(' ')}
                >
                  {product.quantity === 0 ? 'Out of stock' : `${product.quantity} left`}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  )
}

export default HomeView