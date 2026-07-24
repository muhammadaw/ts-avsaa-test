import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import voucherRoutes from "./routes/voucher.routes";
import { errorHandler, AppError } from "./utils/error";

export const app = express();

app.use(cors());

app.use(
  express.json({
    verify: (_req: Request, _res: Response, buf: Buffer) => {
      try {
        if (buf.length) JSON.parse(buf.toString());
      } catch {
        throw new AppError("Invalid JSON body payload", 400);
      }
    },
  })
);

app.use("/api", voucherRoutes);

app.use((req: Request, _res: Response, next: NextFunction) => {
  next(new AppError(`Route ${req.method} ${req.originalUrl} not found on this server.`, 404));
});

app.use(errorHandler);

const PORT = process.env.PORT || 5000;

if (process.env.NODE_ENV !== "test") {
  app.listen(PORT, () => {
    console.log(`Backend server running on port ${PORT}`);
  });
}
