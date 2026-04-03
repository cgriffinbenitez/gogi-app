"use client";

import { useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

function getSkillInstruction(skill) {
  const bank = {
    Theme: {
      title: "Skill Focus: Theme",
      definition:
        "Theme is the deeper message or lesson about life that a text communicates. A theme is not just one word like 'love' or 'loss.' It is a full idea or insight about life.",
      strategies: [
        "Notice what the character learns, realizes, or comes to understand.",
        "Look for repeated ideas, emotions, or struggles across the passage.",
        "Turn the topic into a message about life, not just a label.",
        "Use details from the passage to prove how the theme develops.",
      ],
      howToFind:
        "Ask yourself: what does the author want you to understand about life, choices, or people through this character’s experience?",
      responseTips: [
        "Box 1: State the theme in a full sentence.",
        "Box 2: Use specific text evidence.",
        "Box 3: Explain how the evidence develops the theme.",
      ],
    },
    "Main Idea": {
      title: "Skill Focus: Main Idea",
      definition:
        "Main idea is the most important point the author wants you to understand about the passage as a whole.",
      strategies: [
        "Look across the full passage, not just one sentence.",
        "Notice repeated details and connected ideas.",
        "Ignore tiny details and focus on the central point.",
        "Ask what the author is mostly trying to say.",
      ],
      howToFind:
        "Summarize the passage in one sentence, then check whether most of the details support that summary.",
      responseTips: [
        "Box 1: State the main idea clearly.",
        "Box 2: Add supporting details from the text.",
        "Box 3: Explain how those details support the main idea.",
      ],
    },
    Inference: {
      title: "Skill Focus: Inference",
      definition:
        "An inference is a logical conclusion based on clues from the text and your own reasoning.",
      strategies: [
        "Look for clues in actions, descriptions, and tone.",
        "Ask what the text suggests even if it does not say it directly.",
        "Base your answer on evidence, not a guess.",
        "Explain how the clue led you to your conclusion.",
      ],
      howToFind:
        "Underline a clue from the passage, then ask: what does this clue suggest?",
      responseTips: [
        "Box 1: State the inference clearly.",
        "Box 2: Point to a clue from the text.",
        "Box 3: Explain how the clue supports your inference.",
      ],
    },
    "Text Evidence": {
      title: "Skill Focus: Text Evidence",
      definition:
        "Text evidence is a specific detail, quote, or paraphrase from the passage that supports your answer.",
      strategies: [
        "Find the strongest proof in the text.",
        "Quote or paraphrase accurately.",
        "Choose evidence that directly connects to the question.",
        "Explain how the evidence supports your answer.",
      ],
      howToFind:
        "After deciding your answer, ask: what line or detail from the passage best proves it?",
      responseTips: [
        "Box 1: Answer the question clearly.",
        "Box 2: Add the strongest evidence.",
        "Box 3: Explain how the evidence supports the answer.",
      ],
    },
    "Context Clues": {
      title: "Skill Focus: Context Clues",
      definition:
        "Context clues are hints in the surrounding words and sentences that help you figure out the meaning of a word or phrase.",
      strategies: [
        "Read the sentence before and after the word.",
        "Look for examples, explanations, or synonyms nearby.",
        "Test a possible meaning in the sentence.",
        "Use the overall situation and tone to guide your thinking.",
      ],
      howToFind:
        "Cover the word, read the surrounding lines, and decide which meaning makes the most sense in context.",
      responseTips: [
        "Box 1: State the likely meaning.",
        "Box 2: Point to surrounding clues.",
        "Box 3: Explain why those clues support your answer.",
      ],
    },
  };

  return bank[skill] || bank["Theme"];
}

function getQuestionSet(skill) {
  const bank = {
    Theme: [
      "What is a central theme of the passage?",
      "Which details from the passage best develop that theme?",
      "Explain how those details develop the theme.",
    ],
    "Main Idea": [
      "What is the main idea of the passage?",
      "Which details best support the main idea?",
      "Explain how those details support the main idea.",
    ],
    Inference: [
      "What can you infer about Elena’s grandmother from the box and letters?",
      "Which details from the passage support that inference?",
      "Explain how those details support your inference.",
    ],
    "Text Evidence": [
      "What idea about Elena’s growth does the passage develop?",
      "What is the strongest piece of text evidence that supports your answer?",
      "Explain how that evidence supports your answer.",
    ],
    "Context Clues": [
      "What does the word 'inheritance' most likely suggest in the final paragraph?",
      "Which surrounding details help you determine that meaning?",
      "Explain why those details support your answer.",
    ],
  };

  return bank[skill] || bank["Theme"];
}

function getPassage() {
  return `Elena waited until the apartment was quiet before opening the old wooden box. She had seen it for years on the top shelf of her grandmother’s closet, always pushed toward the back as if it belonged to a life that no longer wished to be remembered. Dust clung to the corners. The metal clasp gave way with a soft click.

Inside were photographs, letters tied with a faded blue ribbon, and a watch that no longer moved. Elena lifted the first photograph carefully. In it, her grandmother stood beside a train, shoulders squared, eyes fixed somewhere beyond the camera. She looked younger than Elena had ever imagined her to be, but there was already something ancient in her expression, as though she had learned too early that the world could take things away without asking.

Elena unfolded one of the letters. The handwriting was narrow and precise. It spoke of long workdays, of missing home, of a promise to keep going no matter how lonely the city became. At the bottom of the page, a single sentence had been underlined twice: "You do not always get to choose the road, but you do choose how you walk it."

She read the sentence again. Then once more. Outside, a siren rose and faded into the distance. The apartment remained still. Elena thought of the way her grandmother never complained, the way she folded every hardship into silence and turned it into something useful. Until that moment, Elena had mistaken that silence for absence, for emptiness. Now it seemed full—crowded with sacrifices, decisions, and endurance.

When Elena finally closed the box, she did not place it back on the shelf. Instead, she carried it to her room and set it on her desk. For the first time, the future felt less like an open question and more like an inheritance—heavy, unfinished, and somehow hers.`;
}

async function evaluateWithAI({
  standard,
  skill,
  textType,
  difficulty,
  question,
  response,
  passage,
  requireEvidence,
}) {
  const apiResponse = await fetch("/api/evaluate-response", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      standard,
      skill,
      textType,
      difficulty,
      question,
      response,
      passage,
      requireEvidence,
    }),
  });

  const data = await apiResponse.json();

  return {
    status: apiResponse.status,
    ok: apiResponse.ok,
    ...data,
  };
}

