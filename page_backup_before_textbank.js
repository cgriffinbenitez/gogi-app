"use client";

import { Suspense, useMemo, useState } from "react";
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

async function saveStudentResponse(payload) {
  const response = await fetch("/api/save-student-response", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const data = await response.json();

  return {
    status: response.status,
    ok: response.ok,
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
          <p className="mt-1 text-xl font-bold">
            {result.pass ? "Pass" : "Revise"}
          </p>
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

function GuidanceCard({ title, bullets, starter, passNote }) {
  return (
    <div className="mb-4 rounded-xl border border-cyan-700 bg-cyan-900/20 p-4">
      <h3 className="mb-2 text-base font-semibold text-cyan-300">{title}</h3>

      <ul className="list-disc space-y-1 pl-5 text-sm text-slate-200">
        {bullets.map((item, index) => (
          <li key={`${title}-bullet-${index}`}>{item}</li>
        ))}
      </ul>

      {starter && (
        <div className="mt-3 rounded-lg border border-slate-700 bg-slate-950 p-3">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
            Strong Starter
          </p>
          <p className="mt-1 text-sm text-cyan-200">{starter}</p>
        </div>
      )}

      {passNote && (
        <div className="mt-3 rounded-lg border border-emerald-800 bg-emerald-900/20 p-3">
          <p className="text-sm text-emerald-300">{passNote}</p>
        </div>
      )}
    </div>
  );
}

function countSentences(text) {
  const matches = text.trim().match(/[^.!?]+[.!?]+|[^.!?]+$/g);
  return matches ? matches.filter((item) => item.trim().length > 0).length : 0;
}

function containsQuoteOrEvidenceLanguage(text) {
  const lower = text.toLowerCase();
  return (
    lower.includes('"') ||
    lower.includes("'") ||
    lower.includes("for example") ||
    lower.includes("for instance") ||
    lower.includes("the passage says") ||
    lower.includes("the text says") ||
    lower.includes("one detail") ||
    lower.includes("the author writes") ||
    lower.includes("in the passage") ||
    lower.includes("when elena") ||
    lower.includes("her grandmother")
  );
}

function containsReasoningLanguage(text) {
  const lower = text.toLowerCase();
  return (
    lower.includes("this shows") ||
    lower.includes("this suggests") ||
    lower.includes("this develops") ||
    lower.includes("this reveals") ||
    lower.includes("this means") ||
    lower.includes("because") ||
    lower.includes("therefore") ||
    lower.includes("so this") ||
    lower.includes("which shows")
  );
}

function startsClearly(text, skill) {
  const trimmed = text.trim().toLowerCase();
  if (!trimmed) return false;

  if (skill === "Theme") {
    return (
      trimmed.startsWith("a central theme") ||
      trimmed.startsWith("the theme") ||
      trimmed.startsWith("one central theme")
    );
  }

  if (skill === "Main Idea") {
    return (
      trimmed.startsWith("the main idea") ||
      trimmed.startsWith("a main idea")
    );
  }

  if (skill === "Inference") {
    return (
      trimmed.startsWith("i can infer") ||
      trimmed.startsWith("the reader can infer") ||
      trimmed.startsWith("we can infer")
    );
  }

  if (skill === "Context Clues") {
    return (
      trimmed.startsWith("the word") ||
      trimmed.startsWith("in this passage") ||
      trimmed.startsWith("the phrase")
    );
  }

  return trimmed.length > 0;
}

function getDraftChecklist(boxNumber, text, skill) {
  const sentenceCount = countSentences(text);
  const trimmed = text.trim();

  if (boxNumber === 1) {
    return [
      {
        label: "You wrote at least 3 sentences.",
        complete: sentenceCount >= 3,
      },
      {
        label: "Your response starts with a clear answer.",
        complete: startsClearly(trimmed, skill) || sentenceCount > 0,
      },
      {
        label: "Your response is long enough to explain the idea.",
        complete: trimmed.length >= 90,
      },
      {
        label:
          "You are focused on the question, not just retelling the whole passage.",
        complete: trimmed.length >= 40,
      },
    ];
  }

  if (boxNumber === 2) {
    return [
      {
        label: "You wrote at least 2 sentences.",
        complete: sentenceCount >= 2,
      },
      {
        label: "You included a specific detail or example from the passage.",
        complete: containsQuoteOrEvidenceLanguage(trimmed),
      },
      {
        label: "Your evidence is developed, not just one short phrase.",
        complete: trimmed.length >= 70,
      },
      {
        label: "Your evidence connects to your answer from Box 1.",
        complete: trimmed.length >= 40,
      },
    ];
  }

  return [
    {
      label: "You wrote at least 3 sentences.",
      complete: sentenceCount >= 3,
    },
    {
      label: "You explained how the evidence supports your answer.",
      complete: containsReasoningLanguage(trimmed),
    },
    {
      label: "Your explanation adds thinking, not just repeated evidence.",
      complete: trimmed.length >= 90,
    },
    {
      label: "Your reasoning is clear and complete.",
      complete: trimmed.length >= 120,
    },
  ];
}

function DraftSupportCard({ boxNumber, answer, skill, locked = false }) {
  const sentenceCount = countSentences(answer);
  const wordCount = answer.trim().split(/\s+/).filter(Boolean).length;

  const checklist = useMemo(
    () => getDraftChecklist(boxNumber, answer, skill),
    [boxNumber, answer, skill]
  );

  const completedCount = checklist.filter((item) => item.complete).length;
  const allComplete = checklist.every((item) => item.complete);

  if (locked) {
    return (
      <div className="mb-4 rounded-xl border border-slate-700 bg-slate-950/60 p-4">
        <p className="text-sm text-slate-400">
          This live checklist will appear once this box is unlocked.
        </p>
      </div>
    );
  }

  return (
    <div className="mb-4 rounded-xl border border-violet-700 bg-violet-900/20 p-4">
      <div className="mb-3 flex flex-wrap items-center gap-4">
        <div className="rounded-lg bg-slate-950 px-3 py-2">
          <p className="text-xs uppercase tracking-wide text-slate-400">
            Sentences
          </p>
          <p className="text-base font-semibold text-white">{sentenceCount}</p>
        </div>

        <div className="rounded-lg bg-slate-950 px-3 py-2">
          <p className="text-xs uppercase tracking-wide text-slate-400">
            Words
          </p>
          <p className="text-base font-semibold text-white">{wordCount}</p>
        </div>

        <div className="rounded-lg bg-slate-950 px-3 py-2">
          <p className="text-xs uppercase tracking-wide text-slate-400">
            Checklist
          </p>
          <p
            className={`text-base font-semibold ${
              allComplete ? "text-emerald-300" : "text-amber-300"
            }`}
          >
            {completedCount}/{checklist.length} ready
          </p>
        </div>
      </div>

      <div className="space-y-2">
        {checklist.map((item, index) => (
          <div
            key={`draft-check-${boxNumber}-${index}`}
            className={`rounded-lg border p-3 text-sm ${
              item.complete
                ? "border-emerald-800 bg-emerald-900/20 text-emerald-300"
                : "border-amber-800 bg-amber-900/20 text-amber-300"
            }`}
          >
            <span className="mr-2 font-semibold">
              {item.complete ? "✓" : "!"}
            </span>
            {item.label}
          </div>
        ))}
      </div>

      {!allComplete && (
        <div className="mt-3 rounded-lg border border-slate-700 bg-slate-950 p-3">
          <p className="text-sm text-slate-300">
            Keep writing until the checklist is green. That gives you a much
            better chance of passing before the AI checks your response.
          </p>
        </div>
      )}
    </div>
  );
}

function LessonDemoPageContent() {
  const searchParams = useSearchParams();

  const standard = searchParams.get("standard") || "ELA.9.R.1.1";
  const skill = searchParams.get("skill") || "Theme";
  const textType = searchParams.get("textType") || "Literary Passage";
  const difficulty = searchParams.get("difficulty") || "On Grade Level";

  const skillInfo = getSkillInstruction(skill);
  const questions = getQuestionSet(skill);
  const passage = getPassage();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [period, setPeriod] = useState("");

  const [answer1, setAnswer1] = useState("");
  const [answer2, setAnswer2] = useState("");
  const [answer3, setAnswer3] = useState("");

  const [result1, setResult1] = useState(null);
  const [result2, setResult2] = useState(null);
  const [result3, setResult3] = useState(null);

  const [loading1, setLoading1] = useState(false);
  const [loading2, setLoading2] = useState(false);
  const [loading3, setLoading3] = useState(false);
  const [savingSubmission, setSavingSubmission] = useState(false);

  const [attempts1, setAttempts1] = useState([]);
  const [attempts2, setAttempts2] = useState([]);
  const [attempts3, setAttempts3] = useState([]);

  const [submitted, setSubmitted] = useState(false);

  const studentReady =
    firstName.trim().length > 0 &&
    lastName.trim().length > 0 &&
    period.trim().length > 0;

  const studentDisplayName = studentReady
    ? `${firstName.trim()} ${lastName.trim()}`
    : "Demo Student";

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
  )}&student=${encodeURIComponent(
    studentDisplayName
  )}&period=${encodeURIComponent(
    period || "Not Set"
  )}&status=${encodeURIComponent(
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
    if (!studentReady) return;

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
    if (!studentReady || !box1Passed) return;

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
    if (!studentReady || !box2Passed) return;

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

  async function handleSubmit() {
    if (!studentReady || !allPassed) return;

    setSavingSubmission(true);

    try {
      const payload = {
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        period,
        standard,
        skill,
        textType,
        difficulty,
        box1Score: result1?.overallScore || 0,
        box2Score: result2?.overallScore || 0,
        box3Score: result3?.overallScore || 0,
        latestAverage,
        attemptsBox1: attempts1.length,
        attemptsBox2: attempts2.length,
        attemptsBox3: attempts3.length,
        status: "Completed",
        progress: "3-Box Mastery Complete",
      };

      const saved = await saveStudentResponse(payload);

      if (!saved.ok || !saved.success) {
        alert(saved?.error || "Failed to save student response.");
        return;
      }

      setSubmitted(true);
    } catch (error) {
      alert(error?.message || "Failed to save student response.");
    } finally {
      setSavingSubmission(false);
    }
  }

  return (
    <main className="min-h-screen bg-slate-950 p-8 text-white">
      <div className="mx-auto max-w-6xl">
        <h1 className="mb-4 text-4xl font-bold">Student Lesson</h1>
        <p className="mb-8 text-slate-300">
          Work through the lesson step by step. Each box must pass AI evaluation
          before the next one unlocks.
        </p>

        <div className="mb-6 rounded-2xl border border-amber-700 bg-amber-900/20 p-6">
          <h2 className="mb-4 text-2xl font-semibold">Student Check-In</h2>

          <div className="grid gap-4 md:grid-cols-3">
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-200">
                First Name
              </label>
              <input
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="w-full rounded-xl border border-slate-700 bg-slate-950 p-3 text-white"
                placeholder="Enter first name"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-200">
                Last Name
              </label>
              <input
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="w-full rounded-xl border border-slate-700 bg-slate-950 p-3 text-white"
                placeholder="Enter last name"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-200">
                Period
              </label>
              <select
                value={period}
                onChange={(e) => setPeriod(e.target.value)}
                className="w-full rounded-xl border border-slate-700 bg-slate-950 p-3 text-white"
              >
                <option value="">Select period</option>
                <option value="Pd 1">Pd 1</option>
                <option value="Pd 2">Pd 2</option>
                <option value="Pd 3">Pd 3</option>
                <option value="Pd 4">Pd 4</option>
                <option value="Pd 5">Pd 5</option>
                <option value="Pd 6">Pd 6</option>
                <option value="Pd 7">Pd 7</option>
                <option value="Pd 8">Pd 8</option>
              </select>
            </div>
          </div>

          {!studentReady ? (
            <div className="mt-4 rounded-xl border border-amber-800 bg-slate-950 p-3 text-amber-300">
              Enter first name, last name, and period before starting the
              lesson.
            </div>
          ) : (
            <div className="mt-4 rounded-xl border border-emerald-800 bg-emerald-900/20 p-3 text-emerald-300">
              Ready: {studentDisplayName} — {period}
            </div>
          )}
        </div>

        <div className="mb-6 rounded-2xl bg-slate-900 p-6">
          <h2 className="mb-3 text-2xl font-semibold">Lesson Info</h2>
          <p className="text-slate-300">
            <span className="font-semibold text-white">Standard:</span>{" "}
            {standard}
          </p>
          <p className="mt-2 text-slate-300">
            <span className="font-semibold text-white">Skill:</span> {skill}
          </p>
          <p className="mt-2 text-slate-300">
            <span className="font-semibold text-white">Text Type:</span>{" "}
            {textType}
          </p>
          <p className="mt-2 text-slate-300">
            <span className="font-semibold text-white">Difficulty:</span>{" "}
            {difficulty}
          </p>
        </div>

        <div className="mb-6 rounded-2xl border border-cyan-700 bg-cyan-900/20 p-6">
          <h2 className="mb-4 text-2xl font-semibold">{skillInfo.title}</h2>

          <p className="mb-4 text-slate-200">
            <span className="font-semibold text-white">
              What this skill means:
            </span>{" "}
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
            <p className="mb-2 font-semibold text-white">
              How to find the answer:
            </p>
            <p className="text-slate-300">{skillInfo.howToFind}</p>
          </div>

          <div>
            <p className="mb-2 font-semibold text-white">
              What a strong response should do:
            </p>
            <ul className="list-disc space-y-2 pl-6 text-slate-300">
              {skillInfo.responseTips.map((item, index) => (
                <li key={`tip-${index}`}>{item}</li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mb-6 rounded-2xl border border-emerald-700 bg-emerald-900/20 p-6">
          <h2 className="mb-3 text-2xl font-semibold">
            How to Pass This Lesson
          </h2>
          <ul className="list-disc space-y-2 pl-6 text-slate-200">
            <li>Answer the actual question directly.</li>
            <li>Write in complete sentences.</li>
            <li>
              Use relevant details from the passage when asked for evidence.
            </li>
            <li>
              Explain your thinking clearly instead of giving only a short
              answer.
            </li>
            <li>A strong response usually scores 80 or higher.</li>
          </ul>
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
              <p className="mt-2 text-xl font-bold">
                {box1Passed ? "Passed" : "Locked In Progress"}
              </p>
            </div>
            <div className="rounded-xl bg-slate-950 p-4">
              <p className="text-sm text-slate-400">Box 2</p>
              <p className="mt-2 text-xl font-bold">
                {box2Passed ? "Passed" : box1Passed ? "Unlocked" : "Locked"}
              </p>
            </div>
            <div className="rounded-xl bg-slate-950 p-4">
              <p className="text-sm text-slate-400">Box 3</p>
              <p className="mt-2 text-xl font-bold">
                {box3Passed ? "Passed" : box2Passed ? "Unlocked" : "Locked"}
              </p>
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

          <GuidanceCard
            title="What to include in Box 1"
            bullets={[
              "Write 3–5 complete sentences.",
              "State your answer clearly in the first sentence.",
              "Name the theme, main idea, inference, or meaning directly.",
              "Stay focused on the question instead of summarizing the whole passage.",
            ]}
            starter={
              skill === "Theme"
                ? "A central theme of the passage is..."
                : skill === "Main Idea"
                ? "The main idea of the passage is..."
                : skill === "Inference"
                ? "I can infer that..."
                : skill === "Context Clues"
                ? "The word most likely means..."
                : "The passage shows that..."
            }
            passNote="To pass Box 1, your answer should clearly respond to the prompt and show accurate understanding of the passage."
          />

          <DraftSupportCard boxNumber={1} answer={answer1} skill={skill} />

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
              disabled={loading1 || !studentReady}
              className={`rounded-2xl px-6 py-3 font-semibold ${
                loading1 || !studentReady
                  ? "cursor-not-allowed bg-slate-700 text-slate-400"
                  : "border border-cyan-500 text-cyan-300 hover:bg-slate-800"
              }`}
            >
              {loading1
                ? "Evaluating..."
                : attempts1.length === 0
                ? "Check Box 1"
                : "Re-check Box 1"}
            </button>
            <span className="self-center text-slate-400">
              Attempts: {attempts1.length}
            </span>
          </div>

          {!studentReady && (
            <div className="mt-4 rounded-xl border border-amber-700 bg-amber-900/20 p-3 text-amber-300">
              Student information is required before Box 1 can be checked.
            </div>
          )}

          {result1 && (
            <div className="mt-4">
              <FeedbackCard title="Box 1" result={result1} />
            </div>
          )}
        </div>

        <div
          className={`mb-6 rounded-2xl p-6 ${
            box1Passed ? "bg-slate-900" : "bg-slate-900/50 opacity-60"
          }`}
        >
          <h2 className="mb-4 text-2xl font-semibold">Box 2: Evidence</h2>
          <label className="mb-2 block text-slate-300">{questions[1]}</label>

          <GuidanceCard
            title="What to include in Box 2"
            bullets={[
              "Write 2–4 complete sentences.",
              "Use one or two specific details from the passage.",
              "You may quote or paraphrase the evidence.",
              "Choose evidence that directly proves your Box 1 answer.",
            ]}
            starter="One detail that supports this idea is..."
            passNote="To pass Box 2, your evidence should be specific, relevant, and clearly connected to your answer."
          />

          <DraftSupportCard
            boxNumber={2}
            answer={answer2}
            skill={skill}
            locked={!box1Passed}
          />

          <textarea
            value={answer2}
            onChange={(e) => {
              setAnswer2(e.target.value);
              setSubmitted(false);
            }}
            disabled={!box1Passed}
            className="min-h-[160px] w-full rounded-xl border border-slate-700 bg-slate-950 p-4 text-white disabled:cursor-not-allowed disabled:opacity-60"
            placeholder={
              box1Passed
                ? "Use specific text evidence."
                : "Pass Box 1 to unlock Box 2."
            }
          />

          <div className="mt-4 flex flex-wrap gap-4">
            <button
              onClick={handleEvaluateBox2}
              disabled={!box1Passed || !studentReady || loading2}
              className={`rounded-2xl px-6 py-3 font-semibold ${
                !box1Passed || !studentReady || loading2
                  ? "cursor-not-allowed bg-slate-700 text-slate-400"
                  : "border border-cyan-500 text-cyan-300 hover:bg-slate-800"
              }`}
            >
              {loading2
                ? "Evaluating..."
                : attempts2.length === 0
                ? "Check Box 2"
                : "Re-check Box 2"}
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

          {result2 && (
            <div className="mt-4">
              <FeedbackCard title="Box 2" result={result2} />
            </div>
          )}
        </div>

        <div
          className={`mb-6 rounded-2xl p-6 ${
            box2Passed ? "bg-slate-900" : "bg-slate-900/50 opacity-60"
          }`}
        >
          <h2 className="mb-4 text-2xl font-semibold">Box 3: Explanation</h2>
          <label className="mb-2 block text-slate-300">{questions[2]}</label>

          <GuidanceCard
            title="What to include in Box 3"
            bullets={[
              "Write 3–5 complete sentences.",
              "Explain how the evidence supports your answer.",
              "Use reasoning phrases like 'this shows,' 'this suggests,' or 'this develops.'",
              "Do not just repeat the evidence—interpret it.",
            ]}
            starter="This evidence shows that..."
            passNote="To pass Box 3, your explanation should make the connection between your evidence and your answer completely clear."
          />

          <DraftSupportCard
            boxNumber={3}
            answer={answer3}
            skill={skill}
            locked={!box2Passed}
          />

          <textarea
            value={answer3}
            onChange={(e) => {
              setAnswer3(e.target.value);
              setSubmitted(false);
            }}
            disabled={!box2Passed}
            className="min-h-[160px] w-full rounded-xl border border-slate-700 bg-slate-950 p-4 text-white disabled:cursor-not-allowed disabled:opacity-60"
            placeholder={
              box2Passed
                ? "Explain your reasoning clearly."
                : "Pass Box 2 to unlock Box 3."
            }
          />

          <div className="mt-4 flex flex-wrap gap-4">
            <button
              onClick={handleEvaluateBox3}
              disabled={!box2Passed || !studentReady || loading3}
              className={`rounded-2xl px-6 py-3 font-semibold ${
                !box2Passed || !studentReady || loading3
                  ? "cursor-not-allowed bg-slate-700 text-slate-400"
                  : "border border-cyan-500 text-cyan-300 hover:bg-slate-800"
              }`}
            >
              {loading3
                ? "Evaluating..."
                : attempts3.length === 0
                ? "Check Box 3"
                : "Re-check Box 3"}
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

          {result3 && (
            <div className="mt-4">
              <FeedbackCard title="Box 3" result={result3} />
            </div>
          )}
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
              disabled={!allPassed || !studentReady || savingSubmission}
              className={`rounded-2xl px-6 py-3 font-semibold ${
                allPassed && studentReady && !savingSubmission
                  ? "bg-cyan-500 text-slate-950 hover:bg-cyan-400"
                  : "cursor-not-allowed bg-slate-700 text-slate-400"
              }`}
            >
              {savingSubmission ? "Saving..." : "Submit Response"}
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

          {!studentReady && (
            <div className="mt-4 rounded-2xl border border-amber-700 bg-amber-900/20 p-4 text-amber-300">
              Submission is locked until student first name, last name, and
              period are entered.
            </div>
          )}

          {studentReady && !allPassed && (
            <div className="mt-4 rounded-2xl border border-amber-700 bg-amber-900/20 p-4 text-amber-300">
              Submission is locked. All three boxes must pass AI evaluation
              before you can finish the lesson.
            </div>
          )}
        </div>

        {submitted && (
          <div className="space-y-4">
            <div className="rounded-2xl border border-emerald-700 bg-emerald-900/20 p-4 text-emerald-300">
              Lesson complete. You passed all three boxes, met the mastery
              threshold, and your response was saved.
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

function LessonDemoFallback() {
  return (
    <main className="min-h-screen bg-slate-950 p-8 text-white">
      <div className="mx-auto max-w-6xl">
        <div className="rounded-2xl bg-slate-900 p-6">
          <h1 className="text-3xl font-bold">Loading lesson...</h1>
          <p className="mt-2 text-slate-300">Preparing lesson demo.</p>
        </div>
      </div>
    </main>
  );
}

export default function LessonDemoPage() {
  return (
    <Suspense fallback={<LessonDemoFallback />}>
      <LessonDemoPageContent />
    </Suspense>
  );
}