import { Appointment } from "@prisma/client";
import {
  all,
  call,
  CallEffect,
  put,
  PutEffect,
  takeEvery,
} from "redux-saga/effects";
import { IAppointment } from "src/types/appointment";
import { IAppointmentActionSetAppointmentStatus } from "../actions/appointmentAction";
import AppointmentTypes from "../types/appointmentTypes";

function patchAppointmentStatus(
  content: IAppointmentActionSetAppointmentStatus["payload"]
): Promise<boolean> {
  return fetch(`/api/appointment/${content.id}`, {
    method: "PATCH",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ status: content.status }),
  }).then((res) => {
    if (res.status === 200) {
      return true;
    } else {
      // TODO: check and handle errors
      return false;
    }
  });
}

function getAllAppointments(): Promise<IAppointment[]> {
  //TODO: change to use endpoint with store ID
  return fetch(`/api/appointment/`, {
    method: "GET",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  }).then((res) => {
    if (res.status === 200) {
      return res.json().then((data) => {
        const appointments = data.map((appointment: Appointment) => {
          return {
            id: appointment.id,
            startTime: appointment.start_time,
            endTime: appointment.end_time,
            shopId: appointment.shop_id,
            customerId: appointment.customer_id,
            quoteId: appointment.quote_id,
            serviceType: appointment.service_type,
            price: appointment.price,
            status: appointment.status,
          };
        });
        return appointments;
      });
    } else {
      // TODO: check and handle errors
      return [];
    }
  });
}

function* setAppointmentStatus(
  action: IAppointmentActionSetAppointmentStatus
): Generator<CallEffect | PutEffect> {
  const success = yield call(patchAppointmentStatus, action.payload);
  if (success) {
    yield call(readAppointments);
  }
}

function* readAppointments(): Generator<CallEffect | PutEffect> {
  const appointments = yield call(getAllAppointments);
  yield put({
    type: AppointmentTypes.SET_APPOINTMENTS,
    payload: { appointments },
  });
}

/**
 * Saga to handle all appointment related actions.
 */
export function* appointmentSaga() {
  yield all([
    takeEvery(AppointmentTypes.SET_APPOINTMENT_STATUS, setAppointmentStatus),
    takeEvery(AppointmentTypes.READ_APPOINTMENTS, readAppointments),
  ]);
}
