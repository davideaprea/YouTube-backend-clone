import { RegisterDto } from "./register-dto.type";

export type LoginDto = Pick<RegisterDto, "email" | "password">;