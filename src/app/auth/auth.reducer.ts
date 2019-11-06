import { AuthActions, SET_AUTENTICATED, SET_UNAUTENTICATED } from './auth.actions';

export interface State {
  isAuthenticated: boolean;
}

const initialState: State = {
  isAuthenticated: false
};

export function authReducer( state = initialState, action: AuthActions) {
  switch (action.type) {
    case SET_AUTENTICATED:
      return {
        isAuthenticated: true
      };
    case SET_UNAUTENTICATED:
      return {
        isAuthenticated: false
      };
    default:
      return state;
  }
}

export const getIsAuth = (state: State) => state.isAuthenticated;
