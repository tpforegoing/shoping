import { createFeature, createReducer, on } from "@ngrx/store";
import { Customer } from "../clients.model";
import { initialCustomerState } from "./client.state";
import { CustomerActions } from "./client.actions";
import { ACTION_CREATE, ACTION_DELETE, ACTION_DETAILS, ACTION_LIST, ACTION_UPDATE } from "../../../store/store.model";


export const customerFeatureKey = 'customer';

function mergeUnique(items: Customer[]): Customer[]{
    const seen = new Set<number>();
    return items.filter(item => (seen.has(item.id)) ? false: true)
}

export const customerReducer = createReducer(
    initialCustomerState,
    // Load
    on(CustomerActions.load, (state, {params}) => ({
        ...state,
        loading: true,
        params: params,
        error: null,
    })),
    on(CustomerActions.loadSuccess, (state, {response}) => {
        return {
            ...state,
            items: response.results,
            count: response.count,
            next:  response.next,
            previous:  response.previous,
            loading: false,
            error: null,
        }
    }),
    on(CustomerActions.loadMore, (state, { params }) => ({
        ...state,
        params: params,
        error: null,
    })),
    on(CustomerActions.loadMoreSuccess, (state, { response }) => ({
        ...state,
        loading: false,
        items: mergeUnique([...state.items, ...response.results]),
        count: response.count,
        next:  response.next,
        previous:  response.previous,       
    })),
    on(CustomerActions.loadFailure, (state, { error }) =>({
        ...state,
        loading: false,
        error: {
            source: ACTION_LIST,
            message: error.message,
            fieldErrors: error.fieldErrors ?? {}
        },
    })),
    // Details
    on(CustomerActions.details, (state) => ({
        ...state,
        loading: true,
        error: null,
    })),
    on(CustomerActions.detailsSuccess, (state, { customer }) =>({
        ...state,
        items: [
            ...state.items.filter(c => c.id !== customer.id),
            customer
        ],
        loading: false,
        error: null,
    })),
    on(CustomerActions.detailsFailure, (state, { error }) => ({
        ...state,
        loading: false,
        error: {
        source: ACTION_DETAILS, 
        message: error.message, 
        fieldErrors: error.fieldErrors ?? {},
        },
    })),
    // CREATE
    on(CustomerActions.create, (state) => ({
      ...state,
      error: null, 
      loading: true,
    })),
    on(CustomerActions.createSuccess, (state, { customer }) => ({
      ...state,
      loading: false,
      items: [customer, ...state.items],
    })),
    on(CustomerActions.createFailure, (state, { error }) => ({
      ...state,
      loading: false,
      error: { 
        source: ACTION_CREATE, 
        message: error.message, 
        fieldErrors: error.fieldErrors ?? {}, 
      },
    })), 
    // UPDATE
    on(CustomerActions.update, (state) => ({
        ...state,
        loading: true,
    })),
    on(CustomerActions.updateSuccess, (state, { customer }) => ({
        ...state,
        loading: false,
        items: state.items.map(c => (c.id === customer.id ? customer : c)),
    })),
    on(CustomerActions.updateFailure, (state, { error }) => ({
        ...state,
        loading: false,
        error: { 
        source: ACTION_UPDATE, 
        message: error.message, 
        fieldErrors: error.fieldErrors ?? {}, 
        },
    })),  
    // DELETE
    on(CustomerActions.delete, (state) => ({
    ...state,
    loading: true,
    })),
    on(CustomerActions.deleteSuccess, (state, { id }) => ({
    ...state,
    loading: false,
    items: state.items.filter(c => c.id !== id),
    })),
    on(CustomerActions.deleteFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error: {
        source: ACTION_DELETE, 
        message: error.message, 
        fieldErrors: error.fieldErrors ?? {},
    },
    })),
    // RESET ERROR status
    on(CustomerActions.resetError, (state) => ({
      ...state,
      error: null,
    })),       
);

export const customerFeature = createFeature({
    name: customerFeatureKey,
    reducer: customerReducer,
})