import "reflect-metadata";
import "express-async-errors";
import path from "path";

import express, { Response, Request, NextFunction } from "express";
import "../container";

import { router } from "./routes";
import { AppError } from "../../errors/AppError";
import morgan from "morgan";

const app = express();
app.use(express.json());
app.use(morgan("dev"));
app.use("/files", express.static(path.resolve(__dirname, "..", "..", "..", "tmp", "uploads")))

app.use(router);

app.use((err: Error, request: Request, response: Response, next: NextFunction) => {
  if (err instanceof AppError) {
    return response.status(err.statusCode).json({ message: err.message });
  }

  return response.status(500).json({ message: "Unknown server error" });
});

app.listen(3333, () => console.log("🔥 Running on port 3333 🔥"));