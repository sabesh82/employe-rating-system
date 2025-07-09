import { LoginUserSchema } from "@/schemas/user.schema";
import z from "zod";

export type UserLoginInput = z.infer<typeof LoginUserSchema>;
