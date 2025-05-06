import { connectDB } from '@/lib/mongodb';
import Product from '@/models/Product';
import { NextRequest, NextResponse } from 'next/server';
import { getUserFromToken } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const user = await getUserFromToken(req);
    if (!user || user.role === 'Employee') {
      return NextResponse.json({ message: 'Not authorized' }, { status: 403 });
    }

    const body = await req.json();
    const { name, description, price, image } = body;

    const newProduct = new Product({
      name,
      description,
      price,
      image,
      createdBy: user._id,
    });

    await newProduct.save();

    return NextResponse.json(
      { message: 'Product added successfully', product: newProduct },
      { status: 201 }
    );
  }  catch (error: unknown) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
export async function GET() {
    try {
      await connectDB();
      
  
      const products = await Product.find();
      return NextResponse.json({ products }, { status: 200 });
    }  catch (error: unknown) {
        if (error instanceof Error) {
          return NextResponse.json({ error: error.message }, { status: 500 });
        }
        return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
      }
  }
  