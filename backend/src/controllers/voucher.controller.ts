import { Request, Response, NextFunction } from "express";
import { checkVoucherSchema, generateVoucherSchema } from "../utils/validation";
import { checkVoucherExists, createVoucherRecord, getVoucherHistory } from "../services/db.service";
import { generateSeats } from "../services/seat.service";
import { AppError } from "../utils/error";

export async function checkVoucherController(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const parseResult = checkVoucherSchema.safeParse(req.body);
    if (!parseResult.success) {
      const errorMsg = parseResult.error.errors.map(e => e.message).join(", ");
      throw new AppError(errorMsg, 400, parseResult.error.flatten());
    }

    const { flightNumber, date } = parseResult.data;
    const exists = await checkVoucherExists(flightNumber, date);

    res.status(200).json({ exists });
  } catch (err) {
    next(err);
  }
}

export async function generateVoucherController(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const parseResult = generateVoucherSchema.safeParse(req.body);
    if (!parseResult.success) {
      const errorMsg = parseResult.error.errors.map(e => e.message).join(", ");
      throw new AppError(errorMsg, 400, parseResult.error.flatten());
    }

    const { name, id, flightNumber, date, aircraft } = parseResult.data;

    const alreadyExists = await checkVoucherExists(flightNumber, date);
    if (alreadyExists) {
      throw new AppError(
        `Voucher assignments have already been generated for flight ${flightNumber} on ${date}.`,
        409
      );
    }

    const seats = generateSeats(aircraft);

    await createVoucherRecord({
      crewName: name,
      crewId: id,
      flightNumber,
      flightDate: date,
      aircraftType: aircraft,
      seats,
    });

    res.status(201).json({
      success: true,
      seats,
    });
  } catch (err) {
    next(err);
  }
}

export async function getHistoryController(
  _req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const history = await getVoucherHistory();
    res.status(200).json({
      success: true,
      history,
    });
  } catch (err) {
    next(err);
  }
}
