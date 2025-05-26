import { createActionGroup, emptyProps, props } from "@ngrx/store";
import { ErrorMessage, LoadParams, QueryParams } from "../../../store/store.model";
import { Customer, CustomerResponse, CustomerSubmit } from "../clients.model";


export const CustomerActions = createActionGroup({
    source: 'Customer',
    events:{
        'Load' : props<{params: LoadParams}>(),
        'Load Success': props<{response: CustomerResponse}>(),
        'Load More': props<{ params: LoadParams }>(),
        'Load More Success': props<{ response: CustomerResponse }>(),
        'Load Failure': props<{ error: ErrorMessage }>(),

        'Details': props<{ id: number }>(),
        'Details Success': props<{ customer: Customer  }>(),
        'Details Failure': props<{ error: ErrorMessage }>(),

        'Create': props<{ customer: Partial<CustomerSubmit> }>(),
        'Create Success': props<{ customer: Customer  }>(),
        'Create Failure': props<{ error: ErrorMessage }>(),

        'Update': props<{ id: number; changes: Partial<CustomerSubmit> }>(),
        'Update Success': props<{ customer: Customer  }>(),
        'Update Failure': props<{ error: ErrorMessage }>(),

        'Delete': props<{ id: number }>(),
        'Delete Success': props<{ id: number }>(),
        'Delete Failure': props<{ error: ErrorMessage }>(),

        'Back': props<{ queryParams?: QueryParams }>(),
        'Reset Error': emptyProps(),
    }
})