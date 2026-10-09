import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { supabaseAdmin } from "@/lib/supabase";

export async function POST(req: NextRequest) {
  try {
    const { name, email, password, department, matricNo } = await req.json();

    if (!name || !email || !password) {
      return NextResponse.json({ error: "Name, email and password are required" }, { status: 400 });
    }

    const { data: existing } = await supabaseAdmin
      .from("users")
      .select("id")
      .eq("email", email.toLowerCase())
      .single();

    if (existing) {
      return NextResponse.json({ error: "Email already registered" }, { status: 409 });
    }

    const hashed = await bcrypt.hash(password, 12);
    const { data: user, error } = await supabaseAdmin
      .from("users")
      .insert({
        name,
        email: email.toLowerCase(),
        password: hashed,
        role: "student",
        department: department || null,
        matric_no: matricNo || null,
      })
      .select("id")
      .single();

    if (error) throw error;

    return NextResponse.json(
      { message: "Registration successful", userId: user.id },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Registration failed" }, { status: 500 });
  }
}
