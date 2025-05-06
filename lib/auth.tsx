import { NextRequest } from "next/server";
import jwt from "jsonwebtoken";

interface DecodedToken {
  userId: string;
  role: string;
  iat?: number;
  exp?: number;
}

export async function getUserFromToken(req: NextRequest): Promise<DecodedToken | null> {
  console.log("Start getting user...");
  const authHeader = req.headers.get("authorization");

  if (!authHeader) {
    console.log("No Authorization header found!");
    return null;
  }

  try {
    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as DecodedToken;
    console.log("Decoded User:", decoded);
    return decoded;
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("JWT Error:", error.message);
    }
    return null;
  }
}
