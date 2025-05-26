import { createSelector } from '@ngrx/store';
import { priceFeature } from './price.reducer';

export const selectPriceState = priceFeature.selectPriceState;

export const selectPrices = priceFeature.selectItems;
export const selectLoading = priceFeature.selectLoading;
export const selectError = priceFeature.selectError;
export const selectFilter = priceFeature.selectFilter;
export const selectIsActiveFilter = priceFeature.selectIsActiveFilter;

export const selectPagination = createSelector(
  selectPriceState,
  ({ count, next, previous }) => ({ count, next, previous })
);

export const selectPriceCount = createSelector(
  selectPriceState,
  (state) => state.count
);

export const selectPriceById = (id: number) =>
  createSelector(
    selectPrices,
    (prices) => prices?.find(price => price.id === id) ?? null
  );

export const selectCurrentProductId = createSelector(
  selectPriceState,
  (state) => state.currentProductId
);

export const selectPricesForCurrentProduct = createSelector(
   selectPrices,
  (items) => items
);