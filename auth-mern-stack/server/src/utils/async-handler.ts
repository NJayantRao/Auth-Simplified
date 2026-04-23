import type { Request, Response, NextFunction } from "express";
import ApiError from "./api-error.js";

const AsyncHandler = (fn: any) => {
  return async function (req: Request, res: Response, next: NextFunction) {
    try {
      const result = await fn(req, res, next);
      return result;
    } catch (error: any) {
      console.log(error?.message);
      next(error);
    }
  };
};

export default AsyncHandler;
