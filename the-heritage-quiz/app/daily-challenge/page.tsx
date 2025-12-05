"use client";

import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

type QuizQuestion = {
  id: number;
  category: string;
  difficulty: string;
  question: string;
  options: string[];
  correctAnswerIndex: number;
  explanation: string;
};

export default function DailyChallengesPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [question, setQuestion] = useState<QuizQuestion | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedIndex, setSelectedIndex] = useState<number>(-1);
  const [result, setResult] = useState<any>(null);
  const [submitting, setSubmitting] = useState(false);
  const [totalPoints, setTotalPoints] = useState(0);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/signin");
    } else if (status === "authenticated") {
      loadDailyChallenge();
    }
  }, [status, router]);

  async function loadDailyChallenge() {
    try {
      const res = await fetch("/api/daily-challenge");
      const data = await res.json();
      if (data.error) {
        setResult({ error: data.error });
      } else {
        setQuestion(data.question);
      }
    } catch (e: any) {
      setResult({ error: String(e) });
    } finally {
      setLoading(false);
    }
  }

  async function submitAnswer() {
    if (selectedIndex === -1) return;
    setSubmitting(true);
    try {
      const res = await fetch("/api/daily-challenge", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          questionId: question?.id,
          selectedIndex,
        }),
      });
      const data = await res.json();
      setResult(data);
      setTotalPoints(data.totalPoints || 0);
    } catch (e: any) {
      setResult({ error: String(e) });
    } finally {
      setSubmitting(false);
    }
  }

  if (status === "loading") return <div>Loading...</div>;
  if (!session) return null;

  return (
    <main style={{ padding: 20, maxWidth: 800, margin: "0 auto" }}>
      <h1>Daily Challenge</h1>
      <p style={{ fontSize: 14, color: "#666" }}>
        Answer today's question and earn +5 bonus points!
      </p>
      <p style={{ fontSize: 14, color: "#666", fontWeight: "bold" }}>
        Total Points: {totalPoints}
      </p>

      {loading && <p>Loading today's challenge...</p>}

      {result && result.error && (
        <div
          style={{
            color: "#8b0000",
            padding: 16,
            background: "#fff8f8",
            borderRadius: 8,
          }}
        >
          <p>{result.error}</p>
        </div>
      )}

      {!loading && !result && question && (
        <div
          style={{
            marginTop: 20,
            padding: 20,
            border: "1px solid #ddd",
            borderRadius: 8,
          }}
        >
          <h3>{question.question}</h3>
          <p style={{ fontSize: 12, color: "#999" }}>
            Difficulty: <strong>{question.difficulty}</strong> | Category:{" "}
            <strong>{question.category}</strong>
          </p>

          <div style={{ marginTop: 16 }}>
            {question.options.map((option, index) => (
              <div key={index} style={{ marginBottom: 8 }}>
                <button
                  onClick={() => setSelectedIndex(index)}
                  style={{
                    width: "100%",
                    padding: 12,
                    border:
                      selectedIndex === index
                        ? "2px solid #0070f3"
                        : "2px solid #ddd",
                    background: selectedIndex === index ? "#e3f2fd" : "#fff",
                    borderRadius: 4,
                    cursor: "pointer",
                    textAlign: "left",
                    fontWeight: selectedIndex === index ? "bold" : "normal",
                  }}
                >
                  {String.fromCharCode(65 + index)}. {option}
                </button>
              </div>
            ))}
          </div>

          <button
            onClick={submitAnswer}
            disabled={submitting || selectedIndex === -1}
            style={{
              marginTop: 16,
              padding: "10px 20px",
              background:
                selectedIndex === -1 || submitting ? "#ccc" : "#28a745",
              color: "#fff",
              border: "none",
              borderRadius: 4,
              cursor:
                selectedIndex === -1 || submitting ? "not-allowed" : "pointer",
              fontWeight: "bold",
            }}
          >
            {submitting ? "Submitting..." : "Submit Answer"}
          </button>
        </div>
      )}

      {result && !result.error && (
        <div
          style={{
            marginTop: 20,
            padding: 20,
            border: result.isCorrect ? "2px solid green" : "2px solid orange",
            background: result.isCorrect ? "#f0fff0" : "#fff8f0",
            borderRadius: 8,
          }}
        >
          <h3>{result.message}</h3>
          <div style={{ marginTop: 12 }}>
            <p>
              {result.isCorrect ? (
                <span style={{ color: "green", fontWeight: "bold" }}>
                  ✓ Correct Answer
                </span>
              ) : (
                <>
                  <span style={{ color: "red", fontWeight: "bold" }}>
                    ✗ Incorrect
                  </span>
                  <p style={{ marginTop: 8 }}>
                    The correct answer was:{" "}
                    <strong>
                      {question?.options[question.correctAnswerIndex]}
                    </strong>
                  </p>
                  <p style={{ marginTop: 8, fontSize: 14, color: "#666" }}>
                    {question?.explanation}
                  </p>
                </>
              )}
            </p>
          </div>

          {result.isCorrect && (
            <p
              style={{
                marginTop: 12,
                fontSize: 14,
                color: "green",
                fontWeight: "bold",
              }}
            >
              +{result.bonusPoints} bonus points! Come back tomorrow for another
              challenge.
            </p>
          )}

          <button
            onClick={() => router.push("/")}
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
            Back to Home
          </button>
        </div>
      )}
    </main>
  );
}
