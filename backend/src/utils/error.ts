import { Request, Response, NextFunction } from "express";

export class AppError extends Error {
  public statusCode: number;
  public details?: unknown;

  constructor(message: string, statusCode: number = 400, details?: unknown) {
    super(message);
    this.statusCode = statusCode;
    this.details = details;
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export function errorHandler(
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      success: false,
      error: err.name || "Error",
      message: err.message,
      ...(err.details ? { details: err.details } : {}),
    });
    return;
  }

  if ((err as any).code === "P2002") {
    res.status(409).json({
      success: false,
      error: "Conflict",
      message: "Voucher assignments have already been generated for this flight number and date.",
    });
    return;
  }

  console.error("Unhandled error:", err);
  res.status(500).json({
    success: false,
    error: "InternalServerError",
    message: "An unexpected internal server error occurred.",
  });
}
