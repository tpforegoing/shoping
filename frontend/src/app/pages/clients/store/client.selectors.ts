import { createSelector } from "@ngrx/store";
import { customerFeature } from "./client.reducer";

export const selectCustomerState = customerFeature.selectCustomerState;

export const selectCustomers = customerFeature.selectItems;
export const selectLoading = customerFeature.selectLoading;
export const selectError = customerFeature.selectError;
export const selectParams = customerFeature.selectParams;

export const selectPagination = createSelector(
  selectCustomerState,
  ({ count, next, previous }) => ({ count, next, previous })
);

export const selectCustomersCount = createSelector(
  selectCustomerState,
  (state) => state.count
);

export const selectCustomerById = (id: number) =>
  createSelector(
    selectCustomers,
    (customers) => customers?.find(item => item.id === id) ?? null
);

export const selectCustomerLoading = createSelector(
  selectCustomerState,
  state => state.loading
);

export const selectCustomerError = createSelector(
  selectCustomerState,
  state => state.error
);