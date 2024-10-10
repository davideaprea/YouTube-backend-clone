import { RegisterDto } from "./register-dto.type.js";

export type LoginDto = Pick<RegisterDto, "email" | "password">;