import AppointmentTypes from "@redux/types/appointmentTypes";
import styles from "@styles/pages/appointments/ShopAppointments.module.css";
import classNames from "classnames";
import { Button } from "primereact/button";
import { Card } from "primereact/card";
import { useDispatch } from "react-redux";
import { AppointmentStatus, IAppointment } from "../../../types/appointment";

interface IAppointmentCardProps {
  appointment: IAppointment;
  appointmentProgress: AppointmentStatus;
}

const AppointmentCard = (props: IAppointmentCardProps) => {
  const dispatch = useDispatch();

  const { appointment, appointmentProgress } = props;

  const handleButtonClick = (
    appointment: IAppointment,
    status: AppointmentStatus
  ): void => {
    const payload = { id: appointment.id, status: status };
    dispatch({ type: AppointmentTypes.SET_APPOINTMENT_STATUS, payload });
  };

  const renderRequestedCardLeft = () => {
    return (
      <div className={styles.textAlign}>
        {/* TODO: Link to quote and pass in quote id */}
        <div className={styles.grayText}>View Quote </div>
        <div className={styles.flex}>
          <Button
            label="Reject"
            className={classNames(
              styles.appointmentButtonBlue,
              styles.buttonSize
            )}
            onClick={() =>
              handleButtonClick(appointment, AppointmentStatus.REJECTED)
            }
          />
          <Button
            label="Accept"
            className={classNames(
              styles.appointmentButtonGreen,
              styles.buttonSize
            )}
            onClick={() =>
              handleButtonClick(appointment, AppointmentStatus.ACCEPTED)
            }
          />
        </div>
        <div>Estimated Price:</div>
      </div>
    );
  };

  const renderScheduledCardLeft = () => {
    return (
      <div className={styles.textAlign}>
        {/* TODO: Link to quote and pass in quote id */}
        <div className={styles.grayText}>View Quote </div>
        <div className={styles.flex}>
          <Button
            label="Cancel"
            className={classNames(
              styles.appointmentButtonRed,
              styles.buttonSize
            )}
            onClick={() =>
              handleButtonClick(appointment, AppointmentStatus.REJECTED)
            }
          />
          <Button
            label="In Progress"
            className={classNames(
              styles.appointmentButtonGreen,
              styles.buttonSize
            )}
            onClick={() =>
              handleButtonClick(appointment, AppointmentStatus.IN_PROGRESS)
            }
          />
        </div>
        <div>Estimated Price:</div>
      </div>
    );
  };

  const renderInProgressCardLeft = () => {
    return (
      <div className={styles.textAlign}>
        <Button
          label="Complete"
          className={classNames(
            styles.appointmentButtonGreen,
            styles.buttonSize
          )}
          onClick={() =>
            handleButtonClick(appointment, AppointmentStatus.COMPLETED)
          }
        />
      </div>
    );
  };

  const renderCardLeft = (appointmentProgress: AppointmentStatus) => {
    switch (appointmentProgress) {
      case AppointmentStatus.PENDING_APPROVAL:
        return renderRequestedCardLeft();
      case AppointmentStatus.ACCEPTED:
        return renderScheduledCardLeft();
      case AppointmentStatus.IN_PROGRESS:
        return renderInProgressCardLeft();
      default:
    }
  };

  return (
    //TODO: Make card clickable so that it would go to the work order
    <Card className={styles.appointmentCard}>
      <div className={styles.cardContents}>
        <div>
          <h3 className={styles.h3}>{appointment.serviceName}</h3>
          <div>Customer Name:</div>
          <div>
            Start time: {new Date(appointment.startTime).toLocaleString()}
          </div>
          <div>
            End time: {String(new Date(appointment.endTime).toLocaleString())}
          </div>
          <div>Vehicle Make: {appointment.vehicle?.make}</div>
          <div>Vehicle Model: {appointment.vehicle?.model}</div>
          <div>Manufacture Year: {appointment.vehicle?.year.toString()}</div>
        </div>
        <div>{renderCardLeft(appointmentProgress)}</div>
      </div>
    </Card>
  );
};

export default React.memo(AppointmentCard);
