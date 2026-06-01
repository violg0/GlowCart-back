import jwt from "jsonwebtoken";

export interface JwtPayload {
  adminId: string;
  email: string;
  role: "superadmin" | "admin";
}

export function signToken(payload: JwtPayload): string {
  const secret = process.env.JWT_SECRET as string;
  const expiresIn = (process.env.JWT_EXPIRES_IN ?? "7d") as jwt.SignOptions["expiresIn"];
  return jwt.sign(payload as object, secret, { expiresIn });
}

export function verifyToken(token: string): JwtPayload {
  return jwt.verify(token, process.env.JWT_SECRET as string) as JwtPayload;
}
