import {
  Appointment,
  AppointmentStatus,
  Service,
  ServiceType,
  Shop,
} from "@prisma/client";
import { IAppointmentTimes } from "src/types/appointment";
import { IService } from "src/types/service";
import {
  IAvailabilitiesTime,
  IShop,
  IShopHoursOfOperation,
} from "src/types/shop";

export function getShopId(id: string): Promise<IShop | null> {
  return fetch(`/api/shop/${id}`, {
    method: "GET",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  }).then((res) => {
    if (res.status === 200) {
      return res.json().then((data) => {
        const shop: IShop = {
          name: data.name,
          address: data.address,
          province: data.province,
          postalCode: data.postalCode,
          city: data.city,
          phoneNumber: data.phoneNumber,
          email: data.email,
          hoursOfOperation: data.hoursOfOperation,
        };
        return shop;
      });
    } else {
      // TODO: check and handle errors
      return null;
    }
  });
}

export function getServicesByShopId(
  shopId: string,
  type?: ServiceType
): Promise<IService[] | null> {
  const url =
    type != undefined
      ? `/api/shop/${shopId}/services/${type}`
      : `/api/shop/${shopId}/services`;

  return fetch(url, {
    method: "GET",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  }).then((res) => {
    if (res.status === 200) {
      return res.json().then((data) => {
        const services = data.map((service: Service) => {
          return {
            id: service.id,
            name: service.name,
            description: service.description,
            estimatedTime: service.estimatedTime,
            totalPrice: service.totalPrice,
            parts: service.parts,
            type: service.type,
          };
        });
        return services;
      });
    } else {
      // TODO: check and handle errors
      return null;
    }
  });
}

export function patchShop(shopId: string, patch: IShop): Promise<IShop | null> {
  const hoursOfOp = patch.hoursOfOperation;
  return fetch(`/api/shop/${shopId}`, {
    method: "PATCH",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name: patch.name,
      address: patch.address,
      postalCode: patch.postalCode,
      city: patch.city,
      province: patch.province,
      phoneNumber: patch.phoneNumber,
      hoursOfOperation:
        hoursOfOp != null
          ? {
              monday: {
                ...hoursOfOp.monday,
                openTime: hoursOfOp.monday.openTime,
                closeTime: hoursOfOp.monday.closeTime,
              },
              tuesday: {
                ...hoursOfOp.tuesday,
                openTime: hoursOfOp.tuesday.openTime,
                closeTime: hoursOfOp.tuesday.closeTime,
              },
              wednesday: {
                ...hoursOfOp.wednesday,
                openTime: hoursOfOp.wednesday.openTime,
                closeTime: hoursOfOp.wednesday.closeTime,
              },
              thursday: {
                ...hoursOfOp.thursday,
                openTime: hoursOfOp.thursday.openTime,
                closeTime: hoursOfOp.thursday.closeTime,
              },
              friday: {
                ...hoursOfOp.friday,
                openTime: hoursOfOp.friday.openTime,
                closeTime: hoursOfOp.friday.closeTime,
              },
              saturday: {
                ...hoursOfOp.saturday,
                openTime: hoursOfOp.saturday.openTime,
                closeTime: hoursOfOp.saturday.closeTime,
              },
              sunday: {
                ...hoursOfOp.sunday,
                openTime: hoursOfOp.sunday.openTime,
                closeTime: hoursOfOp.sunday.closeTime,
              },
            }
          : null,
      email: patch.email,
    }),
  }).then((res) => {
    if (res.status === 200) {
      return res.json().then((data) => {
        const shop: IShop = {
          name: data.name,
          address: data.address,
          province: data.province,
          postalCode: data.postalCode,
          city: data.city,
          phoneNumber: data.phoneNumber,
          email: data.email,
          hoursOfOperation: data.hoursOfOperation,
        };
        return shop;
      });
    } else {
      // TODO: check and handle errors
      return null;
    }
  });
}

export function getFilteredShops(
  name: string,
  isShop: boolean
): Promise<(IShop & { services: IService[] })[] | null> {
  const url = `/api/shop/lookup?name=${name}&shop=${isShop}`;

  return fetch(url, {
    method: "GET",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  }).then((res) => {
    if (res.status === 200) {
      return res.json().then((data) => {
        const shops = data.map((shop: Shop & { services: Service }) => {
          return {
            id: shop.id,
            name: shop.name,
            address: shop.address,
            postalCode: shop.postalCode,
            city: shop.city,
            province: shop.province,
            phoneNumber: shop.phoneNumber,
            hoursOfOperation: shop.hoursOfOperation,
            email: shop.email,
            services: shop.services,
          };
        });
        return shops;
      });
    } else {
      return null;
    }
  });
}

const mapDayToString: { [key: number]: string } = {
  0: "sunday",
  1: "monday",
  2: "tuesday",
  3: "wednesday",
  4: "thursday",
  5: "friday",
  6: "saturday",
};

export function getAvailabilities(
  shopId: string,
  startDate: Date,
  endDate: Date,
  hoursOfOperation: IShopHoursOfOperation | null
): Promise<IAvailabilitiesTime[] | null> {
  const url = `/api/shop/${shopId}/availabilities?start=${startDate.toString()}&end=${endDate.toString()}`;
  return fetch(url, {
    method: "GET",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  }).then((res) => {
    if (hoursOfOperation != null) {
      if (res.status === 200) {
        return res.json().then((data) => {
          // Gets appointments that are not `REJECTED`
          const appointments: IAppointmentTimes[] = data
            .filter((appointment: Appointment) => {
              return appointment.status !== AppointmentStatus.REJECTED;
            })
            .map((appointment: Appointment) => {
              return {
                startTime: new Date(appointment.startTime),
                endTime: new Date(appointment.endTime),
              };
            });

          let availabilities = [];
          let currentDate = startDate;
          while (currentDate < endDate) {
            // Checks availabilities for the day
            const currentBusy = appointments.filter(
              (appointment: IAppointmentTimes) => {
                return (
                  appointment.startTime.toDateString() ===
                  currentDate.toDateString()
                );
              }
            );
            // Find available timeslots from busy timeslots
            // Check if shop is open on day
            const day = mapDayToString[
              currentDate.getDay()
            ] as keyof IShopHoursOfOperation;
            if (hoursOfOperation[day].isOpen) {
              // Get opening hours
              const openTime = new Date(hoursOfOperation[day].openTime);
              const openHours = openTime.getHours();
              const openMinutes = openTime.getMinutes();
              let start = new Date(
                new Date(currentDate).setHours(openHours, openMinutes)
              );
              for (let i = 0; i < currentBusy.length; i++) {
                let end = new Date(currentBusy[i]!.startTime);

                if (end > start) {
                  availabilities.push({
                    startTime: start,
                    endTime: end,
                  });
                }
                start = new Date(currentBusy[i]!.endTime);
              }

              // Set closing time
              const closeTime = new Date(hoursOfOperation[day].closeTime);
              const closeHour = closeTime.getHours();
              const closeMinute = closeTime.getMinutes();

              availabilities.push({
                startTime: start,
                endTime: new Date(
                  new Date(start).setHours(closeHour, closeMinute)
                ),
              });
            }
            // Increment to next day
            currentDate.setDate(currentDate.getDate() + 1);
          }
          return availabilities;
        });
      } else {
        return null;
      }
    }
    return null;
  });
}
