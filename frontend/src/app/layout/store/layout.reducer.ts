import { createFeature, createReducer, on } from "@ngrx/store";
import { MenuState } from "../layout.model";
import { MenuSidenavActions } from "./layout.actions";

export const menuFeatureKey = 'menusidenav';

export const initialState: MenuState = {
    items: [],
    loading: false,
    error: null,
  };
  
export const menuReducer = createReducer(
    initialState,
    on(MenuSidenavActions.loadMenu, state => ({ ...state, loading: true })),
    on(MenuSidenavActions.loadMenuSuccess, (state, { items }) => ({ ...state, loading: false, items })),
    on(MenuSidenavActions.loadMenuFailure, (state, { error }) => ({ ...state, loading: false, error })),
);


export const menuFeature = createFeature({
  name: menuFeatureKey,
  reducer: menuReducer,
});
