import type { JwtPayload } from "@utils/jwt.utils.js";

declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}

export {};
