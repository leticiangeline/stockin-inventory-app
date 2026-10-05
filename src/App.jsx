import { useState } from 'react'
import Container from './components/ui/Container'
import AddProductModal from './components/AddProductModal'
import AddStockModal from './components/AddStockModal'
import Header from './components/Header'
import NavTabs from './components/NavTabs'
import HomeView from './components/views/HomeView'
import InventoryView from './components/views/InventoryView'
import CatalogView from './components/views/CatalogView'
import { INITIAL_PRODUCTS } from './data/products'
import {
  downloadCsv,
  getStockStatus,
  productsToCsv,
} from './utils/inventory'

const VIEWS = {
  home: HomeView,
  inventory: InventoryView,
  catalog: CatalogView,
}

function App() {
  // React state driving which of the three panels is rendered.
  const [activeTab, setActiveTab] = useState('home')
  const [products, setProducts] = useState(INITIAL_PRODUCTS)

  // Global search term — shared by the Inventory table and Catalog cards so the
  // query persists when switching tabs.
  const [query, setQuery] = useState('')

  // Modal state
  const [isAddProductOpen, setAddProductOpen] = useState(false)
  const [stockTargetId, setStockTargetId] = useState(null)

  const stockTarget =
    products.find((product) => product.id === stockTargetId) ?? null

  const ActiveView = VIEWS[activeTab]

  // Create a product from the validated Add Product modal payload.
  function handleCreateProduct(data) {
    setProducts((current) => {
      const nextId = current.reduce((max, p) => Math.max(max, p.id), 0) + 1
      return [...current, { id: nextId, ...data }]
    })
    setAddProductOpen(false)
    setActiveTab('inventory')
  }

  function handleRequestAddStock(product) {
    setStockTargetId(product.id)
  }

  // Add units to a SKU, never exceeding its max capacity.
  function handleConfirmAddStock(id, amount) {
    setProducts((current) =>
      current.map((product) =>
        product.id === id
          ? {
              ...product,
              quantity: Math.min(product.capacity, product.quantity + amount),
            }
          : product,
      ),
    )
    setStockTargetId(null)
  }

  function handleExportCsv() {
    const rows = products.map((product) => ({
      ...product,
      status: getStockStatus(product),
      stockValue: (product.price * product.quantity).toFixed(2),
    }))
    downloadCsv('stockin-inventory-report.csv', productsToCsv(rows))
  }

  return (
    <div className="min-h-screen bg-slate-100">
      <Header
        onAddProduct={() => setAddProductOpen(true)}
        onExportCsv={handleExportCsv}
      />
      <NavTabs activeTab={activeTab} onChange={setActiveTab} />

      <main>
        <Container className="py-6 sm:py-8">
          <ActiveView
            products={products}
            onNavigate={setActiveTab}
            onAddStock={handleRequestAddStock}
            query={query}
            onQueryChange={setQuery}
          />
        </Container>
      </main>

      <AddProductModal
        isOpen={isAddProductOpen}
        onClose={() => setAddProductOpen(false)}
        onCreate={handleCreateProduct}
        existingProducts={products}
      />

      {/* Mounted only while a SKU is targeted — remounting per SKU resets the amount. */}
      {stockTarget && (
        <AddStockModal
          key={stockTarget.id}
          product={stockTarget}
          onClose={() => setStockTargetId(null)}
          onConfirm={handleConfirmAddStock}
        />
      )}
    </div>
  )
}

export default App
