import User from '@/models/User';
import bcrypt from 'bcryptjs';
import { connectDB } from '@/lib/mongodb';
import { NextRequest, NextResponse } from 'next/server';

// Handle POST request for creating a new user
export async function POST(req: NextRequest) {
  try {
    await connectDB(); // Connect to the database

    // Parse the body of the request
    const { fullName, email, password, role, managerId } = await req.json();

    // Validate employee role must have a manager
    if (role === 'Employee' && !managerId) {
      return NextResponse.json({ error: 'Employees must be assigned a manager' }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user with provided data
    const newUser = new User({
      fullName,
      email,
      password: hashedPassword,
      role,
      managerId: role === 'Employee' ? managerId : null, // Only for Employees
    });

    await newUser.save();

    // Return success response
    return NextResponse.json({ message: 'User created successfully', user: newUser }, { status: 201 });

  } catch (error) {
    return NextResponse.json({ error: error }, { status: 400 });
  }
}

// Handle GET request for retrieving all users
export async function GET() {
  try {
    await connectDB(); // Connect to the database

    // Retrieve all users from the database
    const users = await User.find();

    // Return users in the response
    return NextResponse.json(users, { status: 200 });
  }  catch (error: unknown) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}


