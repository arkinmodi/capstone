import { configureStore } from "@reduxjs/toolkit";
import { Context, createWrapper } from "next-redux-wrapper";
import { Store } from "redux";
import createSagaMiddleware, { Task } from "redux-saga";
import { rootReducer } from "./reducers/rootReducer";
import { rootSaga } from "./sagas/rootSaga";
import {
  IAppointmentsState,
  initialAppointmentsState,
} from "./state/shop/appointmentState";
import { initialShopState, IShopState } from "./state/shop/shopState";
import { IAuthState, initialAuthState } from "./state/user/authState";

/**
 * Note: next-redux-wrapper automatically creates the store instances and ensures they all have the same state
 */

interface SagaStore extends Store {
  sagaTask?: Task;
}

export interface RootState {
  auth: IAuthState;
  appointments: IAppointmentsState;
  shop: IShopState;
}

const initialState = {
  auth: initialAuthState,
  appointments: initialAppointmentsState,
  shop: initialShopState,
};

export const makeStore = (_context: Context) => {
  const sagaMiddleware = createSagaMiddleware();

  const store = configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) => [
      ...getDefaultMiddleware(),
      sagaMiddleware,
    ],
    preloadedState: initialState,
  });

  (store as SagaStore).sagaTask = sagaMiddleware.run(rootSaga);

  return store;
};

export const wrapper = createWrapper(makeStore);
