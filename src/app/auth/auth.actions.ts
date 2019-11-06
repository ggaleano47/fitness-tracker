import { Action } from '@ngrx/store';

export const SET_AUTENTICATED = '[Auth] Set Authenticated';
export const SET_UNAUTENTICATED = '[Auth] Set Unauthenticated';

export class SetAuthenticated implements Action {
  readonly type = SET_AUTENTICATED;
}
export class SetUnauthenticated implements Action {
  readonly type = SET_UNAUTENTICATED;
}

export type AuthActions = SetAuthenticated | SetUnauthenticated;
