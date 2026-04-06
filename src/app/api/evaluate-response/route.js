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

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, Number(value) || 0));
}

function normalizeArray(value, maxItems = 4) {
  if (!Array.isArray(value)) return [];
  return value
    .filter((item) => typeof item === "string" && item.trim())
    .map((item) => item.trim())
    .slice(0, maxItems);
}

function buildFallbackEvaluation(requireEvidence) {
  return {
    overallScore: 60,
    pass: false,
    strengths: ["The response attempts to answer the question."],
    issues: [
      requireEvidence
        ? "Add stronger evidence from the passage."
        : "Add clearer explanation and detail.",
    ],
    nextRevisionStep: requireEvidence
      ? "Add one specific detail from the passage and explain how it proves your answer."
      : "Answer the prompt more directly and explain your thinking more clearly.",
    teacherDiagnostics: [
      requireEvidence ? "Weak evidence" : "Underdeveloped explanation",
    ],
    reasoningQuality: 2,
    answeredPrompt: true,
    debugVersion: "rubric-v3",
  };
}

function calculateOverallScore(parsed, requireEvidence) {
  const answeredPrompt = Boolean(parsed?.answeredPrompt);

  const promptAlignment = clamp(parsed?.promptAlignmentScore, 0, 30);
  const accuracyRelevance = clamp(parsed?.accuracyRelevanceScore, 0, 25);
  const explanationDepth = clamp(parsed?.explanationDepthScore, 0, 25);
  const evidenceUse = requireEvidence
    ? clamp(parsed?.evidenceUseScore, 0, 20)
    : 20;

  let overallScore =
    promptAlignment + accuracyRelevance + explanationDepth + evidenceUse;

  if (!answeredPrompt) {
    overallScore = Math.min(overallScore, 59);
  }

  overallScore = clamp(Math.round(overallScore), 0, 100);

  const reasoningQuality = clamp(parsed?.reasoningQuality, 1, 4);
  const strengths = normalizeArray(parsed?.strengths, 4);
  const issues = normalizeArray(parsed?.issues, 4);
  const teacherDiagnostics = normalizeArray(parsed?.teacherDiagnostics, 6);

  const nextRevisionStep =
    typeof parsed?.nextRevisionStep === "string" && parsed.nextRevisionStep.trim()
      ? parsed.nextRevisionStep.trim()
      : requireEvidence
      ? "Add stronger text evidence and explain how it supports your answer."
      : "Explain your answer more clearly with more detail.";

  const pass = overallScore >= 80 && answeredPrompt;

  return {
    overallScore,
    pass,
    strengths,
    issues,
    nextRevisionStep,
    teacherDiagnostics,
    reasoningQuality,
    answeredPrompt,
    debugVersion: "rubric-v3",
  };
}

export async function POST(request) {
  try {
    if (!process.env.OPENAI_API_KEY) {
      return Response.json(
        {
          error: "Missing OPENAI_API_KEY",
          details:
            "Add OPENAI_API_KEY to the root .env.local file and restart npm run dev.",
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

    const trimmedResponse = String(response).trim();

    if (trimmedResponse.length < 15) {
      return Response.json({
        overallScore: 15,
        pass: false,
        strengths: [],
        issues: [
          "The response is too short to show enough understanding.",
          requireEvidence
            ? "The response does not include enough text evidence."
            : "The response needs more explanation and detail.",
        ],
        nextRevisionStep: requireEvidence
          ? "Write 2–4 complete sentences and include a specific detail from the passage."
          : "Write 3–5 complete sentences that directly answer the question and explain your reasoning.",
        teacherDiagnostics: [
          "Response too brief",
          requireEvidence ? "Missing evidence" : "Weak explanation",
        ],
        reasoningQuality: 1,
        answeredPrompt: false,
        debugVersion: "rubric-v3",
      });
    }

    const prompt = `
You are a fair, calibrated 9th grade ELA evaluator.

Evaluate ONE student response to ONE question.

Return ONLY valid JSON in this exact format:
{
  "promptAlignmentScore": 0,
  "accuracyRelevanceScore": 0,
  "explanationDepthScore": 0,
  "evidenceUseScore": 0,
  "strengths": ["..."],
  "issues": ["..."],
  "nextRevisionStep": "...",
  "teacherDiagnostics": ["..."],
  "reasoningQuality": 1,
  "answeredPrompt": true
}

Important:
- Output ONLY JSON.
- No markdown fences.
- No extra explanation.
- Do NOT return an overallScore.
- We will calculate the final score in code.
- Be fair and realistic for a 9th grade student.
- Do not expect perfect wording.
- Minor grammar issues should not heavily reduce the score.
- If the answer is clearly relevant and substantially complete, score it solidly.
- If evidence is paraphrased correctly, it counts as evidence.

Scoring:
1. promptAlignmentScore: 0-30
How directly and clearly does the response answer the question?

2. accuracyRelevanceScore: 0-25
How accurate and text-relevant is the response?

3. explanationDepthScore: 0-25
How well does the student explain thinking with detail and clarity?

4. evidenceUseScore: 0-20
Only score this based on evidence quality.
If evidence is NOT required, still return a number, but it will be ignored by code.
If evidence IS required, reward specific quoted or paraphrased details from the passage.

Reasoning quality scale:
1 = very weak
2 = partial
3 = solid
4 = strong

Lesson Context:
Standard: ${standard || ""}
Skill: ${skill || ""}
Text Type: ${textType || ""}
Difficulty: ${difficulty || ""}
Evidence Required: ${requireEvidence ? "Yes" : "No"}

Question:
${question}

Passage:
${passage}

Student Response:
${trimmedResponse}
`;

    const aiResponse = await client.responses.create({
      model: "gpt-4.1-mini",
      input: prompt,
    });

    const rawText = aiResponse.output_text;
    const cleanedText = cleanJsonResponse(rawText);

    try {
      const parsed = JSON.parse(cleanedText);
      const normalized = calculateOverallScore(parsed, requireEvidence);
      return Response.json(normalized);
    } catch {
      return Response.json(buildFallbackEvaluation(requireEvidence));
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