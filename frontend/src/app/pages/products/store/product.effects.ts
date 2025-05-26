import { inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { catchError, map, of, switchMap, tap } from 'rxjs';

import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';

import { ACTION_CREATE, ACTION_DELETE, ACTION_LIST, ACTION_UPDATE } from '../../../store/store.model';
import { extractFieldErrors } from '../../../share/extractFiledErrors';
import { ProductService } from '../products.service';
import { ProductActions } from './product.actions';


export class ProductsEffects {
    private actions$ = inject(Actions);
    private service = inject(ProductService);
    private store = inject(Store);
    private router = inject(Router);
    // private route = inject(ActivatedRoute);

    loadProducts$ = createEffect(() =>
        this.actions$.pipe(
            ofType(ProductActions.load),
            switchMap(({ params }) =>
                this.service.getProducts(params).pipe(
                    map(response => ProductActions.loadSuccess({ response })),
                    catchError(error => of(ProductActions.loadFailure({
                    error: { source: ACTION_LIST, message: error.error, fieldErrors: {} }, 
                    },
                    )))
                )
            )
        )
    );

    loadMore$ = createEffect(() =>
        this.actions$.pipe(
          ofType(ProductActions.loadMore),
          switchMap(({ params }) =>
            this.service.getProducts( params ).pipe(
              map(response => ProductActions.loadMoreSuccess({ response })),
              catchError(error => of(ProductActions.loadFailure({ error })))
            )
          )
        )
    );

    details$ = createEffect(() =>
        this.actions$.pipe(
          ofType(ProductActions.details),
          switchMap(({ id }) =>
            this.service.getById(id).pipe(
              map(product => ProductActions.detailsSuccess({ product })),
              catchError(error => of(ProductActions.detailsFailure({ error })))
            )
          )
        )
      );

    createProduct$ = createEffect(() =>
    this.actions$.pipe(
        ofType(ProductActions.create),
        switchMap(({ product }) =>
            this.service.createProduct(product).pipe(
                map(product => ProductActions.createSuccess({ product })),
                catchError(error => {
                    const { fieldErrors, message } = extractFieldErrors(error);
                    return of(ProductActions.createFailure({ 
                    error: {
                        source: ACTION_CREATE, 
                        message: message,
                        fieldErrors: fieldErrors,
                        }, 
                    }))
                })
            )
        ))
    );

    updateProduct$ = createEffect(() =>
        this.actions$.pipe(
            ofType(ProductActions.update),
            switchMap(({ id, changes }) =>
                this.service.updateProduct(id, changes).pipe(
                    map(product => ProductActions.updateSuccess({ product })),
                    catchError(error => {
                        const { fieldErrors, message } = extractFieldErrors(error);
                        return of(ProductActions.updateFailure({ 
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

    deleteProduct$ = createEffect(() =>
        this.actions$.pipe(
            ofType(ProductActions.delete),
            switchMap(({ id }) =>
                this.service.deleteProduct(id).pipe(
                    map(() => ProductActions.deleteSuccess({ id })),
                    catchError(error => of(ProductActions.deleteFailure({ 
                    error: { source: ACTION_DELETE, message: error.error, fieldErrors: {} }, 
                    })))
                )
            )
        )
    );
   navigateOnSuccess$ = createEffect(
     () =>
       this.actions$.pipe(
         ofType(ProductActions.createSuccess, ProductActions.updateSuccess),
         tap(() => {
           this.router.navigate(['/products']); // ✅ шлях до списку
         })
       ),
     { dispatch: false }
   );
 
   back$ = createEffect(() =>
     this.actions$.pipe(
       ofType(ProductActions.back),
       tap(({ queryParams }) => {
          const { sourceUrl, ...navigationParams } = queryParams || {};
          if (sourceUrl) {
            const urlParts = sourceUrl.split('/');
            const id = urlParts[urlParts.length - 1];

            if (sourceUrl.startsWith('/product-details/') && navigationParams.itemId === +id) {
              const { itemId, ...restParams } = navigationParams;
              this.router.navigate([sourceUrl], { queryParams: restParams });
            } else {
              this.router.navigate([sourceUrl], { queryParams: navigationParams });
            }
          } else {
            this.router.navigate(['/products'], {queryParams: navigationParams });
          }
       })
     ),
     { dispatch: false }
   );   
}