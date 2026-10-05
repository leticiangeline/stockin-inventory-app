import { useMemo, useState } from 'react'
import Button from './ui/Button'
import Field from './ui/Field'
import Modal from './ui/Modal'
import { PlusIcon } from './ui/icons'
import {
  EMPTY_PRODUCT_FORM,
  previewProductStatus,
  validateProductForm,
} from '../utils/productValidation'

function AddProductModal({ isOpen, onClose, onCreate, existingProducts = [] }) {
  const [values, setValues] = useState(EMPTY_PRODUCT_FORM)
  const [submitted, setSubmitted] = useState(false)

  const existingSkus = useMemo(
    () => existingProducts.map((p) => p.sku.toLowerCase()),
    [existingProducts],
  )

  const { errors } = validateProductForm(values, existingSkus)
  const preview = previewProductStatus(values)

  function handleChange(field) {
    return (event) =>
      setValues((current) => ({ ...current, [field]: event.target.value }))
  }

  function handleSubmit(event) {
    event.preventDefault()
    setSubmitted(true)

    const result = validateProductForm(values, existingSkus)
    if (!result.product) return

    onCreate(result.product)
    setValues(EMPTY_PRODUCT_FORM)
    setSubmitted(false)
  }

  function handleClose() {
    setValues(EMPTY_PRODUCT_FORM)
    setSubmitted(false)
    onClose()
  }

  const showError = (key) => (submitted ? errors[key] : undefined)

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Add Product"
      description="Register a new SKU in your store inventory."
      size="lg"
      footer={
        <>
          <Button variant="secondary" onClick={handleClose}>
            Cancel
          </Button>
          <Button
            variant="primary"
            icon={PlusIcon}
            type="submit"
            form="add-product-form"
          >
            Add Product
          </Button>
        </>
      }
    >
      <form id="add-product-form" onSubmit={handleSubmit} noValidate>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field
            label="SKU"
            htmlFor="ap-sku"
            placeholder="SCN-2001"
            value={values.sku}
            onChange={handleChange('sku')}
            error={showError('sku')}
            autoComplete="off"
          />
          <Field
            label="Product Name"
            htmlFor="ap-name"
            placeholder="Handheld Stock Taker PDA"
            value={values.name}
            onChange={handleChange('name')}
            error={showError('name')}
            autoComplete="off"
          />
          <Field
            label="Category"
            htmlFor="ap-category"
            placeholder="Electronics"
            value={values.category}
            onChange={handleChange('category')}
            error={showError('category')}
            list="ap-category-options"
            autoComplete="off"
          />
          <datalist id="ap-category-options">
            {[...new Set(existingProducts.map((p) => p.category))].map((c) => (
              <option key={c} value={c} />
            ))}
          </datalist>

          <Field
            label="Price ($)"
            htmlFor="ap-price"
            type="number"
            min="0"
            step="0.01"
            placeholder="49.99"
            value={values.price}
            onChange={handleChange('price')}
            error={showError('price')}
          />
          <Field
            label="Initial Quantity"
            htmlFor="ap-quantity"
            type="number"
            min="0"
            step="1"
            placeholder="0"
            value={values.quantity}
            onChange={handleChange('quantity')}
            error={showError('quantity')}
          />
          <Field
            label="Max Capacity"
            htmlFor="ap-capacity"
            type="number"
            min="1"
            step="1"
            placeholder="100"
            value={values.capacity}
            onChange={handleChange('capacity')}
            error={showError('capacity')}
          />
          <Field
            label="Min Threshold"
            htmlFor="ap-reorderLevel"
            type="number"
            min="0"
            step="1"
            placeholder="10"
            value={values.reorderLevel}
            onChange={handleChange('reorderLevel')}
            error={showError('reorderLevel')}
            hint="Low Stock Alert fires at or below this."
          />
        </div>

        <p className="mt-4 rounded-lg bg-slate-50 px-3 py-2 text-xs text-slate-600">
          Status preview:{' '}
          <span className="font-semibold">
            {preview ?? 'complete the fields'}
          </span>
        </p>
      </form>
    </Modal>
  )
}

export default AddProductModal