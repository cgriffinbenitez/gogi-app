import OpenAI from "openai";

function cleanJsonResponse(text) {
  if (!text) return "";

  let cleaned = text.trim();

  if (cleaned.startsWith("```json")) {
    cleaned = cleaned.replace(/^```json\s*/i, "");
  } else if (cleaned.startsWith("```")) {
    cleaned = cleaned.replace(/^```\s*/i, "");
  }

  if (cleaned.endsWith("```")) {
    cleaned = cleaned.replace(/\s*```$/i, "");
  }

  return cleaned.trim();
}

export async function POST(request) {
  try {
    if (!process.env.OPENAI_API_KEY) {
      return Response.json(
        {
          error: "Missing OPENAI_API_KEY",
          details: "Add OPENAI_API_KEY to the root .env.local file and restart npm run dev.",
        },
        { status: 500 }
      );
    }

    const client = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    const body = await request.json();

    const {
      question,
      response,
      passage,
      requireEvidence = false,
      standard,
      skill,
      textType,
      difficulty,
    } = body;

    if (!question || !response || !passage) {
      return Response.json(
        {
          error: "Missing required fields",
          details: "question, response, and passage are required",
        },
        { status: 400 }
      );
    }

    const prompt = `
You are an expert 9th grade ELA evaluator.

Evaluate the student response.

Return ONLY valid JSON in this exact format:
{
  "overallScore": 0,
  "pass": false,
  "strengths": ["..."],
  "issues": ["..."],
  "nextRevisionStep": "...",
  "teacherDiagnostics": ["..."],
  "reasoningQuality": 1,
  "answeredPrompt": true
}

Do not wrap the JSON in markdown fences.
Do not add explanation before or after the JSON.

Focus on:
- Answering the question
- Full sentences
- Clarity
- Detail
- ${requireEvidence ? "Use of text evidence" : "General reasoning"}

Lesson Context:
Standard: ${standard || ""}
Skill: ${skill || ""}
Text Type: ${textType || ""}
Difficulty: ${difficulty || ""}

Question:
${question}

Passage:
${passage}

Student Response:
${response}
`;

    const aiResponse = await client.responses.create({
      model: "gpt-4.1-mini",
      input: prompt,
    });

    const rawText = aiResponse.output_text;
    const cleanedText = cleanJsonResponse(rawText);

    try {
      const parsed = JSON.parse(cleanedText);
      return Response.json(parsed);
    } catch {
      return Response.json(
        {
          error: "Invalid JSON from AI",
          details: cleanedText,
        },
        { status: 500 }
      );
    }
  } catch (error) {
    return Response.json(
      {
        error: "Server failed",
        details: error?.message || "Unknown error",
      },
      { status: 500 }
    );
  }
}