import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/supabase";

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role === "student") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const role = searchParams.get("role") || "";
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");

    let query = supabaseAdmin
      .from("users")
      .select("id, name, email, role, department, matric_no, avatar, created_at", { count: "exact" });

    if (session.user.role === "admin") {
      query = query.eq("role", "student");
    } else if (role) {
      query = query.eq("role", role);
    }

    const from = (page - 1) * limit;
    const to = from + limit - 1;

    const { data: users, count, error } = await query
      .order("created_at", { ascending: false })
      .range(from, to);

    if (error) throw error;

    const total = count || 0;
    return NextResponse.json({
      users,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
