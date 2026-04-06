import { getSupabaseAdmin } from "@/lib/supabaseAdmin";

export async function POST(request) {
  try {
    const body = await request.json();

    const {
      firstName,
      lastName,
      period,
      standard,
      skill,
      textType,
      difficulty,
      box1Score,
      box2Score,
      box3Score,
      latestAverage,
      attemptsBox1,
      attemptsBox2,
      attemptsBox3,
      status,
      progress,
    } = body;

    if (!firstName || !lastName || !period) {
      return Response.json(
        { error: "Missing required student identity fields." },
        { status: 400 }
      );
    }

    const supabase = getSupabaseAdmin();

    const { data, error } = await supabase
      .from("student_responses")
      .insert([
        {
          first_name: firstName,
          last_name: lastName,
          period,
          standard,
          skill,
          text_type: textType,
          difficulty,
          box1_score: box1Score ?? 0,
          box2_score: box2Score ?? 0,
          box3_score: box3Score ?? 0,
          latest_average: latestAverage ?? 0,
          attempts_box1: attemptsBox1 ?? 0,
          attempts_box2: attemptsBox2 ?? 0,
          attempts_box3: attemptsBox3 ?? 0,
          status: status ?? "In Progress",
          progress: progress ?? "3-Box Revision Loop Active",
        },
      ])
      .select()
      .single();

    if (error) {
      return Response.json({ error: error.message }, { status: 500 });
    }

    return Response.json({ success: true, record: data });
  } catch (error) {
    return Response.json(
      { error: error?.message || "Unknown server error." },
      { status: 500 }
    );
  }
}