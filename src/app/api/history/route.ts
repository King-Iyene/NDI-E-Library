import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/supabase";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { data: history, error } = await supabaseAdmin
      .from("reading_history")
      .select("*, books(*, categories(name))")
      .eq("user_id", session.user.id)
      .order("updated_at", { ascending: false });

    if (error) throw error;

    const mapped = history?.map((h: any) => ({
      ...h,
      book: { ...h.books, category: h.books?.categories },
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

    const { bookId, lastPage } = await req.json();

    const { data, error } = await supabaseAdmin
      .from("reading_history")
      .upsert(
        {
          user_id: session.user.id,
          book_id: bookId,
          last_page: lastPage || 0,
          updated_at: new Date().toISOString(),
          ...(lastPage === -1 ? { completed_at: new Date().toISOString() } : {}),
        },
        { onConflict: "user_id,book_id" }
      )
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
