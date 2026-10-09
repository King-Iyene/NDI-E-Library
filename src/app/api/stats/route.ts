import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/supabase";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role === "student") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const [booksRes, usersRes, categoriesRes, adminsRes, studentsRes, recentRes, downloadsRes] =
      await Promise.all([
        supabaseAdmin.from("books").select("id", { count: "exact", head: true }).eq("is_active", true),
        supabaseAdmin.from("users").select("id", { count: "exact", head: true }),
        supabaseAdmin.from("categories").select("id", { count: "exact", head: true }),
        supabaseAdmin.from("users").select("id", { count: "exact", head: true }).eq("role", "admin"),
        supabaseAdmin.from("users").select("id", { count: "exact", head: true }).eq("role", "student"),
        supabaseAdmin
          .from("books")
          .select("*, categories(name)")
          .eq("is_active", true)
          .order("created_at", { ascending: false })
          .limit(5),
        supabaseAdmin.from("books").select("downloads").eq("is_active", true),
      ]);

    const totalDownloads = downloadsRes.data?.reduce((sum: number, b: any) => sum + (b.downloads || 0), 0) || 0;

    return NextResponse.json({
      totalBooks: booksRes.count || 0,
      totalUsers: usersRes.count || 0,
      totalCategories: categoriesRes.count || 0,
      totalAdmins: adminsRes.count || 0,
      totalStudents: studentsRes.count || 0,
      totalDownloads,
      recentBooks: recentRes.data?.map((b: any) => ({ ...b, category: b.categories })) || [],
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
