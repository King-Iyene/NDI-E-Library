import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/supabase";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { data: bookmarks, error } = await supabaseAdmin
      .from("bookmarks")
      .select("*, books(*, categories(name))")
      .eq("user_id", session.user.id)
      .order("created_at", { ascending: false });

    if (error) throw error;

    const mapped = bookmarks?.map((b: any) => ({
      ...b,
      book: { ...b.books, category: b.books?.categories },
    }));

    return NextResponse.json(mapped);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { bookId } = await req.json();

    const { data: existing } = await supabaseAdmin
      .from("bookmarks")
      .select("id")
      .eq("user_id", session.user.id)
      .eq("book_id", bookId)
      .single();

    if (existing) {
      await supabaseAdmin.from("bookmarks").delete().eq("id", existing.id);
      return NextResponse.json({ bookmarked: false });
    }

    await supabaseAdmin.from("bookmarks").insert({ user_id: session.user.id, book_id: bookId });
    return NextResponse.json({ bookmarked: true }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
