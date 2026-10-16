'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [items, setItems] = useState([]);
  const [isOpen, setIsOpen] = useState(false);

  // Cargar carrito desde localStorage en la primera carga
  useEffect(() => {
    try {
      const saved = localStorage.getItem('autobooking_cart');
      if (saved) {
        setItems(JSON.parse(saved));
      }
    } catch (e) {
      console.error('Error loading cart', e);
    }
  }, []);

  // Guardar en localStorage cuando cambie
  useEffect(() => {
    try {
      localStorage.setItem('autobooking_cart', JSON.stringify(items));
    } catch (e) {
      console.error('Error saving cart', e);
    }
  }, [items]);

  function addToCart(producto, conInstalacion = false) {
    setItems((prev) => {
      const index = prev.findIndex((i) => i.id === producto.id);
      if (index > -1) {
        const copy = [...prev];
        copy[index].cantidad = (copy[index].cantidad || 1) + 1;
        if (conInstalacion) {
          copy[index].conInstalacion = true;
        }
        return copy;
      } else {
        return [
          ...prev,
          {
            ...producto,
            cantidad: 1,
            conInstalacion: conInstalacion
          }
        ];
      }
    });
    setIsOpen(true);
  }

  function removeFromCart(id) {
    setItems((prev) => prev.filter((i) => i.id !== id));
  }

  function updateQuantity(id, newQty) {
    if (newQty <= 0) {
      removeFromCart(id);
      return;
    }
    setItems((prev) =>
      prev.map((i) => (i.id === id ? { ...i, cantidad: newQty } : i))
    );
  }

  function toggleItemInstallation(id) {
    setItems((prev) =>
      prev.map((i) => (i.id === id ? { ...i, conInstalacion: !i.conInstalacion } : i))
    );
  }

  function clearCart() {
    setItems([]);
  }

  const totalItems = items.reduce((acc, i) => acc + (i.cantidad || 1), 0);
  const subtotalProductos = items.reduce((acc, i) => acc + (i.precio * (i.cantidad || 1)), 0);
  const totalInstalacion = items.reduce(
    (acc, i) => acc + (i.conInstalacion ? (i.precioInstalacion || 0) * (i.cantidad || 1) : 0),
    0
  );
  const costoDespacho = subtotalProductos >= 50000 || subtotalProductos === 0 ? 0 : 3900;
  const totalGeneral = subtotalProductos + totalInstalacion + costoDespacho;

  return (
    <CartContext.Provider
      value={{
        items,
        isOpen,
        setIsOpen,
        addToCart,
        removeFromCart,
        updateQuantity,
        toggleItemInstallation,
        clearCart,
        totalItems,
        subtotalProductos,
        totalInstalacion,
        costoDespacho,
        totalGeneral
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    // Retorno seguro si se llama fuera del provider
    return {
      items: [],
      isOpen: false,
      setIsOpen: () => {},
      addToCart: () => {},
      removeFromCart: () => {},
      updateQuantity: () => {},
      toggleItemInstallation: () => {},
      clearCart: () => {},
      totalItems: 0,
      subtotalProductos: 0,
      totalInstalacion: 0,
      costoDespacho: 0,
      totalGeneral: 0
    };
  }
  return context;
}
