import { getStockStatus } from './inventory'

export const EMPTY_PRODUCT_FORM = {
  sku: '',
  name: '',
  category: '',
  price: '',
  quantity: '',
  capacity: '',
  reorderLevel: '',
}
/**
 * Parse + validate the raw Add Product form strings.
 * Returns { errors, product? } — product exists only when every field is valid.
 */
export function validateProductForm(values, existingSkus = []) {
  const errors = {}
  const sku = values.sku.trim()
  const name = values.name.trim()
  const category = values.category.trim()

  const price = Number(values.price)
  const quantity = Number(values.quantity)
  const capacity = Number(values.capacity)
  const reorderLevel = Number(values.reorderLevel)

  const takenSkus = existingSkus.map((s) => String(s).toLowerCase())

  if (!sku) {
    errors.sku = 'SKU is required.'
  } else if (takenSkus.includes(sku.toLowerCase())) {
    errors.sku = 'That SKU is already registered.'
  }

  if (!name) errors.name = 'Product name is required.'

  if (!category) {
    errors.category = 'Category is required.'
  } else if (!/^[a-z ]+$/i.test(category)) {
    errors.category = 'Letters and spaces only.'
  }

  if (values.price === '' || Number.isNaN(price)) {
    errors.price = 'Enter a valid price.'
  } else if (price < 0) {
    errors.price = 'Price cannot be negative.'
  }

  if (values.quantity === '' || !Number.isInteger(quantity)) {
    errors.quantity = 'Enter a whole number.'
  } else if (quantity < 0) {
    errors.quantity = 'Quantity cannot be negative.'
  }

  if (values.capacity === '' || !Number.isInteger(capacity)) {
    errors.capacity = 'Enter a whole number.'
  } else if (capacity <= 0) {
    errors.capacity = 'Max capacity must be at least 1.'
  }

  if (values.reorderLevel === '' || !Number.isInteger(reorderLevel)) {
    errors.reorderLevel = 'Enter a whole number.'
  } else if (reorderLevel < 0) {
    errors.reorderLevel = 'Threshold cannot be negative.'
  }

  // Cross-field rules only run when both sides parsed cleanly.
  if (!errors.capacity && !errors.quantity && quantity > capacity) {
    errors.quantity = 'Quantity cannot exceed max capacity.'
  }
  if (!errors.capacity && !errors.reorderLevel && reorderLevel > capacity) {
    errors.reorderLevel = 'Threshold cannot exceed max capacity.'
  }

  if (Object.keys(errors).length > 0) return { errors }

  return {
    errors: {},
    product: { sku, name, category, price, quantity, capacity, reorderLevel },
  }
}

/** Live status preview for the Add Product form. */
export function previewProductStatus(values) {
  const result = validateProductForm(values, [])
  return result.product ? getStockStatus(result.product) : null
}