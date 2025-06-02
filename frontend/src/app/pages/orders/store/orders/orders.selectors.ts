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

export const selectOrderById = (id: number) =>
  createSelector(
    selectOrdersState,
    (state) => 
      // 1. Пошук у масиві orders[] (може бути після load/loadMore)
      state.orders.find(o => o.id === id) ||
      // 2. Якщо немає — перевірити selectedOrder (може бути після details)
      (state.selectedOrder?.id === id ? state.selectedOrder : null)
);

export const selectOrdersByStatus = (status: string) =>
  createSelector(
    selectOrders,
    (orders) => orders.filter(order => order.status === status)
);

export const selectSelectedOrderTotal = createSelector(
  selectSelectedOrder,
  (order) => {
    if (!order || !order.items) return 0;

    return order.items.reduce((total, item) => {
      const price = parseFloat(item.price_at_time) || 0;
      return total + price * item.quantity;
    }, 0);
  }
);