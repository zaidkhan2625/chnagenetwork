import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(req:NextRequest , {params}:{params:{id:string}}) {
    try{
        await connectDB();
        const {id}=await params;
        const deleteUser = await User.findByIdAndDelete(id);
        if(!deleteUser){
            return NextResponse.json({message:"user not exist"},{status:404})
        }
        return NextResponse.json({message:"user delted susscesfully"},{status:200});
    }
    catch(error){
        console.error("error in delting user",error);
        return NextResponse.json({message:"Internal server error"},{status:500});
    }
    
}
export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    const { id } = params;

    const body = await req.json();
    const { fullName, email, password, role, managerId } = body;

    // Check if required fields are present
    if (!fullName || !email || !role) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Hash password only if it's provided
    let updatedFields: any = {
      fullName,
      email,
      role,
      managerId: role === "Employee" ? managerId : null,
    };

    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      updatedFields.password = hashedPassword;
    }

    const updatedUser = await User.findByIdAndUpdate(id, updatedFields, {
      new: true,
    });

    if (!updatedUser) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "User updated successfully", user: updatedUser },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating user:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
