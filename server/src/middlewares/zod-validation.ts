import type { Request, Response, NextFunction } from "express";
import { ZodError, type ZodSchema } from "zod";
import ApiError from "../utils/api-error.js";

export function validateData(schema: ZodSchema) {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse(req.body);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const errorMessage = error.issues
          .map((issue) => `${issue.path.join(".")} is ${issue.message}`)
          .join(", ");
        res.status(400).json(new ApiError(400, errorMessage));
      } else {
        res.status(500).json(new ApiError(500, "Internal Server Error"));
      }
    }
  };
}
