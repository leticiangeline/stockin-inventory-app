import { useState } from 'react'
import Button from './ui/Button'
import Modal from './ui/Modal'
import { PlusIcon } from './ui/icons'
import { STATUS_META } from '../constants/inventory'
import {
  getCapacityPercent,
  getHeadroom,
  getStockStatus,
  resolveAddAmount,
} from '../utils/inventory'

const QUICK_AMOUNTS = [1, 5, 10, 25]

function AddStockModal({ product, onClose, onConfirm }) {
  const [amount, setAmount] = useState('1')

  const headroom = getHeadroom(product)
  const isFull = headroom <= 0
  const resolved = resolveAddAmount(amount, product)
  const newQuantity = Math.min(product.capacity, product.quantity + resolved)

  const currentStatus = getStockStatus(product)
  const nextStatus = getStockStatus({ ...product, quantity: newQuantity })
  const statusChanged = nextStatus !== currentStatus

  const quickAmounts = QUICK_AMOUNTS.filter((n) => n <= headroom)

  function handleSubmit(event) {
    event.preventDefault()
    const finalAmount = resolveAddAmount(amount, product)
    if (finalAmount <= 0) return
    onConfirm(product.id, finalAmount)
  }

  return (
    <Modal
      isOpen
      onClose={onClose}
      title="Add Stock"
      description={`${product.name} (${product.sku})`}
      size="md"
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button
            variant="primary"
            icon={PlusIcon}
            type="submit"
            form="add-stock-form"
            disabled={isFull || resolved <= 0}
          >
            {resolved > 0
              ? `Add ${resolved} unit${resolved === 1 ? '' : 's'}`
              : 'Add Stock'}
          </Button>
        </>
      }
    >
      <form id="add-stock-form" onSubmit={handleSubmit} noValidate>
        <dl className="grid grid-cols-3 gap-2">
          <div className="rounded-lg border border-slate-200 p-2 text-center">
            <dt className="text-[11px] font-medium text-slate-500">Current</dt>
            <dd className="mt-0.5 text-lg font-bold tabular-nums text-slate-900">
              {product.quantity}
            </dd>
          </div>
          <div className="rounded-lg border border-slate-200 p-2 text-center">
            <dt className="text-[11px] font-medium text-slate-500">Max</dt>
            <dd className="mt-0.5 text-lg font-bold tabular-nums text-slate-900">
              {product.capacity}
            </dd>
          </div>
          <div className="rounded-lg border border-slate-200 p-2 text-center">
            <dt className="text-[11px] font-medium text-slate-500">Reorder At</dt>
            <dd className="mt-0.5 text-lg font-bold tabular-nums text-slate-900">
              {product.reorderLevel}
            </dd>
          </div>
        </dl>

        {isFull ? (
          <p className="mt-4 rounded-lg border border-amber-300 bg-amber-50 px-3 py-2 text-sm font-medium text-amber-800">
            This SKU is already at max capacity ({product.capacity} units). No
            more stock can be added.
          </p>
        ) : (
          <>
            <label
              htmlFor="stock-amount"
              className="mt-4 mb-1 block text-xs font-semibold text-slate-600"
            >
              Units to add (max {headroom})
            </label>
            <input
              id="stock-amount"
              type="number"
              min="1"
              max={headroom}
              value={amount}
              onChange={(event) => setAmount(event.target.value)}
              autoFocus
              className="h-10 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm tabular-nums text-slate-800 shadow-sm focus:border-brand-500"
            />

            <div className="mt-2 flex flex-wrap gap-1.5">
              {quickAmounts.map((n) => (
                <button
                  key={n}
                  type="button"
                  onClick={() => setAmount(String(n))}
                  className="rounded-md border border-slate-300 bg-white px-2 py-1 text-xs font-semibold text-slate-600 transition-colors hover:bg-slate-50"
                >
                  +{n}
                </button>
              ))}
              <button
                type="button"
                onClick={() => setAmount(String(headroom))}
                className="rounded-md border border-slate-300 bg-white px-2 py-1 text-xs font-semibold text-slate-600 transition-colors hover:bg-slate-50"
              >
                Fill to max ({headroom})
              </button>
            </div>

            {resolved > 0 && resolved < Number(amount) && (
              <p className="mt-2 text-xs font-medium text-amber-700">
                Capped at {resolved} — only {headroom} space
                {headroom === 1 ? '' : 's'} left.
              </p>
            )}
          </>
        )}

        {/* Live preview of the exact state change on confirm. */}
        <div className="mt-4 rounded-lg border border-brand-200 bg-brand-50 px-3 py-3">
          <p className="text-xs font-semibold uppercase tracking-wide text-brand-700">
            After adding
          </p>
          <div className="mt-1.5 flex items-center justify-between gap-3">
            <span className="text-sm font-semibold tabular-nums text-slate-800">
              {product.quantity} &rarr; {newQuantity} units
            </span>
            <span
              className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset ${STATUS_META[nextStatus].badge}`}
            >
              <span aria-hidden="true">{STATUS_META[nextStatus].emoji}</span>
              {STATUS_META[nextStatus].label}
            </span>
          </div>
          <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-white">
            <div
              className="h-full rounded-full bg-brand-500"
              style={{
                width: `${getCapacityPercent({ ...product, quantity: newQuantity })}%`,
              }}
            />
          </div>
          {statusChanged && (
            <p className="mt-2 text-xs font-medium text-brand-800">
              Status will change from {STATUS_META[currentStatus].label} to{' '}
              {STATUS_META[nextStatus].label}.
            </p>
          )}
        </div>
      </form>
    </Modal>
  )
}

export default AddStockModal