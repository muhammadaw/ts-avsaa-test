import { PrismaClient } from "@prisma/client";

export const prisma = new PrismaClient();

export async function checkVoucherExists(flightNumber: string, flightDate: string): Promise<boolean> {
  const count = await prisma.voucher.count({
    where: {
      flight_number: flightNumber,
      flight_date: flightDate,
    },
  });
  return count > 0;
}

export interface CreateVoucherParams {
  crewName: string;
  crewId: string;
  flightNumber: string;
  flightDate: string;
  aircraftType: string;
  seats: [string, string, string] | string[];
}

export async function createVoucherRecord(params: CreateVoucherParams) {
  return await prisma.voucher.create({
    data: {
      crew_name: params.crewName,
      crew_id: params.crewId,
      flight_number: params.flightNumber,
      flight_date: params.flightDate,
      aircraft_type: params.aircraftType,
      seat1: params.seats[0],
      seat2: params.seats[1],
      seat3: params.seats[2],
    },
  });
}


