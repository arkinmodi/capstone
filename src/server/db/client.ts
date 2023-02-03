import {
  Customer,
  Employee,
  PrismaClient,
  Service,
  Shop,
  Vehicle,
} from "@prisma/client";
import { z } from "zod";

declare global {
  var prisma: PrismaClient | undefined;
}

export const prisma =
  global.prisma ||
  new PrismaClient({
    log:
      process.env.NODE_ENV === "development"
        ? ["query", "error", "warn"]
        : ["error"],
  });

if (process.env.NODE_ENV !== "production") {
  global.prisma = prisma;
}

export * from "@prisma/client";

export const partSchema = z.object({
  quantity: z.number().int(),
  cost: z.number(),
  name: z.string(),
  condition: z.enum(["NEW", "USED"]),
  build: z.enum(["OEM", "AFTER_MARKET"]),
});

const operatingDaySchema = z.object({
  isOpen: z.boolean(),
  openTime: z.string().datetime({ precision: 0 }),
  closeTime: z.string().datetime({ precision: 0 }),
});

export const hoursOfOperationSchema = z.object({
  monday: operatingDaySchema,
  tuesday: operatingDaySchema,
  wednesday: operatingDaySchema,
  thursday: operatingDaySchema,
  friday: operatingDaySchema,
  saturday: operatingDaySchema,
  sunday: operatingDaySchema,
});

export type PartType = z.infer<typeof partSchema>;

export type ServiceWithPartsType = {
  parts: PartType[];
} & Service;

export type CustomerWithVehiclesType = {
  vehicles: Vehicle[];
} & Customer;

export type EmployeeWithShopType = {
  shop: Shop;
} & Employee;
