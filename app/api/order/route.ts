// app/api/orders/route.js

import { getUserFromToken } from '@/lib/auth';
import { connectDB } from '@/lib/mongodb';
import Order from '@/models/Order';
import Product from '@/models/Product';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req:NextRequest) {
  try {
    await connectDB();

    // Get authenticated user
    const employee = await getUserFromToken(req);
    if (!employee) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Parse body
    const { productId, customerName, status } = await req.json();

    // Validate
    if (!productId || !customerName) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Find product
    const product = await Product.findById(productId);
    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 400 });
    }

    // Create order
    const newOrder = new Order({
      customerName,
      product: productId,
      status: status || 'Pending',
      placedBy: employee.userId,
    });

    await newOrder.save();

    return NextResponse.json({ message: 'Order placed successfully', order: newOrder }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error }, { status: 500 });
  }
}
export async function GET(req:NextRequest) {
    try{
        await connectDB();
        const employee = await getUserFromToken(req);
        if(employee?.role=="Admin") return NextResponse.json("unauthorise",{status:402});
        let order;

if (employee?.role === "Manager") {
  order = await Order.find(); // or apply team filtering as needed
} else {
  order = await Order.find({ placedBy: employee?.userId });
}

        await Order.find({placedBy:employee?.userId});
        return NextResponse.json(order,{status:200});

    }
    catch(error){
      console.log("error deleting in user",error);

        NextResponse.json("Internal server error",{status:500});
    }
    
}