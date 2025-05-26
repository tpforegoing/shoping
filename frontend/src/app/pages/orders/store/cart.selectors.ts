import { createFeatureSelector, createSelector } from '@ngrx/store';
import { cartFeatureKey } from './cart.reducer';
import { CartState } from './cart.model';

export const selectCartState = createFeatureSelector<CartState>(cartFeatureKey);

export const selectCartItems = createSelector(
  selectCartState,
  (state) => state.items
);

export const selectCartItemsCount = createSelector(
  selectCartItems,
  (items) => items.reduce((count, item) => count + item.quantity, 0)
);

export const selectCartTotal = createSelector(
  selectCartItems,
  (items) => items.reduce((total, item) => {
    const itemPrice = parseFloat(item.price) || 0;
    return total + (itemPrice * item.quantity);
  }, 0)
);

export const selectCartLoading = createSelector(
  selectCartState,
  (state) => state.loading
);

export const selectCartError = createSelector(
  selectCartState,
  (state) => state.error
);
