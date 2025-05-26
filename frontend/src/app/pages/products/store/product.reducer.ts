import { createFeature, createReducer, on } from '@ngrx/store';
import { ACTION_CREATE, ACTION_DELETE, ACTION_DETAILS, ACTION_LIST, ACTION_UPDATE, ErrorMessage } from '../../../store/store.model';
import { Product } from '../products.model';
import { ProductActions } from './product.actions';

export const productFeatureKey = 'product';

export interface ProductState {
    items: Product[];
    count: number;
    next: string | null;
    previous: string | null;
    loading: boolean;
    error: ErrorMessage | null;
    filter: string;
} 

export const initialState: ProductState = {
    items: [],
    count: 0,
    next: null,
    previous: null,
    loading: false,
    error: null,
    filter: '',
  };

  export const productReducer = createReducer(
    initialState,
  
    // LOAD
    on(ProductActions.load, (state, { params }) => ({
      ...state,
      loading: true,
      filter: params.filter ?? '',
    })),
    on(ProductActions.loadSuccess, (state, { response }) => { 
        // console.log('[DEBUG] LoadAllSuccess Response:', response);
        return{
          ...state,
          loading: false,
          items: response.results,
          count: response.count,
          next: response.next,
          previous: response.previous,
      }}
   ),

   on(ProductActions.loadMore, (state, { params }) => ({
      ...state,
      filter: params.filter ?? '',
    })),

    on(ProductActions.loadMoreSuccess, (state, { response }) => ({
      ...state,
      loading: false,
      items: mergeUnique([...state.items, ...response.results]), 
      count: response.count,
      next: response.next,
      previous: response.previous,
    })),

    on(ProductActions.loadFailure, (state, { error }) => ({
      ...state,
      loading: false,
      error: { 
        source: ACTION_LIST, 
        message: error.message, 
        fieldErrors: error.fieldErrors ?? {} 
      },
    })),

     // Лейзі лоад
    on(ProductActions.loadAll, (state) => ({
      ...state,
      loading: true,
    })),

    on(ProductActions.loadAllSuccess, (state, { response }) => {
      const existingIds = new Set(state.items.map(item => item.id));
      const newItems = response.results.filter(item => !existingIds.has(item.id));
    
      return {
        ...state,
        loading: false,
        items: [...state.items, ...newItems],
        count: response.count,
        next: response.next,
        previous: response.previous,
      };
    }),
    
    on(ProductActions.loadAllFailure, (state, { error }) => ({
      ...state,
      loading: false,
      error: { 
        source: ACTION_LIST, 
        message: error.message, 
        fieldErrors: error.fieldErrors ?? {} 
      },
    })),
    // Get by ID
    on(ProductActions.details, (state) => ({
      ...state,
      loading: true,
    })),
    on(ProductActions.detailsSuccess, (state, { product }) => ({
      ...state,
      loading: false,
      items: [
        ...state.items.filter(c => c.id !== product.id),
        product
      ],
      error: null,
    })),
    on(ProductActions.detailsFailure, (state, { error }) => ({
      ...state,
      loading: false,
      error: {
        source: ACTION_DETAILS, 
        message: error.message, 
        fieldErrors: error.fieldErrors ?? {},
      },
    })),
    // CREATE
    on(ProductActions.create, (state) => ({
      ...state,
      error: null, // очищаємо перед новою спробою
      loading: true,
    })),
    on(ProductActions.createSuccess, (state, { product }) => ({
      ...state,
      loading: false,
      items: [product, ...state.items],
    })),
    on(ProductActions.createFailure, (state, { error }) => ({
      ...state,
      loading: false,
      error: { 
        source: ACTION_CREATE, 
        message: error.message, 
        fieldErrors: error.fieldErrors ?? {}, 
      },
    })),
  
    // UPDATE
    on(ProductActions.update, (state) => ({
      ...state,
      loading: true,
    })),
    on(ProductActions.updateSuccess, (state, { product }) => ({
      ...state,
      loading: false,
      items: state.items.map(c => (c.id === product.id ? product : c)),
    })),
    on(ProductActions.updateFailure, (state, { error }) => ({
      ...state,
      loading: false,
      error: { 
        source: ACTION_UPDATE, 
        message: error.message, 
        fieldErrors: error.fieldErrors ?? {}, 
      },
    })),
  
    // DELETE
    on(ProductActions.delete, (state) => ({
      ...state,
      loading: true,
    })),
    on(ProductActions.deleteSuccess, (state, { id }) => ({
      ...state,
      loading: false,
      items: state.items.filter(c => c.id !== id),
    })),
    on(ProductActions.deleteFailure, (state, { error }) => ({
      ...state,
      loading: false,
      error: {
        source: ACTION_DELETE, 
        message: error.message, 
        fieldErrors: error.fieldErrors ?? {},
      },
    })),
    on(ProductActions.resetError, (state) => ({
      ...state,
      error: null,
    }))
  );

export const productFeature = createFeature({
    name: productFeatureKey,
    reducer: productReducer,
});

// 🔧 Унікальне злиття по ID
function mergeUnique(items: Product[]): Product[] {
  const seen = new Set<number>();

  return items.filter(item => {
    if (seen.has(item.id)) return false;
    seen.add(item.id);
    return true;
  });
}
