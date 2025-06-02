import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, filter, map, mergeMap, of, switchMap, tap, withLatestFrom } from 'rxjs';
import { CartActions } from './cart.actions';
import { CartItem } from './cart.model';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Store } from '@ngrx/store';
import { selectCartItems } from './cart.selectors';
import { OrderService } from '../orders.service';

@Injectable()
export class CartEffects {
    private actions$ = inject(Actions);
    private store = inject(Store);
    private orderService = inject(OrderService); // 
    private snackBar= inject(MatSnackBar);

  /* Закоментовані ефекти для тимчасового відключення */

  // Завантаження кошика з localStorage
  // loadCart$ = createEffect(() => this.actions$.pipe(
  //   ofType(CartActions.loadCart),
  //   mergeMap(() => {
  //     try {
  //       const cartJson = localStorage.getItem('cart');
  //       const items: CartItem[] = cartJson ? JSON.parse(cartJson) : [];
  //       console.log('[load Card] effect', items);
  //       return of(CartActions.loadCartSuccess({ items }));
  //     } catch (error) {
  //       console.log('Помилка завантаження кошика', error);
  //       return of(CartActions.loadCartFailure({ error: 'Помилка завантаження кошика' }));
  //     }
  //   })
  // ));

  // Збереження кошика в localStorage при зміні
  // saveCart$ = createEffect(() => this.actions$.pipe(
  //   ofType(
  //     CartActions.saveCart
  //   ),
  //   withLatestFrom(this.store.select(selectCartItems)),
  //   tap(([action, items]) => {
  //     try {
  //       console.log('[save Cart] effect', items);
  //       localStorage.setItem('cart', JSON.stringify(items));
  //     } catch (error) {
  //       console.error('Помилка збереження кошика', error);
  //     }
  //   })
  // ), { dispatch: false });

  // Показ повідомлення при додаванні товару
  showAddNotification$ = createEffect(() => this.actions$.pipe(
    ofType(CartActions.addItem),
    tap(({ product }) => {
      this.snackBar.open(`Товар "${product.title}" додано до кошика`, 'Закрити', {
        duration: 3000
      });
    })
  ), { dispatch: false });

  // Показ повідомлення при видаленні товару
  showRemoveNotification$ = createEffect(() => this.actions$.pipe(
    ofType(CartActions.removeItem),
    tap(() => {
      this.snackBar.open('Товар видалено з кошика', 'Закрити', {
        duration: 3000
      });
    })
  ), { dispatch: false });

  // loadDraft$ = createEffect(() =>
    // this.actions$.pipe(
    //   ofType(CartActions.loadDraftOrder),
    //   switchMap(({ customerId }) =>
    //     this.orderService.getDraftOrder().pipe(
    //       map(order => CartActions.loadDraftOrderSuccess({ order })),
    //       catchError(error => of(CartActions.loadDraftOrderFailure({ error })))
    //     )
    //   )
    // )
  // );

  createDraft$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CartActions.loadDraftOrderFailure),
      // filter(error => error.includes('not found')), // або статус 404
      // withLatestFrom(this.store.select(selectCustomerId)),
      // switchMap(([_, customerId]) =>
      //   this.orderService.createDraftOrder(customerId).pipe(
      //     map(order => CartActions.createDraftOrderSuccess({ order })),
      //     catchError(error => of(CartActions.createDraftOrderFailure({ error })))
      //   )
      // )
    )
  );
/*  */
}
