import { NextRequest } from "next/server";
import jwt from "jsonwebtoken";

export async function getUserFromToken(req: NextRequest) {
  console.log("Start getting user...");
  const authHeader = req.headers.get("authorization");

  if (!authHeader) {
    console.log("No Authorization header found!");
    return null;
  }

  try {
    const token = authHeader.split(" ")[1];
    const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);
    console.log("Decoded User:", decoded);
    return decoded;
  } catch (error) {
    console.error("Token verification failed:", error);
    return null;
  }
}
