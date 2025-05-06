import { getUserFromToken } from "@/lib/auth";
import User from "@/models/User";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const manager = await getUserFromToken(req);

    if (!manager) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    console.log("manager._id", manager.userId);

    if (manager.role !== "Manager") {
      return NextResponse.json({ message: "Not authorized" }, { status: 403 });
    }

    const team = await User.find({ managerId: manager.userId });
    return NextResponse.json(team, { status: 200 });
  } catch (error) {
    console.log("Error fetching team users:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
