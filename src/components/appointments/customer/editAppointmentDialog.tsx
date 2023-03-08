import { setAppointmentTime } from "@redux/actions/appointmentAction";
import { AppointmentSelectors } from "@redux/selectors/appointmentSelectors";
import styles from "@styles/components/appointments/EditAppointmentDialog.module.css";
import classnames from "classnames";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ScheduleMeeting, StartTimeEventEmit } from "react-schedule-meeting";
import { ICustomerAppointment } from "src/types/appointment";
import { IAvailabilitiesTime, IShopHoursOfOperation } from "src/types/shop";
import { getAvailabilities, getShopId } from "src/utils/shopUtil";

interface IEditAppointmentDialogProps {
  appointment: ICustomerAppointment;
  visible: boolean;
  onHide: () => void;
}

const EditAppointmentDialog = (props: IEditAppointmentDialogProps) => {
  const { appointment, visible, onHide } = props;
  const dispatch = useDispatch();

  const [availableTimeslots, setAvailableTimeslots] = useState<
    IAvailabilitiesTime[] | []
  >([]);
  const [allowSubmit, setAllowSubmit] = useState<boolean>(false);
  const [shopHours, setShopHours] = useState<IShopHoursOfOperation | null>(
    null
  );
  const [startTime, setStartTime] = useState<Date>(new Date());
  const [endTime, setEndTime] = useState<Date>(new Date());
  const customerAppointments = useSelector(
    AppointmentSelectors.getAppointments
  );
  // const [dialogIsOpen, setDialogIsOpen] = useState<boolean>(openDialog);

  useEffect(() => {
    const startDate = new Date(new Date().setHours(0, 0, 0, 0));
    const endDate = new Date(
      new Date(new Date().setDate(startDate.getDate() + 30)).setHours(
        23,
        59,
        59,
        59
      )
    );
    if (appointment) {
      getShopId(appointment.shopId).then((data) => {
        if (data?.hoursOfOperation) {
          getAvailabilities(
            appointment.shopId,
            startDate,
            endDate,
            data.hoursOfOperation
          ).then((data) => {
            if (data) {
              setAvailableTimeslots(data);
            }
          });
        }
      });
    }
  }, [appointment, customerAppointments]);

  const onTimeSelect = (e: StartTimeEventEmit) => {
    const duration = Math.abs(
      new Date(appointment.endTime).getTime() -
        new Date(appointment.startTime).getTime()
    );
    const startTime = e.startTime;
    const endTime = new Date(e.startTime.getTime() + Math.ceil(duration));

    setStartTime(startTime);
    setEndTime(endTime);
    setAllowSubmit(true);
  };

  const onSaveAppointment = () => {
    const body = {
      id: appointment.id,
      startTime: startTime.toISOString(),
      endTime: endTime.toISOString(),
    };
    dispatch(setAppointmentTime(body));
    onHide();
  };

  const renderEditAppointmentDialog = () => {
    return (
      <div className={styles.dialogInputCol}>
        <ScheduleMeeting
          borderRadius={10}
          primaryColor="#436188"
          backgroundColor="#f7f7f7"
          eventDurationInMinutes={Math.ceil(
            Math.abs(
              new Date(appointment?.endTime).getTime() -
                new Date(appointment?.startTime).getTime()
            ) / 60000
          )}
          availableTimeslots={availableTimeslots}
          onStartTimeSelect={onTimeSelect}
        />
        <div className={classnames(styles.dialogInputRow, styles.buttonRow)}>
          <Button className="blueButton" label="Cancel" onClick={onHide} />
          <Button
            className={classnames(styles.dialogButton, "greenButton")}
            label="Save"
            disabled={!allowSubmit}
            onClick={onSaveAppointment}
          />
        </div>
      </div>
    );
  };

  return (
    <div>
      <Dialog
        header="Edit Service Appointment"
        // call open the dialog from the edit button in customerAppointment
        visible={visible}
        onHide={onHide}
        className={styles.dialog}
      >
        {renderEditAppointmentDialog()}
      </Dialog>
    </div>
  );
};

export default EditAppointmentDialog;
