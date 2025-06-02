import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { Order, OrderItem, OrderItemSubmit, OrderResponse, OrderSubmit } from '../../orders.model';
import { ErrorMessage, LoadParams, QueryParams } from '../../../../store/store.model';
import { CartItem } from '../cart.model';


export const OrdersActions = createActionGroup({
  source: 'Orders',
  events: {
    'Load': props<{ params: LoadParams }>(),
    'Load Success': props<{ response: OrderResponse }>(),
    'Load More': props<{ params: LoadParams }>(),
    'Load More Success': props<{ response: OrderResponse }>(),
    'Load Failure': props<{ error: ErrorMessage }>(),

    'Details': props<{ id: number }>(),
    'Details Success': props<{ order: Order  }>(),
    'Details Failure': props<{ error: ErrorMessage }>(),

    'Load With Items': props<{ id: number }>(),
    'Load With Items Success': props<{ order: Order }>(),
    'Load With items Failure': props<{ error: ErrorMessage }>(),

    'Load By Status': props<{ status: string}>(),
    'Load By Status Success': props<{ response: OrderResponse }>(),
    'Load By Status Failure': props<{ error: ErrorMessage }>(),

    'Create': props<{ order: Partial<OrderSubmit> }>(),
    'Create Success': props<{ order: Order  }>(),
    'Create Failure': props<{ error: ErrorMessage }>(),

    'Update': props<{ id: number; changes: Partial<OrderSubmit> }>(),
    'Update Success': props<{ order: Order  }>(),
    'Update Failure': props<{ error: ErrorMessage }>(),

    'Delete': props<{ id: number }>(),
    'Delete Success': props<{ id: number }>(),
    'Delete Failure': props<{ error: ErrorMessage }>(),

    'Create With Items': props<{ customerId: number; items: CartItem[] }>(),
    'Create With Items Success': props<{ order: Order }>(),
    'Create With Items Failure': props<{ error: ErrorMessage }>(),

    'Back': props<{ queryParams?: QueryParams }>(),
    'Reset': emptyProps(),
  },
});
