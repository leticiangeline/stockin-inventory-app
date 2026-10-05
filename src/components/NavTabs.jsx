import Container from './ui/Container'
import { BoxesIcon, LayersIcon, TagIcon } from './ui/icons'

const TABS = [
  { id: 'home', label: 'Home', hint: 'KPI Overview' },
  { id: 'inventory', label: 'Inventory', hint: 'Table View' },
  { id: 'catalog', label: 'Catalog', hint: 'Cards View' },
]

const TAB_ICONS = {
  home: LayersIcon,
  inventory: BoxesIcon,
  catalog: TagIcon,
}

function NavTabs({ activeTab, onChange }) {
  return (
    <nav
      aria-label="Views"
      className="border-b border-slate-200 bg-white"
    >
      <Container className="flex gap-1 overflow-x-auto">
        {TABS.map((tab) => {
          const Icon = TAB_ICONS[tab.id]
          const isActive = tab.id === activeTab

          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => onChange(tab.id)}
              aria-current={isActive ? 'page' : undefined}
              className={[
                'relative flex items-center gap-2 whitespace-nowrap px-4 py-3',
                'text-sm font-semibold transition-colors',
                isActive
                  ? 'text-brand-700'
                  : 'text-slate-500 hover:border-slate-300 hover:text-slate-800',
                'border-b-2',
                isActive
                  ? 'border-brand-600'
                  : 'border-transparent hover:border-slate-300',
              ].join(' ')}
            >
              <Icon className="h-4 w-4 shrink-0" aria-hidden="true" />
              <span>{tab.label}</span>
              <span
                className={[
                  'text-xs font-medium',
                  isActive ? 'text-brand-500' : 'text-slate-400',
                ].join(' ')}
              >
                ({tab.hint})
              </span>
            </button>
          )
        })}
      </Container>
    </nav>
  )
}

export default NavTabs