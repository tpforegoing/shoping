import { inject } from '@angular/core';
import { catchError, map, of, switchMap, withLatestFrom, filter, tap } from 'rxjs';

import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';

import { CategoryActions } from './category.actions';
import { CategoryService } from '../categories.service';
import { selectPagination } from './category.selectors';
import { ActivatedRoute, Router } from '@angular/router';
import { ACTION_CREATE, ACTION_DELETE, ACTION_LIST, ACTION_UPDATE } from '../../../store/store.model';
import { extractFieldErrors } from '../../../share/extractFiledErrors';

/**
 * Extracts the page number from the 'next' URL, if available.
 * Витягнути номер сторінки з pagination.next URL:
 * Given a URL from the 'next' pagination link, this function returns the
 * page number as a number. If the URL is not available, or if the URL does
 * not contain a 'page' parameter, this function returns 1.
 */
function getPageFromNextUrl(url: string | null): number {
  if (!url) return 1;
  try {
    const params = new URL(url).searchParams;
    const page = params.get('page');
    return page ? +page : 1;
  } catch (e) {
    return 1;
  }
}

export class CategoriesEffects {
  private actions$ = inject(Actions);
  private service = inject(CategoryService);
  private store = inject(Store);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  loadCategories$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CategoryActions.load),
      switchMap(({ page = 1, filter = '' }) =>
        this.service.getCategories(page, filter).pipe(
          map(response => CategoryActions.loadSuccess({ response })),
          catchError(error => of(CategoryActions.loadFailure({
            error: { source: ACTION_LIST, message: error.error, fieldErrors: {} }, 
          },
          )))
        )
      )
    )
  );
  
  loadAll$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CategoryActions.loadAll),
      switchMap(({ page, filter }) =>
        this.service.getCategories(page, filter).pipe(
          map(response => CategoryActions.loadAllSuccess({ response })),
          catchError(error => of(CategoryActions.loadAllFailure({ 
            error: { source: ACTION_LIST, message: error.error, fieldErrors: {} }, 
          })))
        )
      )
    )
  );

  lazyLoadNextPage$ = createEffect(() =>       
  this.actions$.pipe(
    ofType(CategoryActions.loadAllSuccess),
    withLatestFrom(this.store.select(selectPagination)),
    filter(([_, pagination]) => pagination.next !== null),
    map(([_, pagination]) => {
      const nextPage = getPageFromNextUrl(pagination.next!);
      // console.log('[DEBUG] Наступна сторінка:', nextPage);
      // console.log('[DEBUG] Викликаємо loadAll для сторінки', nextPage);     
      return CategoryActions.loadAll({ page: nextPage, filter: '' });
    })
  )
);

  createCategory$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CategoryActions.create),
      switchMap(({ category }) =>
        this.service.createCategory(category).pipe(
          map(category => CategoryActions.createSuccess({ category })),
          catchError(error => {
            // console.log('[🔥 SERVER ERROR]', error);
            const { fieldErrors, message } = extractFieldErrors(error);
            // console.log('fieldErrors: ',fieldErrors, 'message', message)
            return of(CategoryActions.createFailure({ 
            error: {
               source: ACTION_CREATE, 
               message: message,
               fieldErrors: fieldErrors,
              }, 
            }))
          } 
        )
        )
      )
    )
  );

  updateCategory$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CategoryActions.update),
      switchMap(({ id, changes }) =>
        this.service.updateCategory(id, changes).pipe(
          map(category => CategoryActions.updateSuccess({ category })),
          catchError(error => {
            // console.log('[🔥 SERVER ERROR]', error);
            const { fieldErrors, message } = extractFieldErrors(error);
            // console.log('fieldErrors: ',fieldErrors, 'message', message)
            return of(CategoryActions.updateFailure({ 
            error: {
               source: ACTION_UPDATE, 
               message: message,
               fieldErrors: fieldErrors,
              }, 
            }))
          }
        )
      )
    )
  ));

  deleteCategory$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CategoryActions.delete),
      switchMap(({ id }) =>
        this.service.deleteCategory(id).pipe(
          map(() => CategoryActions.deleteSuccess({ id })),
          catchError(error => of(CategoryActions.deleteFailure({ 
            error: { source: ACTION_DELETE, message: error.error, fieldErrors: {} }, 
          })))
        )
      )
    )
  );
  
  navigateOnSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(CategoryActions.createSuccess, CategoryActions.updateSuccess),
        tap(() => {
          this.router.navigate(['/category']); // ✅ шлях до списку
        })
      ),
    { dispatch: false }
  );

  back$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CategoryActions.back),
      tap(({ queryParams }) => {
       this.router.navigate(['/category'], {queryParams});
      })
    ),
    { dispatch: false }
  );
  

}
