'use client';

import React from 'react';
import { CartProvider } from '../context/CartContext';
import CartDrawer from './CartDrawer';
import FloatingBookButton from './FloatingBookButton';
import BottomNav from './BottomNav';

export default function ClientProviders({ children }) {
  return (
    <CartProvider>
      {children}
      <CartDrawer />
      <FloatingBookButton />
      <BottomNav />
    </CartProvider>
  );
}
