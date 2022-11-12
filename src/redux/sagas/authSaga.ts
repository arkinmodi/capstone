import {
  all,
  call,
  CallEffect,
  put,
  PutEffect,
  takeEvery,
} from "redux-saga/effects";
import {
  IAuthActionCreateLogin,
  IAuthActionCreateSignUp,
} from "../actions/authActions";
import AuthTypes from "../types/authTypes";

function* postLogin(body: any): Generator<boolean> {
  fetch("/api/auth/callback/credentials", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  }).then((res) => {
    if (res.status === 200) {
      return true;
    } else {
      // TODO: check and handle errors
      return false;
    }
  });
}

function* postSignUp(body: any): Generator<boolean> {
  console.log("redux body", body);
  fetch("/api/user/register", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  }).then((res) => {
    if (res.status === 200) {
      return true;
    } else {
      // TODO: check and handle errors
      return false;
    }
  });
}

function* login(
  action: IAuthActionCreateLogin
): Generator<CallEffect | PutEffect> {
  try {
    const isLoggedIn = yield call(postLogin, action.payload);
    yield put({ type: AuthTypes.SET_IS_LOGGED_IN, isLoggedIn });
  } catch (e) {
    yield put({ type: AuthTypes.SET_IS_LOGGED_IN, isLoggedIn: false });
  }
}

function* signUp(
  action: IAuthActionCreateSignUp
): Generator<CallEffect | PutEffect> {
  const payload = action.payload;
  const body = {
    callbackUrl: payload.callbackUrl,
    email: payload.email,
    password: payload.password,
    first_name: payload.firstName,
    last_name: payload.lastName,
    type: payload.type,
  };
  yield call(postSignUp, body);
}

/**
 * Saga to handle all auth related actions.
 */
export function* authSaga() {
  yield all([takeEvery(AuthTypes.CREATE_LOGIN, login)]);
  yield all([takeEvery(AuthTypes.CREATE_SIGN_UP, signUp)]);
}
