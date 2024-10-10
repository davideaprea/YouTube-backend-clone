import { NextFunction, Response } from "express";
import { CustomReq } from "./custom-req.type.js";

export type CustomReqHandler = (req: CustomReq, res: Response, next: NextFunction) => void | Promise<void>;