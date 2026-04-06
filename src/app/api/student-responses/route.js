import { getSupabaseAdmin } from "@/lib/supabaseAdmin";

export async function GET() {
  try {
    const supabase = getSupabaseAdmin();

    const { data, error } = await supabase
      .from("student_responses")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      return Response.json({ error: error.message }, { status: 500 });
    }

    return Response.json({ records: data || [] });
  } catch (error) {
    return Response.json(
      { error: error?.message || "Unknown server error." },
      { status: 500 }
    );
  }
}