import { createSelector } from '@ngrx/store';
import { categoryFeature } from './category.reducer';

export const selectCategoryState = categoryFeature.selectCategoryState;

export const selectAllCategories = categoryFeature.selectItems;
export const selectLoading = categoryFeature.selectLoading;
export const selectError = categoryFeature.selectError;
export const selectFilter = categoryFeature.selectFilter;

export const selectPagination = createSelector(
  categoryFeature.selectCategoryState,
  ({ count, next, previous }) => ({ count, next, previous })
);

export const selectCategoryById = (id: number) =>
  createSelector(
    selectAllCategories,
    (categories) => categories?.find(cat => cat.id === id) ?? null
  );

