import { Button, Card } from "@blueprintjs/core";
import { NextPage } from "next";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppointmentSelectors } from "src/redux/selectors/appointmentSelectors";
import AppointmentTypes from "src/redux/types/appointmentTypes";
import styles from "../../styles/pages/appointments/Requests.module.css";
import { AppointmentStatus, IAppointment } from "../../types/appointment";

const Requests: NextPage = () => {
  const [pendingAppointments, setPendingAppointments] = useState<
    IAppointment[]
  >([]);
  const dispatch = useDispatch();

  const appointments = useSelector(AppointmentSelectors.getAppointments);

  useEffect(() => {
    dispatch({ type: AppointmentTypes.READ_APPOINTMENTS });
  }, [dispatch]);

  useEffect(() => {
    const pendingAppointments = appointments
      .filter(
        (appointment: IAppointment) =>
          appointment.status == AppointmentStatus.PENDING_APPROVAL
      )
      .sort((appointment1: IAppointment, appointment2: IAppointment) => {
        return (
          new Date(appointment1.startTime).getTime() -
          new Date(appointment2.startTime).getTime()
        );
      });
    setPendingAppointments(pendingAppointments);
  }, [appointments, setPendingAppointments]);

  const handleAcceptButtonClick = (appointment: IAppointment): void => {
    const payload = { id: appointment.id, status: AppointmentStatus.ACCEPTED };
    dispatch({ type: AppointmentTypes.SET_APPOINTMENT_STATUS, payload });
  };

  return (
    <div className={styles.appointmentRequestsContainer}>
      <Card className={styles.appointmentRequestsCard}>
        <h2 className={styles.appointmentRequestsCardText}>
          Appointment Requests
        </h2>
        {pendingAppointments.length > 0 ? (
          pendingAppointments.map((appointment) => (
            <Card key={appointment.id.toString()}>
              <div>Appointment id: {appointment.id}</div>
              <div>
                Start time:{" "}
                {String(new Date(appointment.startTime).toLocaleString())}
              </div>
              <div>
                End time:{" "}
                {String(new Date(appointment.endTime).toLocaleString())}
              </div>
              <Button
                className={styles.appointmentRequestsAcceptButton}
                intent="primary"
                onClick={() => handleAcceptButtonClick(appointment)}
              >
                Accept
              </Button>
            </Card>
          ))
        ) : (
          <div className={styles.appointmentRequestsCardText}>
            No pending appointments
          </div>
        )}
      </Card>
    </div>
  );
};

export default Requests;
