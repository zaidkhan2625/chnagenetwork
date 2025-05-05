import Order from "@/models/Order";
import User from "@/models/User";
import { getUserFromToken } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";

export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const manager = await getUserFromToken(req);
    if (manager.role !== "Manager") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    // 1. Find employees under this manager
    const team = await User.find({ managerId: manager.userId });
    const teamIds = team.map((emp) => emp._id);

    // 2. Find orders placed by those employees
    const orders = await Order.find({ placedBy: { $in: teamIds } });

    return NextResponse.json(orders, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
