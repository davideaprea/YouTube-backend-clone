import { Document } from "mongoose";
import { User } from "./user.type";

export type UserDocument = User & Document;