"use client";

import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { QUIZ_QUESTIONS } from "../../lib/quiz-data";

export default function QuizPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [answers, setAnswers] = useState<
    { questionId: number; selectedIndex: number }[]
  >([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [totalPoints, setTotalPoints] = useState(0);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/signin");
    } else if (status === "authenticated") {
      // Initialize answers
      setAnswers(
        QUIZ_QUESTIONS.map((q) => ({ questionId: q.id, selectedIndex: -1 }))
      );
    }
  }, [status, router]);

  async function submitQuiz() {
    setLoading(true);
    try {
      const res = await fetch("/api/quiz", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ answers }),
      });
      const data = await res.json();
      setResult(data);
      setTotalPoints(data.totalPoints);
    } catch (err) {
      console.error(err);
      setResult({ error: String(err) });
    } finally {
      setLoading(false);
    }
  }

  function handleAnswer(questionId: number, selectedIndex: number) {
    setAnswers((prev) =>
      prev.map((a) =>
        a.questionId === questionId ? { ...a, selectedIndex } : a
      )
    );
  }

  function resetQuiz() {
    setAnswers(
      QUIZ_QUESTIONS.map((q) => ({ questionId: q.id, selectedIndex: -1 }))
    );
    setCurrentQuestion(0);
    setResult(null);
  }

  if (status === "loading") return <div>Loading...</div>;
  if (!session) return null;

  const question = QUIZ_QUESTIONS[currentQuestion];
  const currentAnswer = answers.find((a) => a.questionId === question.id);
  const allAnswered = answers.every((a) => a.selectedIndex !== -1);

  return (
    <main style={{ padding: 20, maxWidth: 800, margin: "0 auto" }}>
      <h1>Heritage Quiz</h1>
      <p style={{ fontSize: 14, color: "#666" }}>Total Points: {totalPoints}</p>

      {result && (
        <div
          style={{
            marginBottom: 20,
            padding: 16,
            border:
              result.score === QUIZ_QUESTIONS.length
                ? "2px solid green"
                : "2px solid orange",
            borderRadius: 8,
            backgroundColor:
              result.score === QUIZ_QUESTIONS.length ? "#f0fff0" : "#fff8f0",
          }}
        >
          <h2>{result.message}</h2>
          <button
            onClick={resetQuiz}
            style={{
              marginTop: 12,
              padding: "8px 16px",
              background: "#0070f3",
              color: "#fff",
              border: "none",
              borderRadius: 4,
              cursor: "pointer",
            }}
          >
            Retake Quiz
          </button>
        </div>
      )}

      {!result && (
        <>
          <div style={{ marginBottom: 20 }}>
            <div style={{ marginBottom: 8, fontSize: 12, color: "#666" }}>
              Question {currentQuestion + 1} / {QUIZ_QUESTIONS.length}
            </div>
            <div
              style={{
                width: "100%",
                height: 8,
                background: "#eee",
                borderRadius: 4,
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  height: "100%",
                  background: "#0070f3",
                  width: `${
                    ((currentQuestion + 1) / QUIZ_QUESTIONS.length) * 100
                  }%`,
                }}
              />
            </div>
          </div>

          <div
            style={{
              marginBottom: 20,
              padding: 16,
              border: "1px solid #eee",
              borderRadius: 8,
            }}
          >
            <h3 style={{ margin: "0 0 12px 0" }}>{question.question}</h3>
            <p style={{ fontSize: 12, color: "#999", marginBottom: 12 }}>
              Difficulty: <strong>{question.difficulty}</strong> | Category:{" "}
              <strong>{question.category}</strong>
            </p>

            <div>
              {question.options.map((option, index) => (
                <div key={index} style={{ marginBottom: 8 }}>
                  <button
                    onClick={() => handleAnswer(question.id, index)}
                    style={{
                      width: "100%",
                      padding: 12,
                      border:
                        currentAnswer?.selectedIndex === index
                          ? "2px solid #0070f3"
                          : "2px solid #ddd",
                      background:
                        currentAnswer?.selectedIndex === index
                          ? "#e3f2fd"
                          : "#fff",
                      borderRadius: 4,
                      cursor: "pointer",
                      textAlign: "left",
                      fontWeight:
                        currentAnswer?.selectedIndex === index
                          ? "bold"
                          : "normal",
                    }}
                  >
                    {String.fromCharCode(65 + index)}. {option}
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div style={{ display: "flex", gap: 12, marginBottom: 20 }}>
            <button
              onClick={() =>
                setCurrentQuestion(Math.max(0, currentQuestion - 1))
              }
              disabled={currentQuestion === 0}
              style={{
                padding: "8px 16px",
                background: currentQuestion === 0 ? "#ccc" : "#666",
                color: "#fff",
                border: "none",
                borderRadius: 4,
                cursor: currentQuestion === 0 ? "not-allowed" : "pointer",
              }}
            >
              Previous
            </button>

            {currentQuestion < QUIZ_QUESTIONS.length - 1 ? (
              <button
                onClick={() => setCurrentQuestion(currentQuestion + 1)}
                style={{
                  flex: 1,
                  padding: "8px 16px",
                  background: "#0070f3",
                  color: "#fff",
                  border: "none",
                  borderRadius: 4,
                  cursor: "pointer",
                }}
              >
                Next
              </button>
            ) : (
              <button
                onClick={submitQuiz}
                disabled={loading || !allAnswered}
                style={{
                  flex: 1,
                  padding: "8px 16px",
                  background: !allAnswered || loading ? "#ccc" : "#28a745",
                  color: "#fff",
                  border: "none",
                  borderRadius: 4,
                  cursor: !allAnswered || loading ? "not-allowed" : "pointer",
                }}
              >
                {loading ? "Submitting..." : "Submit Quiz"}
              </button>
            )}
          </div>
        </>
      )}

      {result && result.results && (
        <div style={{ marginTop: 20 }}>
          <h3>Review Answers</h3>
          {result.results.map((r: any) => {
            const q = QUIZ_QUESTIONS.find((q) => q.id === r.questionId);
            return (
              <div
                key={r.questionId}
                style={{
                  padding: 12,
                  marginBottom: 8,
                  background: r.isCorrect ? "#f0fff0" : "#fff8f0",
                  border: `2px solid ${r.isCorrect ? "green" : "orange"}`,
                  borderRadius: 4,
                }}
              >
                <strong>{q?.question}</strong>
                {r.isCorrect ? (
                  <p style={{ color: "green", margin: "4px 0" }}>
                    ✓ Correct: {q?.options[r.correctIndex]}
                  </p>
                ) : (
                  <div style={{ margin: "4px 0" }}>
                    <p style={{ color: "red", margin: 0 }}>
                      ✗ Your answer: {q?.options[r.selectedIndex]}
                    </p>
                    <p style={{ color: "green", margin: 0 }}>
                      Correct: {q?.options[r.correctIndex]}
                    </p>
                  </div>
                )}
                <p style={{ fontSize: 12, color: "#666", margin: "4px 0" }}>
                  {q?.explanation}
                </p>
              </div>
            );
          })}
        </div>
      )}
    </main>
  );
}
