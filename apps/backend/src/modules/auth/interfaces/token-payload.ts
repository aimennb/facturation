import { AppRole } from "../../../common/roles.decorator.js";

export interface TokenPayload {
  sub: string;
  role: AppRole;
  email: string;
}
