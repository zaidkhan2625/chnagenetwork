import { getUserFromToken } from "@/lib/auth";
import User from "@/models/User";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req:NextRequest ) {
  try{
    const manager = await getUserFromToken(req);
    console.log("manager._id",manager.userId)
    if(manager.role !== "Manager"){
        return NextResponse.json({message:"not authrize "},{status:401});
    }
    const team = await User.find({managerId:manager.userId});
    return NextResponse.json(team,{status:200});
  }
  catch(error){
    console.log("error deleting in user",error);
    return NextResponse.json({message:"internal server error"},{status:500});

  }
}