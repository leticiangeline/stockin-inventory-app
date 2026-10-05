import { PlusIcon } from './icons'

/**
 * "+ Add Stock" trigger button.
 *
 * Only opens the quick-add modal — the amount entry and the capacity cap live in
 * AddStockModal, so this stays a dumb, reusable presentational button.
 */
function AddStockControl({ product, onRequest, fullWidth = false }) {
  const isFull = product.quantity >= product.capacity

  return (
    <button
      type="button"
      onClick={() => onRequest(product)}
      disabled={isFull}
      title={
        isFull
          ? 'Already at max capacity'
          : `Add stock (${product.capacity - product.quantity} spaces left)`
      }
      className={[
        'inline-flex items-center justify-center gap-1 rounded-lg border border-slate-300 bg-white',
        'px-2.5 py-1.5 text-xs font-semibold text-slate-700 shadow-sm transition-colors',
        'hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50',
        fullWidth ? 'w-full py-2' : 'whitespace-nowrap',
      ].join(' ')}
    >
      <PlusIcon className="h-3.5 w-3.5" aria-hidden="true" />
      Add Stock
    </button>
  )
}

export default AddStockControl