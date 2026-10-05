import Button from './ui/Button'
import Container from './ui/Container'
import LogoIcon from './ui/LogoIcon'
import { DownloadIcon, PlusIcon } from './ui/icons'

function Header({ onAddProduct, onExportCsv }) {
  return (
    <header className="sticky top-0 z-20 border-b border-slate-200 bg-white shadow-header">
      <Container className="flex flex-col gap-4 py-4 lg:flex-row lg:items-center lg:justify-between">
        {/* Leftmost: logo + app title + subtitle */}
        <div className="flex min-w-0 items-center gap-3">
          <LogoIcon className="h-11 w-11 shrink-0" />
          <div className="min-w-0">
            <h1 className="truncate text-xl font-bold leading-tight text-slate-900">
              StockIn
            </h1>
            <p className="truncate text-xs font-medium text-slate-500 sm:text-sm">
              Store Inventory Management
            </p>
          </div>
        </div>

        {/* Rightmost: Export CSV Report, then + Add Product immediately to its right */}
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <Button
            variant="secondary"
            icon={DownloadIcon}
            onClick={onExportCsv}
          >
            Export CSV Report
          </Button>
          <Button variant="primary" icon={PlusIcon} onClick={onAddProduct}>
            Add Product
          </Button>
        </div>
      </Container>
    </header>
  )
}

export default Header