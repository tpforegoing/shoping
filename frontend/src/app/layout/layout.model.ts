import {ACTION_LIST ,ACTION_CREATE , ACTION_UPDATE , ACTION_DELETE } from '../store/store.model';

export type MenuAction =
  | typeof ACTION_LIST
  | typeof ACTION_CREATE
  | typeof ACTION_UPDATE
  | typeof ACTION_DELETE;

export type MenuItem = {
    icon: string;
    label: string;
    route: string;
    roles?: string[];
    actions?: MenuAction[];
}

export interface MenuState {
  items: MenuItem[];
  loading: boolean;
  error: string | null;
}

export interface Theme {
  id: string;
  primary: string;
  displayName: string;
}