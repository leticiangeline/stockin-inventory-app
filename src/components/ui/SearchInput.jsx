import { SearchIcon } from './icons'

/**
 * Shared search box for the Inventory table and the Catalog cards.
 *
 * The value is controlled from App, so typing here filters whichever view is
 * currently mounted — the query persists when switching tabs.
 */
function SearchInput({ id, value, onChange, className = '' }) {
  return (
    <div className={`relative ${className}`}>
      <SearchIcon
        className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
        aria-hidden="true"
      />
      <label className="sr-only" htmlFor={id}>
        Search by SKU, product name or category
      </label>
      <input
        id={id}
        type="search"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="Search SKU, product name or category..."
        className="h-10 w-full rounded-lg border border-slate-300 bg-white pl-9 pr-3 text-sm text-slate-800 shadow-sm placeholder:text-slate-400 focus:border-brand-500"
      />
    </div>
  )
}

export default SearchInput