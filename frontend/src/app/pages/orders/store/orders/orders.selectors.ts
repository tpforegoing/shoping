import { createSelector } from "@ngrx/store";
import { orderFeature } from "./orders.reducer";


export const selectOrdersState = orderFeature.selectOrdersState;

export const selectOrders = orderFeature.selectOrders;
export const selectLoading = orderFeature.selectLoading;
export const selectError = orderFeature.selectError;
export const selectParams = orderFeature.selectParams;

export const selectPagination = createSelector(
    selectOrdersState,
    ({ count, next, previous }) => ({ count, next, previous })
);

export const selectOrdersCount = createSelector(
    selectOrdersState,
    (state) => state.count
);

export const selectSelectedOrder = createSelector(
    selectOrdersState,
    (state) => state.selectedOrder
);