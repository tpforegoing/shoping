import { inject } from '@angular/core';
import { Router } from '@angular/router';

import { catchError, map, of, switchMap, tap } from 'rxjs';

import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';

import { ACTION_CREATE, ACTION_DELETE, ACTION_LIST, ACTION_UPDATE } from '../../../store/store.model';
import { extractFieldErrors } from '../../../share/extractFiledErrors';

import { PriceService } from '../price.service';
import { PriceActions } from './price.actions';
import { Price } from '../price.model';
import { ProductService } from '../../products/products.service';

export class PriceEffects {
  private actions$ = inject(Actions);
  private service = inject(PriceService);
  private productService = inject(ProductService);
//   private store = inject(Store);
  private router = inject(Router);


  loadPrices$ = createEffect(() =>
    this.actions$.pipe(
      ofType(PriceActions.load),
      switchMap(({ params }) =>
        this.service.getPrices(params).pipe(
          map(response => PriceActions.loadSuccess({ response })),
          catchError(error => of(PriceActions.loadFailure({
            error: { source: ACTION_LIST, message: error.error, fieldErrors: {} },
          })))
        )
      )
    )
  );

  loadMore$ = createEffect(() =>
    this.actions$.pipe(
      ofType(PriceActions.loadMore),
      switchMap(({ params }) =>
        this.service.getPrices(params).pipe(
          map(response => PriceActions.loadMoreSuccess({ response })),
          catchError(error => of(PriceActions.loadFailure({
            error: { source: ACTION_LIST, message: error.error, fieldErrors: {} },
          })))
        )
      )
    )
  );

  details$ = createEffect(() =>
    this.actions$.pipe(
      ofType(PriceActions.details),
      switchMap(({ id }) =>
        this.service.getById(id).pipe(
          // tap(price => console.log('[DEBUG] Price loaded:', price)),
          map(price => PriceActions.detailsSuccess({ price })),
          catchError(error => of(PriceActions.detailsFailure({ error })))
        )
      )
    )
  );

  createPrice$ = createEffect(() =>
    this.actions$.pipe(
      ofType(PriceActions.create),
      switchMap(({ price }) =>
        this.service.createPrice(price).pipe(
          map(price => PriceActions.createSuccess({ price })),
          catchError(error => {
            const { fieldErrors, message } = extractFieldErrors(error);
            return of(PriceActions.createFailure({
            error: {
               source: ACTION_CREATE,
               message: message,
               fieldErrors: fieldErrors,
              },
            }))
          })
        )
      )
    )
  );

  updatePrice$ = createEffect(() =>
    this.actions$.pipe(
      ofType(PriceActions.update),
      switchMap(({ id, changes }) =>
        this.service.updatePrice(id, changes).pipe(
          map(price => PriceActions.updateSuccess({ price })),
          catchError(error => {
            const { fieldErrors, message } = extractFieldErrors(error);
            return of(PriceActions.updateFailure({
            error: {
               source: ACTION_UPDATE,
               message: message,
               fieldErrors: fieldErrors,
              },
            }))
          })
        )
      )
    )
  );

  deletePrice$ = createEffect(() =>
    this.actions$.pipe(
      ofType(PriceActions.delete),
      switchMap(({ id }) =>
        this.service.deletePrice(id).pipe(
          map(() => PriceActions.deleteSuccess({ id })),
          catchError(error => of(PriceActions.deleteFailure({
            error: { source: ACTION_DELETE, message: error.error, fieldErrors: {} },
          })))
        )
      )
    )
  );

  navigateOnSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(PriceActions.createSuccess, PriceActions.updateSuccess),
        tap(() => {
          this.router.navigate(['/price']); // ✅ шлях до списку
        })
      ),
    { dispatch: false }
  );

  back$ = createEffect(() =>
    this.actions$.pipe(
      ofType(PriceActions.back),
      tap(({ queryParams }) => {
        // Створюємо копію параметрів без sourceUrl для передачі в навігацію
        const { sourceUrl, ...navigationParams } = queryParams || {};

        // Якщо є sourceUrl, повертаємося за цим URL
        if (sourceUrl && sourceUrl.startsWith('/product-details/')) {
          // Повернення на сторінку деталей продукту
          this.router.navigate([sourceUrl], { queryParams: navigationParams });
        } else {
          // За замовчуванням повертаємося на сторінку цін
          this.router.navigate(['/price'], { queryParams: navigationParams });
        }
      })
    ),
    { dispatch: false }
  );

  // Add this effect for loading prices for a specific product
  loadPricesForProduct$ = createEffect(() =>
    this.actions$.pipe(
      ofType(PriceActions.loadForProduct),
      switchMap(({ productId, params}) =>
        this.productService.getProductPrices(productId, params).pipe(
          map(response => PriceActions.loadForProductSuccess({ response })),
          catchError(error => of(PriceActions.loadForProductFailure({
            error: { source: ACTION_LIST, message: error.error, fieldErrors: {} },
          })))
        )
      )
    )
  );
}