function FeedbackCard({ title, result }) {
  if (!result) return null;

  if (result.error) {
    return (
      <div className="rounded-xl border border-red-700 bg-red-900/20 p-4 text-red-300">
        <p className="font-semibold">{title} Error</p>
        <p className="mt-2">{result.error}</p>
        {result.details && <p className="mt-2 text-sm">{result.details}</p>}
      </div>
    );
  }

  return (
    <div className="rounded-xl bg-slate-950 p-4">
      <div className="mb-4 grid gap-4 md:grid-cols-4">
        <div>
          <p className="text-sm text-slate-400">Score</p>
          <p className="mt-1 text-xl font-bold">{result.overallScore}/100</p>
        </div>
        <div>
          <p className="text-sm text-slate-400">Status</p>
          <p className="mt-1 text-xl font-bold">{result.pass ? "Pass" : "Revise"}</p>
        </div>
        <div>
          <p className="text-sm text-slate-400">Reasoning</p>
          <p className="mt-1 text-xl font-bold">{result.reasoningQuality}/4</p>
        </div>
        <div>
          <p className="text-sm text-slate-400">Prompt Alignment</p>
          <p className="mt-1 text-xl font-bold">
            {result.answeredPrompt ? "Yes" : "No"}
          </p>
        </div>
      </div>

      <div className="mb-4 grid gap-6 md:grid-cols-2">
        <div>
          <h4 className="mb-2 text-lg font-semibold">What You Did Well</h4>
          <ul className="list-disc space-y-1 pl-6 text-slate-300">
            {(result.strengths || []).map((item, index) => (
              <li key={`${title}-strength-${index}`}>{item}</li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="mb-2 text-lg font-semibold">What To Fix</h4>
          <ul className="list-disc space-y-1 pl-6 text-slate-300">
            {(result.issues || []).map((item, index) => (
              <li key={`${title}-issue-${index}`}>{item}</li>
            ))}
          </ul>
        </div>
      </div>

      <div className="mb-4 rounded-lg border border-slate-800 bg-slate-900 p-3">
        <h4 className="mb-2 text-lg font-semibold">Next Revision Step</h4>
        <p className="text-slate-300">{result.nextRevisionStep}</p>
      </div>

      <div className="rounded-lg border border-slate-800 bg-slate-900 p-3">
        <h4 className="mb-2 text-lg font-semibold">Teacher Diagnostics</h4>
        <ul className="list-disc space-y-1 pl-6 text-slate-300">
          {(result.teacherDiagnostics || []).map((item, index) => (
            <li key={`${title}-diag-${index}`}>{item}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default function LessonDemoPage() {
  const searchParams = useSearchParams();

  const standard = searchParams.get("standard") || "ELA.9.R.1.1";
  const skill = searchParams.get("skill") || "Theme";
  const textType = searchParams.get("textType") || "Literary Passage";
  const difficulty = searchParams.get("difficulty") || "On Grade Level";

  const skillInfo = getSkillInstruction(skill);
  const questions = getQuestionSet(skill);
  const passage = getPassage();

  const [answer1, setAnswer1] = useState("");
  const [answer2, setAnswer2] = useState("");
  const [answer3, setAnswer3] = useState("");

  const [result1, setResult1] = useState(null);
  const [result2, setResult2] = useState(null);
  const [result3, setResult3] = useState(null);

  const [loading1, setLoading1] = useState(false);
  const [loading2, setLoading2] = useState(false);
  const [loading3, setLoading3] = useState(false);

  const [attempts1, setAttempts1] = useState([]);
  const [attempts2, setAttempts2] = useState([]);
  const [attempts3, setAttempts3] = useState([]);

  const [submitted, setSubmitted] = useState(false);

  const box1Passed = !!result1?.pass;
  const box2Passed = !!result2?.pass;
  const box3Passed = !!result3?.pass;
  const allPassed = box1Passed && box2Passed && box3Passed;

  const firstScore =
    attempts1.length > 0 ? Math.round(attempts1[0].overallScore) : 0;
  const latestScores = [
    result1?.overallScore || 0,
    result2?.overallScore || 0,
    result3?.overallScore || 0,
  ];
  const latestAverage = Math.round(
    latestScores.reduce((sum, score) => sum + score, 0) / 3
  );
  const improvement = latestAverage - firstScore;

  const teacherDiagnostics = [
    ...(result1?.teacherDiagnostics || []),
    ...(result2?.teacherDiagnostics || []),
    ...(result3?.teacherDiagnostics || []),
  ];
  const uniqueDiagnostics = [...new Set(teacherDiagnostics)];

  const teacherQuery = `standard=${encodeURIComponent(
    standard
  )}&skill=${encodeURIComponent(skill)}&textType=${encodeURIComponent(
    textType
  )}&difficulty=${encodeURIComponent(
    difficulty
  )}&student=${encodeURIComponent("Demo Student")}&status=${encodeURIComponent(
    submitted ? "Completed" : "In Progress"
  )}&progress=${encodeURIComponent(
    submitted ? "3-Box Mastery Complete" : "3-Box Revision Loop Active"
  )}&initialScore=${encodeURIComponent(
    firstScore
  )}&revisedScore=${encodeURIComponent(
    latestAverage
  )}&improvement=${encodeURIComponent(
    improvement
  )}&initialWeaknesses=${encodeURIComponent(
    attempts1.length > 0
      ? [...new Set(attempts1[0].teacherDiagnostics || [])].join(", ")
      : "No diagnostics available"
  )}&revisedWeaknesses=${encodeURIComponent(
    uniqueDiagnostics.join(", ") || "No diagnostics available"
  )}`;

  async function handleEvaluateBox1() {
    setLoading1(true);
    setSubmitted(false);

    try {
      const result = await evaluateWithAI({
        standard,
        skill,
        textType,
        difficulty,
        question: questions[0],
        response: answer1,
        passage,
        requireEvidence: false,
      });

      setResult1(result);
      if (!result.error) {
        setAttempts1((prev) => [...prev, result]);
      }
    } finally {
      setLoading1(false);
    }
  }

  async function handleEvaluateBox2() {
    if (!box1Passed) return;

    setLoading2(true);
    setSubmitted(false);

    try {
      const result = await evaluateWithAI({
        standard,
        skill,
        textType,
        difficulty,
        question: questions[1],
        response: answer2,
        passage,
        requireEvidence: true,
      });

      setResult2(result);
      if (!result.error) {
        setAttempts2((prev) => [...prev, result]);
      }
    } finally {
      setLoading2(false);
    }
  }

  async function handleEvaluateBox3() {
    if (!box2Passed) return;

    setLoading3(true);
    setSubmitted(false);

    try {
      const result = await evaluateWithAI({
        standard,
        skill,
        textType,
        difficulty,
        question: questions[2],
        response: answer3,
        passage,
        requireEvidence: false,
      });

      setResult3(result);
      if (!result.error) {
        setAttempts3((prev) => [...prev, result]);
      }
    } finally {
      setLoading3(false);
    }
  }

  function handleSubmit() {
    if (!allPassed) return;
    setSubmitted(true);
  }

  return (
    <main className="min-h-screen bg-slate-950 p-8 text-white">
      <div className="mx-auto max-w-6xl">
        <h1 className="mb-4 text-4xl font-bold">Student Lesson</h1>
        <p className="mb-8 text-slate-300">
          Work through the lesson step by step. Each box must pass AI evaluation before the next one unlocks.
        </p>

        <div className="mb-6 rounded-2xl bg-slate-900 p-6">
          <h2 className="mb-3 text-2xl font-semibold">Lesson Info</h2>
          <p className="text-slate-300">
            <span className="font-semibold text-white">Standard:</span> {standard}
          </p>
          <p className="mt-2 text-slate-300">
            <span className="font-semibold text-white">Skill:</span> {skill}
          </p>
          <p className="mt-2 text-slate-300">
            <span className="font-semibold text-white">Text Type:</span> {textType}
          </p>
          <p className="mt-2 text-slate-300">
            <span className="font-semibold text-white">Difficulty:</span> {difficulty}
          </p>
        </div>

        <div className="mb-6 rounded-2xl border border-cyan-700 bg-cyan-900/20 p-6">
          <h2 className="mb-4 text-2xl font-semibold">{skillInfo.title}</h2>

          <p className="mb-4 text-slate-200">
            <span className="font-semibold text-white">What this skill means:</span>{" "}
            {skillInfo.definition}
          </p>

          <div className="mb-4">
            <p className="mb-2 font-semibold text-white">Strategies to use:</p>
            <ul className="list-disc space-y-2 pl-6 text-slate-300">
              {skillInfo.strategies.map((item, index) => (
                <li key={`strategy-${index}`}>{item}</li>
              ))}
            </ul>
          </div>

          <div className="mb-4">
            <p className="mb-2 font-semibold text-white">How to find the answer:</p>
            <p className="text-slate-300">{skillInfo.howToFind}</p>
          </div>

          <div>
            <p className="mb-2 font-semibold text-white">What a strong response should do:</p>
            <ul className="list-disc space-y-2 pl-6 text-slate-300">
              {skillInfo.responseTips.map((item, index) => (
                <li key={`tip-${index}`}>{item}</li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mb-6 rounded-2xl bg-slate-900 p-6">
          <h2 className="mb-4 text-2xl font-semibold">Literary Passage</h2>
          <div className="space-y-4 leading-8 text-slate-300">
            {passage.split("\n\n").map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
          </div>
        </div>

        <div className="mb-6 rounded-2xl bg-slate-900 p-6">
          <h2 className="mb-4 text-2xl font-semibold">Mastery Progress</h2>

          <div className="grid gap-4 md:grid-cols-4">
            <div className="rounded-xl bg-slate-950 p-4">
              <p className="text-sm text-slate-400">Box 1</p>
              <p className="mt-2 text-xl font-bold">{box1Passed ? "Passed" : "Locked In Progress"}</p>
            </div>
            <div className="rounded-xl bg-slate-950 p-4">
              <p className="text-sm text-slate-400">Box 2</p>
              <p className="mt-2 text-xl font-bold">{box2Passed ? "Passed" : box1Passed ? "Unlocked" : "Locked"}</p>
            </div>
            <div className="rounded-xl bg-slate-950 p-4">
              <p className="text-sm text-slate-400">Box 3</p>
              <p className="mt-2 text-xl font-bold">{box3Passed ? "Passed" : box2Passed ? "Unlocked" : "Locked"}</p>
            </div>
            <div className="rounded-xl bg-slate-950 p-4">
              <p className="text-sm text-slate-400">Latest Average</p>
              <p className="mt-2 text-xl font-bold">{latestAverage}/100</p>
            </div>
          </div>
        </div>

        <div className="mb-6 rounded-2xl bg-slate-900 p-6">
          <h2 className="mb-4 text-2xl font-semibold">Box 1: Core Idea</h2>
          <label className="mb-2 block text-slate-300">{questions[0]}</label>
          <textarea
            value={answer1}
            onChange={(e) => {
              setAnswer1(e.target.value);
              setSubmitted(false);
            }}
            className="min-h-[160px] w-full rounded-xl border border-slate-700 bg-slate-950 p-4 text-white"
            placeholder="Write 3–5 complete sentences."
          />

          <div className="mt-4 flex flex-wrap gap-4">
            <button
              onClick={handleEvaluateBox1}
              disabled={loading1}
              className={`rounded-2xl px-6 py-3 font-semibold ${
                loading1
                  ? "cursor-not-allowed bg-slate-700 text-slate-400"
                  : "border border-cyan-500 text-cyan-300 hover:bg-slate-800"
              }`}
            >
              {loading1 ? "Evaluating..." : attempts1.length === 0 ? "Check Box 1" : "Re-check Box 1"}
            </button>
            <span className="self-center text-slate-400">
              Attempts: {attempts1.length}
            </span>
          </div>

          {result1 && <div className="mt-4"><FeedbackCard title="Box 1" result={result1} /></div>}
        </div>

        <div className={`mb-6 rounded-2xl p-6 ${box1Passed ? "bg-slate-900" : "bg-slate-900/50 opacity-60"}`}>
          <h2 className="mb-4 text-2xl font-semibold">Box 2: Evidence</h2>
          <label className="mb-2 block text-slate-300">{questions[1]}</label>
          <textarea
            value={answer2}
            onChange={(e) => {
              setAnswer2(e.target.value);
              setSubmitted(false);
            }}
            disabled={!box1Passed}
            className="min-h-[160px] w-full rounded-xl border border-slate-700 bg-slate-950 p-4 text-white disabled:cursor-not-allowed disabled:opacity-60"
            placeholder={box1Passed ? "Use specific text evidence." : "Pass Box 1 to unlock Box 2."}
          />

          <div className="mt-4 flex flex-wrap gap-4">
            <button
              onClick={handleEvaluateBox2}
              disabled={!box1Passed || loading2}
              className={`rounded-2xl px-6 py-3 font-semibold ${
                !box1Passed || loading2
                  ? "cursor-not-allowed bg-slate-700 text-slate-400"
                  : "border border-cyan-500 text-cyan-300 hover:bg-slate-800"
              }`}
            >
              {loading2 ? "Evaluating..." : attempts2.length === 0 ? "Check Box 2" : "Re-check Box 2"}
            </button>
            <span className="self-center text-slate-400">
              Attempts: {attempts2.length}
            </span>
          </div>

          {!box1Passed && (
            <div className="mt-4 rounded-xl border border-amber-700 bg-amber-900/20 p-3 text-amber-300">
              Box 2 is locked. Pass Box 1 first.
            </div>
          )}

          {result2 && <div className="mt-4"><FeedbackCard title="Box 2" result={result2} /></div>}
        </div>

        <div className={`mb-6 rounded-2xl p-6 ${box2Passed ? "bg-slate-900" : "bg-slate-900/50 opacity-60"}`}>
          <h2 className="mb-4 text-2xl font-semibold">Box 3: Explanation</h2>
          <label className="mb-2 block text-slate-300">{questions[2]}</label>
          <textarea
            value={answer3}
            onChange={(e) => {
              setAnswer3(e.target.value);
              setSubmitted(false);
            }}
            disabled={!box2Passed}
            className="min-h-[160px] w-full rounded-xl border border-slate-700 bg-slate-950 p-4 text-white disabled:cursor-not-allowed disabled:opacity-60"
            placeholder={box2Passed ? "Explain your reasoning clearly." : "Pass Box 2 to unlock Box 3."}
          />

          <div className="mt-4 flex flex-wrap gap-4">
            <button
              onClick={handleEvaluateBox3}
              disabled={!box2Passed || loading3}
              className={`rounded-2xl px-6 py-3 font-semibold ${
                !box2Passed || loading3
                  ? "cursor-not-allowed bg-slate-700 text-slate-400"
                  : "border border-cyan-500 text-cyan-300 hover:bg-slate-800"
              }`}
            >
              {loading3 ? "Evaluating..." : attempts3.length === 0 ? "Check Box 3" : "Re-check Box 3"}
            </button>
            <span className="self-center text-slate-400">
              Attempts: {attempts3.length}
            </span>
          </div>

          {!box2Passed && (
            <div className="mt-4 rounded-xl border border-amber-700 bg-amber-900/20 p-3 text-amber-300">
              Box 3 is locked. Pass Box 2 first.
            </div>
          )}

          {result3 && <div className="mt-4"><FeedbackCard title="Box 3" result={result3} /></div>}
        </div>

        <div className="mb-6 rounded-2xl bg-slate-900 p-6">
          <h2 className="mb-4 text-2xl font-semibold">Submit Lesson</h2>

          <div className="mb-4 grid gap-4 md:grid-cols-3">
            <div className="rounded-xl bg-slate-950 p-4">
              <p className="text-sm text-slate-400">First Score</p>
              <p className="mt-2 text-xl font-bold">{firstScore}/100</p>
            </div>
            <div className="rounded-xl bg-slate-950 p-4">
              <p className="text-sm text-slate-400">Latest Average</p>
              <p className="mt-2 text-xl font-bold">{latestAverage}/100</p>
            </div>
            <div className="rounded-xl bg-slate-950 p-4">
              <p className="text-sm text-slate-400">Improvement</p>
              <p className="mt-2 text-xl font-bold">
                {improvement >= 0 ? "+" : ""}
                {improvement}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-4">
            <button
              onClick={handleSubmit}
              disabled={!allPassed}
              className={`rounded-2xl px-6 py-3 font-semibold ${
                allPassed
                  ? "bg-cyan-500 text-slate-950 hover:bg-cyan-400"
                  : "cursor-not-allowed bg-slate-700 text-slate-400"
              }`}
            >
              Submit Response
            </button>

            <Link
              href="/setup"
              className="rounded-2xl border border-slate-700 px-6 py-3 font-semibold hover:bg-slate-800"
            >
              Back to Setup
            </Link>

            <Link
              href={`/teacher?${teacherQuery}`}
              className="rounded-2xl border border-slate-700 px-6 py-3 font-semibold hover:bg-slate-800"
            >
              Teacher Dashboard
            </Link>
          </div>

          {!allPassed && (
            <div className="mt-4 rounded-2xl border border-amber-700 bg-amber-900/20 p-4 text-amber-300">
              Submission is locked. All three boxes must pass AI evaluation before you can finish the lesson.
            </div>
          )}
        </div>

        {submitted && (
          <div className="space-y-4">
            <div className="rounded-2xl border border-emerald-700 bg-emerald-900/20 p-4 text-emerald-300">
              Lesson complete. You passed all three boxes and met the mastery threshold.
            </div>

            <Link
              href={`/teacher?${teacherQuery}`}
              className="inline-block rounded-2xl bg-cyan-500 px-6 py-3 font-semibold text-slate-950 hover:bg-cyan-400"
            >
              Send Approved Response to Teacher Dashboard
            </Link>
          </div>
        )}
      </div>
    </main>
  );
}