import { getUserFromToken } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import Product from "@/models/Product";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(req: NextRequest,  {params}:any) {
  try {
    await connectDB();

    const { id } = await params;
    console.log(id,"id");
     const user = await getUserFromToken(req);
        if (!user || user.role === 'Employee') {
          return NextResponse.json({ message: 'Not authorized' }, { status: 403 });
        }
    const deletedProduct = await Product.findByIdAndDelete(id);

    if (!deletedProduct) {
      return NextResponse.json({ message: "Product not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Product deleted successfully" }, { status: 200 });
  }  catch (error: unknown) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
  }

export async function PUT(req: NextRequest, {params}:any) {
    try {
      await connectDB();
  
      const { id } = params;
      const user = await getUserFromToken(req);
      if (!user || user.role === 'Employee') {
        return NextResponse.json({ message: 'Not authorized' }, { status: 403 });
      }
  
      const body = await req.json();
      const { name, description, price, image } = body;
  
      const updatedProduct = await Product.findByIdAndUpdate(
        id,
        { name, description, price, image },
        { new: true }
      );
  
      if (!updatedProduct) {
        return NextResponse.json({ message: 'Product not found' }, { status: 404 });
      }
  
      return NextResponse.json({ message: 'Product updated successfully', product: updatedProduct }, { status: 200 });
    }  catch (error: unknown) {
      if (error instanceof Error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
      }
      return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
    }
  }