import { createContext, useContext, useState, useCallback, useEffect } from 'react'

const CartContext = createContext()

export function CartProvider({ children }) {
  const [items, setItems] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('cart')) || []
    } catch { return [] }
  })
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(items))
  }, [items])

  const addItem = useCallback((product, size, color, quantity = 1) => {
    setItems(prev => {
      const key = `${product.id}-${size}-${color}`
      const existing = prev.find(item => `${item.id}-${item.size}-${item.color}` === key)
      if (existing) {
        return prev.map(item =>
          `${item.id}-${item.size}-${item.color}` === key
            ? { ...item, quantity: item.quantity + quantity }
            : item
        )
      }
      return [...prev, { ...product, size, color, quantity, cartId: Date.now() }]
    })
    setIsOpen(true)
  }, [])

  const removeItem = useCallback((cartId) => {
    setItems(prev => prev.filter(item => item.cartId !== cartId))
  }, [])

  const updateQuantity = useCallback((cartId, quantity) => {
    if (quantity < 1) {
      setItems(prev => prev.filter(item => item.cartId !== cartId))
      return
    }
    setItems(prev => prev.map(item =>
      item.cartId === cartId ? { ...item, quantity } : item
    ))
  }, [])

  const clearCart = useCallback(() => setItems([]), [])

  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0)

  return (
    <CartContext.Provider value={{
      items, addItem, removeItem, updateQuantity, clearCart,
      total, itemCount, isOpen, setIsOpen
    }}>
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => useContext(CartContext)
