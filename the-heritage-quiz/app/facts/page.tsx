"use client";

import React, { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function FactsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [fact, setFact] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [viewedCount, setViewedCount] = useState(0);

  React.useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/signin");
    }
  }, [status, router]);

  async function loadFact() {
    setLoading(true);
    try {
      const res = await fetch("/api/facts");
      const data = await res.json();
      setFact(data.fact);
      setViewedCount(data.viewedCount);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  if (status === "loading") return <div>Loading...</div>;
  if (!session) return null;

  return (
    <main style={{ padding: 20, maxWidth: 800, margin: "0 auto" }}>
      <h1>Facts about Indian States</h1>
      <p>
        Learn interesting facts about India's states, cultures, and monuments.
      </p>

      <button
        onClick={loadFact}
        disabled={loading}
        style={{
          marginTop: 12,
          padding: "10px 20px",
          fontSize: 16,
          cursor: loading ? "not-allowed" : "pointer",
        }}
      >
        {loading ? "Loading..." : "Get Random Fact"}
      </button>

      {fact && (
        <div
          style={{
            marginTop: 24,
            padding: 20,
            border: "2px solid #0070f3",
            borderRadius: 8,
            backgroundColor: "#f0f4ff",
          }}
        >
          <h2 style={{ margin: "0 0 8px 0", color: "#0070f3" }}>
            {fact.state}
          </h2>
          <p style={{ margin: 0, fontSize: 18, lineHeight: 1.6 }}>
            {fact.fact}
          </p>
          <p style={{ margin: "12px 0 0 0", fontSize: 12, color: "#666" }}>
            Facts viewed: {viewedCount + 1} / 30
          </p>
        </div>
      )}

      {!fact && (
        <div
          style={{
            marginTop: 24,
            padding: 20,
            textAlign: "center",
            color: "#999",
          }}
        >
          Click "Get Random Fact" to start learning!
        </div>
      )}
    </main>
  );
}
