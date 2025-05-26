import { createActionGroup, emptyProps, props } from "@ngrx/store";

import { ErrorMessage, LoadParams, QueryParams } from "../../../store/store.model";
import { Price, PriceResponse, PriceSubmit } from "../price.model";


export const PriceActions = createActionGroup({
    source: 'Price',
    events: {
      // Пагінація
      'Load': props<{ params: LoadParams }>(),
      'Load Success': props<{ response: PriceResponse }>(),
      'Load More': props<{ params: LoadParams }>(),
      'Load More Success': props<{ response: PriceResponse }>(),
      'Load Failure': props<{ error: ErrorMessage }>(),
      'Set Active Filter': props<{ isActive: boolean | null }>(),

      'Details': props<{ id: number }>(),
      'Details Success': props<{ price: Price  }>(),
      'Details Failure': props<{ error: ErrorMessage }>(),

      'Create': props<{ price: Partial<PriceSubmit> }>(),
      'Create Success': props<{ price: Price  }>(),
      'Create Failure': props<{ error: ErrorMessage }>(),

      'Update': props<{ id: number; changes: Partial<PriceSubmit> }>(),
      'Update Success': props<{ price: Price  }>(),
      'Update Failure': props<{ error: ErrorMessage }>(),

      'Delete': props<{ id: number }>(),
      'Delete Success': props<{ id: number }>(),
      'Delete Failure': props<{ error: ErrorMessage }>(),

      'Load For Product': props<{ productId: number; params: LoadParams }>(),
      'Load For Product Success': props<{ response: PriceResponse }>(),
      'Load For Product Failure': props<{ error: ErrorMessage }>(),

      'Back': props<{ queryParams?: QueryParams }>(),
      'Reset Error': emptyProps(),
    }
  });


