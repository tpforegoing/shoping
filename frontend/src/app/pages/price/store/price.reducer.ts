import { createFeature, createReducer, on } from '@ngrx/store';
import { ACTION_CREATE, ACTION_DELETE, ACTION_DETAILS, ACTION_LIST, ACTION_UPDATE, ErrorMessage } from '../../../store/store.model';
import { initialState } from './price.state';
import { PriceActions } from './price.actions';
import { Price } from '../price.model';

export const priceFeatureKey = 'price';

function mergeUnique(items: Price[]): Price[] {
    const seen = new Set<number>();
    return items.filter(item => {
      if (seen.has(item.id)) return false;
      seen.add(item.id);
      return true;
    });
  }

export const priceReducer = createReducer(
    initialState,
  
    // LOAD
    on(PriceActions.load, (state, { params }) => ({
      ...state,
      loading: true,
      filter: params.filter ?? '',
      isActiveFilter: params.isActive !== undefined ? params.isActive : state.isActiveFilter,
    })),
    on(PriceActions.loadSuccess, (state, { response }) => { 
        return{
          ...state,
          loading: false,
          items: response.results,
          count: response.count,
          next: response.next,
          previous: response.previous,
      }}
   ),
    on(PriceActions.loadMore, (state, { params  }) => ({
      ...state,
      filter: params.filter ?? '',
      isActiveFilter: params.isActive !== undefined ? params.isActive : state.isActiveFilter,
    })),

    on(PriceActions.loadMoreSuccess, (state, { response }) => ({
      ...state,
      loading: false,
      items: mergeUnique([...state.items, ...response.results]), 
      count: response.count,
      next: response.next,
      previous: response.previous,
    })),
    on(PriceActions.loadFailure, (state, { error }) => ({
      ...state,
      loading: false,
      error: { 
        source: ACTION_LIST, 
        message: error.message, 
        fieldErrors: error.fieldErrors ?? {} 
      },
    })),
    // Details
    on(PriceActions.details, (state) => ({
      ...state,
      loading: true,
    })),
    on(PriceActions.detailsSuccess, (state, { price }) => ({
      ...state,
      loading: false,
      items: [
        ...state.items.filter(c => c.id !== price.id),
        price
      ],
      error: null,
    })),
    on(PriceActions.detailsFailure, (state, { error }) => ({
      ...state,
      loading: false,
      error: {
        source: ACTION_DETAILS, 
        message: error.message, 
        fieldErrors: error.fieldErrors ?? {},
      },
    })),
    // CREATE
    on(PriceActions.create, (state) => ({
      ...state,
      error: null, // очищаємо перед новою спробою
      loading: true,
    })),
    on(PriceActions.createSuccess, (state, { price }) => ({
      ...state,
      loading: false,
      items: [price, ...state.items],
    })),
    on(PriceActions.createFailure, (state, { error }) => ({
      ...state,
      loading: false,
      error: { 
        source: ACTION_CREATE, 
        message: error.message, 
        fieldErrors: error.fieldErrors ?? {}, 
      },
    })),
  
    // UPDATE
    on(PriceActions.update, (state) => ({
      ...state,
      loading: true,
    })),
    on(PriceActions.updateSuccess, (state, { price }) => ({
      ...state,
      loading: false,
      items: state.items.map(c => (c.id === price.id ? price : c)),
    })),
    on(PriceActions.updateFailure, (state, { error }) => ({
      ...state,
      loading: false,
      error: { 
        source: ACTION_UPDATE, 
        message: error.message, 
        fieldErrors: error.fieldErrors ?? {}, 
      },
    })),
  
    // DELETE
    on(PriceActions.delete, (state) => ({
      ...state,
      loading: true,
    })),
    on(PriceActions.deleteSuccess, (state, { id }) => ({
      ...state,
      loading: false,
      items: state.items.filter(c => c.id !== id),
    })),
    on(PriceActions.deleteFailure, (state, { error }) => ({
      ...state,
      loading: false,
      error: {
        source: ACTION_DELETE, 
        message: error.message, 
        fieldErrors: error.fieldErrors ?? {},
      },
    })),
    // RESET ERROR status
    on(PriceActions.resetError, (state) => ({
      ...state,
      error: null,
    })),
    // SET ACTIVE FILTER
    on(PriceActions.setActiveFilter, (state, { isActive }) => ({
      ...state,
      isActiveFilter: isActive,
    })),
    // LOAD FOR PRODUCT
    on(PriceActions.loadForProduct, (state, { productId, params }) => ({
      ...state,
      loading: true,
      filter: params.filter ?? '',
      isActiveFilter: params.isActive !== undefined ? params.isActive : state.isActiveFilter,
      currentProductId: productId
    })),
    on(PriceActions.loadForProductSuccess, (state, { response }) => ({
      ...state,
      loading: false,
      items: response.results,
      count: response.count,
      next: response.next,
      previous: response.previous,
    })),
    on(PriceActions.loadForProductFailure, (state, { error }) => ({
      ...state,
      loading: false,
      error: { 
        source: ACTION_LIST, 
        message: error.message, 
        fieldErrors: error.fieldErrors ?? {} 
      },
    })),
);

export const priceFeature = createFeature({
    name: priceFeatureKey,
    reducer: priceReducer,
});
