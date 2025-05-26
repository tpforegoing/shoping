import { createActionGroup, emptyProps, props } from "@ngrx/store";
import { CategoryFull, CategoryResponse } from "../categories.model";
import { ErrorMessage } from "../../../store/store.model";

export const CategoryActions = createActionGroup({
    source: 'Category',
    events: {
      // Пагінація
      'Load': props<{ page?: number; filter?: string }>(),
      'Load Success': props<{ response: CategoryResponse }>(),
      'Load Failure': props<{ error: ErrorMessage }>(),
      // Lazy Load
      'Load All': props<{ page?: number; filter?: string }>(),
      'Load All Success': props<{ response: CategoryResponse }>(),
      'Load All Failure': props<{ error: ErrorMessage }>(),
  
      'Create': props<{ category: Partial<CategoryFull> }>(),
      'Create Success': props<{ category: CategoryFull  }>(),
      'Create Failure': props<{ error: ErrorMessage }>(),
  
      'Update': props<{ id: number; changes: Partial<CategoryFull> }>(),
      'Update Success': props<{ category: CategoryFull  }>(),
      'Update Failure': props<{ error: ErrorMessage }>(),
  
      'Delete': props<{ id: number }>(),
      'Delete Success': props<{ id: number }>(),
      'Delete Failure': props<{ error: ErrorMessage }>(),

      'Back': props<{ queryParams?: { page?: number; filter?: string } }>(),
      'Reset Error': emptyProps(),
    }
  });
  