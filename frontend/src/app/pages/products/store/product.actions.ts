import { createActionGroup, emptyProps, props } from "@ngrx/store";

import { ErrorMessage, LoadParams, QueryParams } from "../../../store/store.model";
import { Product, ProductResponse, ProductSubmit } from "../products.model";

export const ProductActions = createActionGroup({
    source: 'Product',
    events: {
      // Пагінація
      'Load': props<{ params: LoadParams }>(),
      'Load Success': props<{ response: ProductResponse }>(),
      'Load More': props<{ params: LoadParams }>(),
      'Load More Success': props<{ response: ProductResponse }>(),
      'Load Failure': props<{ error: ErrorMessage }>(),

      // Lazy Load
      'Load All': props<{ page?: number; filter?: string }>(),
      'Load All Success': props<{ response: ProductResponse }>(),
      'Load All Failure': props<{ error: ErrorMessage }>(),
      
      'Details': props<{ id: number }>(),
      'Details Success': props<{ product: Product  }>(),
      'Details Failure': props<{ error: ErrorMessage }>(),

      'Create': props<{ product: Partial<ProductSubmit> }>(),
      'Create Success': props<{ product: Product  }>(),
      'Create Failure': props<{ error: ErrorMessage }>(),
  
      'Update': props<{ id: number; changes: Partial<ProductSubmit> }>(),
      'Update Success': props<{ product: Product }>(),
      'Update Failure': props<{ error: ErrorMessage }>(),
  
      'Delete': props<{ id: number }>(),
      'Delete Success': props<{ id: number }>(),
      'Delete Failure': props<{ error: ErrorMessage }>(),

      'Back': props<{ queryParams?: QueryParams }>(),
      'Reset Error': emptyProps(),
    }
  });
  