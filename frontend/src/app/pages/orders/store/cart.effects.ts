import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, mergeMap, of, tap, withLatestFrom } from 'rxjs';
import { CartActions } from './cart.actions';
import { CartItem } from './cart.model';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Store } from '@ngrx/store';
import { selectCartItems } from './cart.selectors';

@Injectable()
export class CartEffects {
  constructor(
    private actions$: Actions,
    private store: Store,
    private snackBar: MatSnackBar
  ) {}

  /* Закоментовані ефекти для тимчасового відключення

  // Завантаження кошика з localStorage
  loadCart$ = createEffect(() => this.actions$.pipe(
    ofType(CartActions.loadCart),
    mergeMap(() => {
      try {
        const cartJson = localStorage.getItem('cart');
        const items: CartItem[] = cartJson ? JSON.parse(cartJson) : [];
        return of(CartActions.loadCartSuccess({ items }));
      } catch (error) {
        return of(CartActions.loadCartFailure({ error: 'Помилка завантаження кошика' }));
      }
    })
  ));

  // Збереження кошика в localStorage при зміні
  saveCart$ = createEffect(() => this.actions$.pipe(
    ofType(
      CartActions.saveCart
    ),
    withLatestFrom(this.store.select(selectCartItems)),
    tap(([action, items]) => {
      try {
        localStorage.setItem('cart', JSON.stringify(items));
      } catch (error) {
        console.error('Помилка збереження кошика', error);
      }
    })
  ), { dispatch: false });

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

  */
}
