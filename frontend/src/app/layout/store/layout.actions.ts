import { createActionGroup, emptyProps, props } from "@ngrx/store";
import { MenuItem } from "../layout.model";

export const MenuSidenavActions = createActionGroup({
  source: 'Menus Sibenav',
  events: {
    'Load Menu' : emptyProps(),
    "Load Menu Success": props<{ items: MenuItem[] }>(),
    "Load Menu Failure": props<{ error: string }>(),
    },
});
