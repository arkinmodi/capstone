import { readShopAppointments } from "@redux/actions/shopActions";
import { AuthSelectors } from "@redux/selectors/authSelectors";
import { ShopSelectors } from "@redux/selectors/shopSelector";
import styles from "@styles/pages/appointments/ShopAppointments.module.css";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppointmentStatus, IAppointment } from "../../../types/appointment";
import AppointmentCard from "./appointmentCard";

interface IAppointmentsProps {
  appointmentTab: AppointmentStatus;
}

const ShopAppointments = (props: IAppointmentsProps) => {
  const dispatch = useDispatch();

  const appointments = useSelector(ShopSelectors.getShopAppointments) ?? [];

  const { appointmentTab } = props;

  const [appointmentsMap, setAppointmentsMap] = useState<{
    [key: string]: Array<IAppointment>;
  }>({});

  const shopId = useSelector(AuthSelectors.getShopId);

  useEffect(() => {
    dispatch(readShopAppointments());
  }, [dispatch, shopId]);

  useEffect(() => {
    const appointmentsList = appointments
      .filter(
        (appointment: IAppointment) => appointment.status == appointmentTab
      )
      .sort((appointment1: IAppointment, appointment2: IAppointment) => {
        return (
          new Date(appointment1.startTime).getTime() -
          new Date(appointment2.startTime).getTime()
        );
      });

    //put the appointments in a map of lists depending on the date
    var appointmentsMap: { [key: string]: IAppointment[] } = {};

    for (var appointment of appointmentsList) {
      var date = new Date(appointment.startTime).toDateString();
      if (!(date in appointmentsMap)) {
        appointmentsMap[date] = [];
      }
      appointmentsMap[date]!.push(appointment);
    }
    setAppointmentsMap(appointmentsMap);
  }, [appointments, setAppointmentsMap, appointmentTab]);

  function listAppointmentCards(date: string) {
    let content: any = [];
    {
      appointmentsMap[date]!.forEach((appointment) => {
        content.push(
          <AppointmentCard
            key={appointment.id}
            appointment={appointment}
            appointmentProgress={appointmentTab}
          />
        );
      });
    }

    return content;
  }

  function noAppointmentsText() {
    let text = "";
    switch (appointmentTab) {
      case AppointmentStatus.PENDING_APPROVAL:
        return `No requested appointments.`;
      case AppointmentStatus.ACCEPTED:
        return `No scheduled appointments.`;
      case AppointmentStatus.IN_PROGRESS:
        return `No in progress appointments.`;
      case AppointmentStatus.COMPLETED:
        return `No completed appointments.`;
      default:
        return `No appointments.`;
    }
  }

  function listAllAppointments() {
    let content: any = [];
    Object.keys(appointmentsMap).forEach((date) => {
      content.push(
        <div key={date}>
          <h4>{date}</h4>
          {listAppointmentCards(date)}
        </div>
      );
    });

    return content;
  }

  return (
    <div>
      {Object.entries(appointmentsMap).length > 0 ? (
        listAllAppointments()
      ) : (
        <div className={styles.noAppointmentsText}>{noAppointmentsText()}</div>
      )}
    </div>
  );
};

export default ShopAppointments;
