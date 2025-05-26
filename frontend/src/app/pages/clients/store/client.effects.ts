import { inject } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { CustomerService } from "../clients.service";
import { Router } from "@angular/router";
import { CustomerActions } from "./client.actions";
import { catchError, map, of, switchMap, tap } from "rxjs";
import { ACTION_CREATE, ACTION_DELETE, ACTION_LIST, ACTION_UPDATE } from "../../../store/store.model";
import { customerReducer } from "./client.reducer";
import { extractFieldErrors } from "../../../share/extractFiledErrors";


export class CustomerEffects {
    private actions$ = inject(Actions);
    private service = inject(CustomerService);
    private router = inject(Router);

    load$ = createEffect (() =>
        this.actions$.pipe(
            ofType(CustomerActions.load),
            switchMap(({params}) => 
                this.service.getCustomers(params).pipe(
                    // tap(response => console.log('[DEBUG] Customer loaded:', response)), 
                    map(response => CustomerActions.loadSuccess({response})),
                    catchError(error => of(CustomerActions.loadFailure({
                        error: {source: ACTION_LIST, message: error.error, fieldErrors:{}},
                    })))
                )
            )
        )
    );

    loadMore$ = createEffect(() =>
        this.actions$.pipe(
            ofType(CustomerActions.loadMore),
            switchMap( ({ params }) =>
                this.service.getCustomers(params).pipe(
                    map(response => CustomerActions.loadMoreSuccess( { response })),
                    catchError(error => of(CustomerActions.loadFailure({
                        error: {source: ACTION_LIST, message: error.error, fieldErrors:{}},
                    })))
                )
            )
        )
    );

    details$ = createEffect(() =>
        this.actions$.pipe(
            ofType(CustomerActions.details),
            switchMap (({ id }) =>
                this.service.getById(id).pipe(
                    map(customer => CustomerActions.detailsSuccess({ customer })),
                    catchError(error => of (CustomerActions.detailsFailure({error}))),
                )
            )
        )
    );

    create$ = createEffect(() => 
        this.actions$.pipe(
            ofType(CustomerActions.create),
            switchMap( ({customer}) =>
                this.service.createCustomer(customer).pipe(
                    map(customer => CustomerActions.createSuccess( { customer})),
                    catchError( error => {
                        const { fieldErrors, message } = extractFieldErrors(error);
                        return of( CustomerActions.createFailure( {
                            error: {
                                source: ACTION_CREATE,
                                message: message,
                                fieldErrors: fieldErrors,
                            }
                        }))
                    })
                )
            )
        )
    );

    update$ = createEffect(() =>
        this.actions$.pipe(
            ofType(CustomerActions.update),
            switchMap(({ id, changes}) =>
                this.service.updateCustomer(id, changes).pipe(
                    map( customer => CustomerActions.updateSuccess({ customer })),
                    catchError( error => {
                        const { fieldErrors, message } = extractFieldErrors(error);
                        return of( CustomerActions.updateFailure( {
                            error: {
                                source: ACTION_UPDATE,
                                message: message,
                                fieldErrors: fieldErrors,
                            }
                        }))
                    })
                )
            )
        )
    );

    delete$ = createEffect(() => 
        this.actions$.pipe(
            ofType(CustomerActions.delete),
            switchMap(({id}) =>
                this.service.deleteCustomer(id).pipe(
                    map(() => CustomerActions.deleteSuccess({id})),
                    catchError( error => 
                        of(CustomerActions.deleteFailure({
                            error: { 
                                source: ACTION_DELETE,
                                message: error.error,
                                fieldErrors: {}
                            }
                        }))
                    )
                )
            )
        )
    );

    navigateOnSuccess$ = createEffect(() =>
        this.actions$.pipe(
            ofType(CustomerActions.createSuccess, CustomerActions.updateSuccess),
            tap(() => {
                this.router.navigate(['/customer']); // ✅ шлях до списку
            })
        ),
        { dispatch: false }
    );

    back$ = createEffect(()=>
        this.actions$.pipe(
            ofType(CustomerActions.back),
            tap(({ queryParams }) => {
                const {sourceUrl, ...navigationParams} = queryParams || {}
                if (sourceUrl) {
                    this.router.navigate([sourceUrl], {queryParams: navigationParams})
                } else{
                    this.router.navigate(['/customer'], {queryParams: navigationParams})
                }
            })
        )
    )

}