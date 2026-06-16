import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET!;
const JWT_EXPIRES_IN = "7d";

export type TipePayloadJWT = {
  id: string;
  email: string;
  peran: string;
};

export function buatToken(payload: TipePayloadJWT): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
}

export function verifikasiToken(token: string): TipePayloadJWT | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as TipePayloadJWT;
    return decoded;
  } catch (error) {
    return null;
  }
}

export function ambilTokenDariHeader(
  authorizationHeader?: string,
): string | null {
  if (!authorizationHeader || !authorizationHeader.startsWith("Bearer ")) {
    return null;
  }
  return authorizationHeader.split(" ")[1];
}
