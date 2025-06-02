import { inject, Injectable } from '@angular/core';
import { catchError, forkJoin, map, of, switchMap, tap } from 'rxjs';
import { Router } from '@angular/router';

import { Actions, createEffect, ofType } from '@ngrx/effects';

import { OrdersActions } from './orders.actions';
import { OrderService } from '../../orders.service';
import { ACTION_CREATE, 
        ACTION_DELETE, 
        ACTION_DETAILS, 
        ACTION_LIST, 
        ACTION_UPDATE } from '../../../../store/store.model';
import { OrderItemsSubmit } from '../../orders.model';

@Injectable()
export class OrdersEffects {
  private actions$ = inject(Actions);
  private service = inject(OrderService);
  private router = inject(Router);

  load$ = createEffect(() =>
    this.actions$.pipe(
      ofType(OrdersActions.load),
      switchMap(({ params }) =>
        this.service.getOrders(params).pipe(
          map(response => OrdersActions.loadSuccess({ response })),
          catchError(error =>
            of(OrdersActions.loadFailure({
              error: { source: ACTION_LIST, message: error.message, fieldErrors: error.error }
            }))
          )
        )
      )
    )
  );

  loadMore$ = createEffect(() =>
    this.actions$.pipe(
      ofType(OrdersActions.loadMore),
      switchMap(({ params }) =>
        this.service.getOrders(params).pipe(
          map(response => OrdersActions.loadMoreSuccess({ response })),
          catchError(error =>
            of(OrdersActions.loadFailure({
              error: { source: ACTION_LIST, message: error.message, fieldErrors: error.error }
            }))
          )
        )
      )
    )
  );

  details$ = createEffect(() =>
    this.actions$.pipe(
      ofType(OrdersActions.details),
      switchMap(({ id }) =>
        this.service.getById(id).pipe(
          map(order => OrdersActions.detailsSuccess({ order })),
          catchError(error =>
            of(OrdersActions.detailsFailure({
              error: { source: ACTION_DETAILS, message: error.message, fieldErrors: error.error }
            }))
          )
        )
      )
    )
  );

  loadByStatus$ = createEffect(() =>
    this.actions$.pipe(
      ofType(OrdersActions.loadByStatus),
      switchMap(({ status }) =>
        this.service.getOrderByStatus(status).pipe(
          map(response => OrdersActions.loadByStatusSuccess({ response })),
          catchError(error =>
            of(OrdersActions.loadByStatusFailure({
              error: {
                source: ACTION_LIST, message: 
                error.message, 
                fieldErrors: error.error 
              },
            }))
          )
        )
      )
    )
  );

  loadWithItems$ = createEffect(() =>
    this.actions$.pipe(
        ofType(OrdersActions.loadWithItems),
        switchMap(({ id }) =>
        this.service.getOrderItems(id).pipe(
            // tap(items => console.log('Log order:',items)),
            map(order => OrdersActions.detailsSuccess({ order })),
            catchError((error) =>
            of(OrdersActions.loadWithItemsFailure({
                error: {
                source: ACTION_LIST,
                message: error.message,
                fieldErrors: error.error
                }
            }))
            )
        )
        )
    )
  );

  // create$ = createEffect(() =>
  //   this.actions$.pipe(
  //     ofType(OrdersActions.create),
  //     switchMap(({ order }) =>
  //       this.service.createOrder(order).pipe(
  //         map(order => OrdersActions.createSuccess({ order })),
  //         catchError(error =>
  //           of(OrdersActions.createFailure({
  //             error: { source: ACTION_CREATE, message: error.message, fieldErrors: error.error }
  //           }))
  //         )
  //       )
  //     )
  //   )
  // );

  update$ = createEffect(() =>
    this.actions$.pipe(
      ofType(OrdersActions.update),
      switchMap(({ id, changes }) =>
        this.service.updateOrder(id, changes).pipe(
          map(order => OrdersActions.updateSuccess({ order })),
          catchError(error =>
            of(OrdersActions.updateFailure({
              error: { source: ACTION_UPDATE, message: error.message, fieldErrors: error.error }
            }))
          )
        )
      )
    )
  );

  delete$ = createEffect(() =>
    this.actions$.pipe(
      ofType(OrdersActions.delete),
      switchMap(({ id }) =>
        this.service.deleteOrder(id).pipe(
          map(() => OrdersActions.deleteSuccess({ id })),
          catchError(error =>
            of(OrdersActions.deleteFailure({
              error: { source: ACTION_DELETE, message: error.message, fieldErrors: error.error }
            }))
          )
        )
      )
    )
  );

createWithItems$ = createEffect(() =>
  this.actions$.pipe(
    ofType(OrdersActions.createWithItems),
    switchMap(({ customerId, items }) => {
      const payload: OrderItemsSubmit = {
      customer: customerId,
      status: 'submitted',
      items: items.map(item => ({
        product: item.product.id,
        quantity: item.quantity
      }))
    };

    return this.service.createOrder(payload).pipe(
      map(order => OrdersActions.createWithItemsSuccess({ order })),
      catchError(error => of(OrdersActions.createWithItemsFailure({
        error: {
          source: ACTION_CREATE,
          message: error.message,
          fieldErrors: error.error
        }
      })))
    );
    })
  )
);
  
  back$ = createEffect(() =>
    this.actions$.pipe(
      ofType(OrdersActions.back),
      tap(({ queryParams }) => {
          const { sourceUrl, ...navigationParams } = queryParams || {}; 
          if (sourceUrl) {
                this.router.navigate([sourceUrl], {queryParams: navigationParams})
            } else{ 
                this.router.navigate(['orders'], { queryParams })
            }
     })),
  );
  

}
