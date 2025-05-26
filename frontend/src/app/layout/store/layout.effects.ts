import { inject, Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { EMPTY, of } from 'rxjs';
import { map, switchMap, catchError, delay, exhaustMap, take } from 'rxjs/operators';
import { MenuItem } from '../layout.model';
import { MenuSidenavActions } from './layout.actions';
import { LayoutService } from '../layout.service';
import { selectAuthRole } from '../../auth/store/auth.selectors';

@Injectable()
export class MenuEffects {

    private actions$ = inject(Actions);
    private layoutService = inject(LayoutService);
    private store = inject(Store) 

    loadMenu$ = createEffect(() =>
      this.actions$.pipe(
        ofType(MenuSidenavActions.loadMenu),
        switchMap(() =>
          this.store.select(selectAuthRole).pipe( // отримуємо роль
            take(1),
            switchMap(role =>
              this.layoutService.getMenu(role).pipe(
                map(items => MenuSidenavActions.loadMenuSuccess({ items })),
                catchError(error => {
                  console.error('[MenuEffects] loadMenu error', error);
                  return EMPTY;
                })
              )
            )
          )
        )
      )
    );    
      
}
