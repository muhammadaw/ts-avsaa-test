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

export async function getVoucherHistory(limit = 20) {
  const records = await prisma.voucher.findMany({
    orderBy: { created_at: "desc" },
    take: limit,
  });

  return records.map(r => ({
    id: r.id,
    crewName: r.crew_name,
    crewId: r.crew_id,
    flightNumber: r.flight_number,
    flightDate: r.flight_date,
    aircraftType: r.aircraft_type,
    seats: [r.seat1, r.seat2, r.seat3],
    createdAt: r.created_at,
  }));
}
