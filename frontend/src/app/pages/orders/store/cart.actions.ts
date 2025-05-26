import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { CartItem } from './cart.model';
import { Product } from '../../products/products.model';

export const CartActions = createActionGroup({
  source: 'Cart',
  events: {
    'Add Item': props<{ product: Product, quantity: number }>(),
    'Remove Item': props<{ id: number }>(),
    'Update Quantity': props<{ id: number, quantity: number }>(),
    'Clear Cart': emptyProps(),
    'Load Cart': emptyProps(),
    'Load Cart Success': props<{ items: CartItem[] }>(),
    'Load Cart Failure': props<{ error: string }>(),
    'Save Cart': emptyProps(),
    'Save Cart Success': emptyProps(),
    'Save Cart Failure': props<{ error: string }>(),
  }
});
