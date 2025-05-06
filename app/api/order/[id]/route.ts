"@ts-expect-error"
import { getUserFromToken } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import Order from "@/models/Order";
import {   NextRequest, NextResponse } from "next/server";
export async function DELETE(req:NextRequest ,{params}:{params:{id:string}}) {
  try {
    await connectDB();
    const user = await getUserFromToken(req);
    if(!user){
      return NextResponse.json({ message: "user not found" }, { status: 404 });

    }
    const { id } = params;
    const deletedOrder = await Order.findByIdAndDelete(id);

    if (!deletedOrder) {
      return NextResponse.json({ message: "Order not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Order deleted", order: deletedOrder }, { status: 200 });
  } catch (error) {
    console.error("Error deleting order:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}


