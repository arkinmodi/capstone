import { IVehicle } from "src/types/vehicle";

export function getVehicleById(id: string): Promise<IVehicle | null> {
  return fetch(`/api/vehicle/` + id, {
    method: "GET",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  }).then((res) => {
    if (res.status === 200) {
      return res.json().then((data) => {
        const vehicle: IVehicle = {
          id: data.id,
          make: data.make,
          model: data.model,
          year: data.year,
          vin: data.vin,
          license_plate: data.license_plate,
        };
        return vehicle;
      });
    } else {
      // TODO: check and handle errors
      return null;
    }
  });
}
