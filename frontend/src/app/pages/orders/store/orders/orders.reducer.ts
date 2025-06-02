import { createFeature, createReducer, on } from '@ngrx/store';
import { OrdersActions } from './orders.actions';
import { OrdersState, initialOrdersState } from './orders.state';
import { ACTION_CREATE, ACTION_DETAILS, ACTION_LIST } from '../../../../store/store.model';


export const orderFeatureKey = 'orders';

export const ordersReducer = createReducer(
    initialOrdersState,

    // Load + Load More
    on(OrdersActions.load, OrdersActions.loadMore, (state, { params }) => ({
        ...state,
        loading: true,
        error: null,
        params: params,
    })),

    on(OrdersActions.loadSuccess, (state, { response }) => ({
        ...state,
        orders: response.results,
        count: response.count,
        next: response.next,
        previous: response.previous,
        loading: false,
    })),

    on(OrdersActions.loadMoreSuccess, (state, { response }) => ({
        ...state,
        orders: [...state.orders, ...response.results],
        count: response.count,
        next: response.next,
        previous: response.previous,
        loading: false,
    })),

    on(OrdersActions.loadFailure, (state, { error }) => ({
        ...state,
        loading: false,
        error: {
                    source: ACTION_LIST,
                    message: error.message,
                    fieldErrors: error.fieldErrors ?? {}
                },
    })),

    // Details
    on(OrdersActions.details, (state) => ({
        ...state,
        loading: true,
        error: null,
    })),

    on(OrdersActions.detailsSuccess, (state, { order }) => ({
        ...state,
        selectedOrder: order,
        loading: false,
        error: null,
    })),

    on(OrdersActions.detailsFailure, (state, { error }) => ({
        ...state,
        loading: false,
        error: {
            source: ACTION_DETAILS, 
            message: error.message, 
            fieldErrors: error.fieldErrors ?? {},
        },
    })),
    // перелік замовлень по статусу
    on(OrdersActions.loadByStatus, (state) => ({
        ...state,
        loading: true,
        error: null,
    })),
    on(OrdersActions.loadByStatusSuccess, (state, { response }) => ({
        ...state,
        orders: response.results,
        count: response.count,
        next: response.next,
        previous: response.previous,
        loading: false,
        error: null
    })),
    on(OrdersActions.loadByStatusFailure, (state, { error }) => ({
        ...state,
        loading: false,
        error: {
                    source: ACTION_LIST,
                    message: error.message,
                    fieldErrors: error.fieldErrors ?? {}
                },
    })),

    // Замовлення з переліком продуктів
    on(OrdersActions.loadWithItems, (state) => ({
        ...state,
        loading: true,
        error: null,
    })),

    on(OrdersActions.loadWithItemsSuccess, (state, { order }) => ({
        ...state,
        selectedOrder: order,
        loading: false,
        error: null,
    })),

    on(OrdersActions.loadWithItemsFailure, (state, { error }) => ({
        ...state,
        loading: false,
        error: {
            source: ACTION_DETAILS, 
            message: error.message, 
            fieldErrors: error.fieldErrors ?? {},
        },
    })),
    // Create
    on(OrdersActions.create, (state) => ({
        ...state,
        loading: true,
        error: null,
    })),
    on(OrdersActions.createSuccess, (state, { order }) => ({
        ...state,
        loading: false,
        orders: [order, ...state.orders],
        count: state.count + 1,
    })),
    on(OrdersActions.createFailure, (state, { error }) => ({
        ...state,
        loading: false,
        error: { 
            source: ACTION_CREATE, 
            message: error.message, 
            fieldErrors: error.fieldErrors ?? {}, 
        },
    })), 
    // Update
    on(OrdersActions.update, (state) => ({
        ...state,
        loading: true,
        error: null,
    })),
    on(OrdersActions.updateSuccess, (state, { order }) => ({
        ...state,
        loading: false,
        orders: state.orders.map(o => o.id === order.id ? order : o),
        selectedOrder: state.selectedOrder?.id === order.id ? order : state.selectedOrder,
    })),
    on(OrdersActions.updateFailure, (state, { error }) => ({
        ...state,
        loading: false,
        error: {
            source: ACTION_CREATE,
            message: error.message,
            fieldErrors: error.fieldErrors ?? {},
        },
    })),

    // Delete
    on(OrdersActions.delete, (state) => ({
        ...state,
        loading: true,
        error: null,
    })),
    on(OrdersActions.deleteSuccess, (state, { id }) => ({
        ...state,
        loading: false,
        orders: state.orders.filter(o => o.id !== id),
        count: state.count - 1,
        selectedOrder: state.selectedOrder?.id === id ? null : state.selectedOrder,
    })),
    on(OrdersActions.deleteFailure, (state, { error }) => ({
        ...state,
        loading: false,
        error: {
            source: ACTION_CREATE,
            message: error.message,
            fieldErrors: error.fieldErrors ?? {},
        },
    })),

    // Додавання позицій в кошик
    on(OrdersActions.createWithItems, (state) => ({
        ...state,
        loading: true,
        error: null
    })),
    on(OrdersActions.createWithItemsSuccess, (state, { order }) => ({
        ...state,
        selectedOrder: order,
        orders: [order, ...state.orders], // якщо хочеш додати до списку
        loading: false
    })),
    on(OrdersActions.createWithItemsFailure, (state, { error }) => ({
        ...state,
        loading: false,
        error: {
            source: ACTION_CREATE,
            message: error.message,
            fieldErrors: error.fieldErrors ?? {},
        },
    })),

    
    // Reset
    on(OrdersActions.reset, () => initialOrdersState)
);

export const orderFeature = createFeature({
    name: orderFeatureKey,
    reducer: ordersReducer,
})