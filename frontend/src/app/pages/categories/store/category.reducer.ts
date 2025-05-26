import { createFeature, createReducer, on } from '@ngrx/store';
import { CategoryActions } from './category.actions';
import { CategoryFull } from "../categories.model";
import { ACTION_CREATE, ACTION_DELETE, ACTION_LIST, ACTION_UPDATE, ErrorMessage } from '../../../store/store.model';

export const categoryFeatureKey = 'category';

export interface CategoryState {
    items: CategoryFull[];
    count: number;
    next: string | null;
    previous: string | null;
    loading: boolean;
    error: ErrorMessage | null;
    filter: string;
} 

export const initialState: CategoryState = {
    items: [],
    count: 0,
    next: null,
    previous: null,
    loading: false,
    error: null,
    filter: '',
  };

  export const categoryReducer = createReducer(
    initialState,
  
    // LOAD
    on(CategoryActions.load, (state, { filter }) => ({
      ...state,
      loading: true,
      filter: filter ?? '',
    })),

    on(CategoryActions.loadSuccess, (state, { response }) => { 
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

    on(CategoryActions.loadFailure, (state, { error }) => ({
      ...state,
      loading: false,
      error: { 
        source: ACTION_LIST, 
        message: error.message, 
        fieldErrors: error.fieldErrors ?? {} 
      },
    })),

     // Лейзі лоад
    on(CategoryActions.loadAll, (state) => ({
      ...state,
      loading: true,
    })),
    on(CategoryActions.loadAllSuccess, (state, { response }) => {
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
    
    on(CategoryActions.loadAllFailure, (state, { error }) => ({
      ...state,
      loading: false,
      error: { 
        source: ACTION_LIST, 
        message: error.message, 
        fieldErrors: error.fieldErrors ?? {} 
      },
    })),
    // CREATE
    on(CategoryActions.create, (state) => ({
      ...state,
      error: null, // очищаємо перед новою спробою
      loading: true,
    })),
    on(CategoryActions.createSuccess, (state, { category }) => ({
      ...state,
      loading: false,
      items: [category, ...state.items],
    })),
    on(CategoryActions.createFailure, (state, { error }) => ({
      ...state,
      loading: false,
      error: { 
        source: ACTION_CREATE, 
        message: error.message, 
        fieldErrors: error.fieldErrors ?? {}, 
      },
    })),
  
    // UPDATE
    on(CategoryActions.update, (state) => ({
      ...state,
      loading: true,
    })),
    on(CategoryActions.updateSuccess, (state, { category }) => ({
      ...state,
      loading: false,
      items: state.items.map(c => (c.id === category.id ? category : c)),
    })),
    on(CategoryActions.updateFailure, (state, { error }) => ({
      ...state,
      loading: false,
      error: { 
        source: ACTION_UPDATE, 
        message: error.message, 
        fieldErrors: error.fieldErrors ?? {}, 
      },
    })),
  
    // DELETE
    on(CategoryActions.delete, (state) => ({
      ...state,
      loading: true,
    })),
    on(CategoryActions.deleteSuccess, (state, { id }) => ({
      ...state,
      loading: false,
      items: state.items.filter(c => c.id !== id),
    })),
    on(CategoryActions.deleteFailure, (state, { error }) => ({
      ...state,
      loading: false,
      error: {
        source: ACTION_DELETE, 
        message: error.message, 
        fieldErrors: error.fieldErrors ?? {},
      },
    })),
    on(CategoryActions.resetError, (state) => ({
      ...state,
      error: null,
    }))
  );

export const categoryFeature = createFeature({
    name: categoryFeatureKey,
    reducer: categoryReducer,
});
