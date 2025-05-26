import { createReducer, on } from '@ngrx/store';
import { CartActions } from './cart.actions';
import { CartItem, CartState, initialCartState } from './cart.model';

export const cartFeatureKey = 'cart';

export const cartReducer = createReducer(
  initialCartState,
  
  on(CartActions.addItem, (state, { product, quantity }) => {
    // Перевіряємо, чи товар вже є в кошику
    const existingItemIndex = state.items.findIndex(item => item.product.id === product.id);
    
    if (existingItemIndex >= 0) {
      // Якщо товар вже є, оновлюємо кількість
      const updatedItems = [...state.items];
      const existingItem = updatedItems[existingItemIndex];
      updatedItems[existingItemIndex] = {
        ...existingItem,
        quantity: existingItem.quantity + quantity
      };
      
      return {
        ...state,
        items: updatedItems
      };
    } else {
      // Якщо товару немає, додаємо новий
      const newItem: CartItem = {
        id: Date.now(), // Використовуємо timestamp як тимчасовий ID
        product,
        quantity,
        price: product.current_price_value || '0'
      };
      
      return {
        ...state,
        items: [...state.items, newItem]
      };
    }
  }),
  
  on(CartActions.removeItem, (state, { id }) => {
    return {
      ...state,
      items: state.items.filter(item => item.id !== id)
    };
  }),
  
  on(CartActions.updateQuantity, (state, { id, quantity }) => {
    return {
      ...state,
      items: state.items.map(item => 
        item.id === id ? { ...item, quantity } : item
      )
    };
  }),
  
  on(CartActions.clearCart, (state) => {
    return {
      ...state,
      items: []
    };
  }),
  
  on(CartActions.loadCart, (state) => {
    return {
      ...state,
      loading: true,
      error: null
    };
  }),
  
  on(CartActions.loadCartSuccess, (state, { items }) => {
    return {
      ...state,
      items,
      loading: false
    };
  }),
  
  on(CartActions.loadCartFailure, (state, { error }) => {
    return {
      ...state,
      loading: false,
      error
    };
  }),
  
  on(CartActions.saveCart, (state) => {
    return {
      ...state,
      loading: true,
      error: null
    };
  }),
  
  on(CartActions.saveCartSuccess, (state) => {
    return {
      ...state,
      loading: false
    };
  }),
  
  on(CartActions.saveCartFailure, (state, { error }) => {
    return {
      ...state,
      loading: false,
      error
    };
  })
);
