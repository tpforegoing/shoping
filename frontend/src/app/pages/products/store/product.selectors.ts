import { createSelector } from '@ngrx/store';
import { productFeature } from './product.reducer';

export const selectProductState = productFeature.selectProductState;

export const selectProducts = productFeature.selectItems;
export const selectLoading = productFeature.selectLoading;
export const selectError = productFeature.selectError;
export const selectFilter = productFeature.selectFilter;

export const selectPagination = createSelector(
    productFeature.selectProductState,
  ({ count, next, previous }) => ({ count, next, previous })
);

export const selectProductById = (id: number) =>
  createSelector(
    selectProducts,
    (products) => products?.find(prod => prod.id === id) ?? null
  );

