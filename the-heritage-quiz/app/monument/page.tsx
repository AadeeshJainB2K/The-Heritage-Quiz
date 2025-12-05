"use client";

import React, { useState } from "react";

export default function MonumentIdentificationPage() {
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setPreview(reader.result as string);
    reader.readAsDataURL(file);
  }

  async function identify() {
    if (!preview) return;
    setLoading(true);
    setResult(null);
    setError(null);
    try {
      const res = await fetch("/api/monument", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image: preview }),
      });
      const data = await res.json();
      if (data?.error) {
        setError(data.error);
      } else {
        setResult(data.monument);
      }
    } catch (err) {
      setError(String(err));
    } finally {
      setLoading(false);
    }
  }

  function reset() {
    setPreview(null);
    setResult(null);
    setError(null);
  }

  return (
    <main style={{ padding: 20, maxWidth: 800, margin: "0 auto" }}>
      <h1>Monument Identification</h1>
      <p>Upload or take a photo of an Indian monument to identify it using AI.</p>

      {!result && !error && (
        <>
          <div style={{ marginTop: 20 }}>
            <label
              htmlFor="file-input"
              style={{
                display: "inline-block",
                padding: "12px 24px",
                backgroundColor: "#0070f3",
                color: "white",
                borderRadius: 4,
                cursor: "pointer",
                fontWeight: "bold",
              }}
            >
              Choose Image
            </label>
            <input
              id="file-input"
              type="file"
              accept="image/*"
              capture="environment"
              onChange={handleFile}
              style={{ display: "none" }}
            />
          </div>

          {preview && (
            <div style={{ marginTop: 24 }}>
              <img
                src={preview}
                alt="preview"
                style={{
                  maxWidth: "100%",
                  height: "auto",
                  borderRadius: 8,
                  border: "2px solid #ddd",
                }}
              />
              <div style={{ marginTop: 16 }}>
                <button
                  onClick={identify}
                  disabled={loading}
                  style={{
                    padding: "12px 24px",
                    backgroundColor: "#28a745",
                    color: "white",
                    border: "none",
                    borderRadius: 4,
                    cursor: loading ? "not-allowed" : "pointer",
                    fontWeight: "bold",
                    fontSize: 16,
                  }}
                >
                  {loading ? "Identifying..." : "Identify Monument"}
                </button>
              </div>
            </div>
          )}
        </>
      )}

      {error && (
        <div
          style={{
            marginTop: 24,
            padding: 16,
            backgroundColor: "#fff3cd",
            border: "2px solid #ff9800",
            borderRadius: 8,
            color: "#666",
          }}
        >
          <h3 style={{ margin: "0 0 8px 0", color: "#ff9800" }}>Error</h3>
          <p style={{ margin: 0 }}>{error}</p>
          <button
            onClick={reset}
            style={{
              marginTop: 12,
              padding: "8px 16px",
              backgroundColor: "#ff9800",
              color: "white",
              border: "none",
              borderRadius: 4,
              cursor: "pointer",
            }}
          >
            Try Another Image
          </button>
        </div>
      )}

      {result && (
        <div
          style={{
            marginTop: 24,
            padding: 20,
            backgroundColor: "#f0f4ff",
            border: "2px solid #0070f3",
            borderRadius: 8,
          }}
        >
          <h2 style={{ margin: "0 0 16px 0", color: "#0070f3" }}>
            {result["Monument name"] || "Monument Identified"}
          </h2>

          <div style={{ marginBottom: 16 }}>
            <div style={{ marginBottom: 12 }}>
              <strong style={{ color: "#0070f3" }}>Location:</strong>
              <p style={{ margin: "4px 0 0 0", fontSize: 16 }}>
                {result["Location/State in India"]}
              </p>
            </div>

            <div style={{ marginBottom: 12 }}>
              <strong style={{ color: "#0070f3" }}>Confidence:</strong>
              <div
                style={{
                  marginTop: 4,
                  width: "100%",
                  backgroundColor: "#ddd",
                  borderRadius: 4,
                  overflow: "hidden",
                  height: 20,
                }}
              >
                <div
                  style={{
                    width: `${(result.Confidence || 0)}%`,
                    backgroundColor: "#28a745",
                    height: "100%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "white",
                    fontSize: 12,
                    fontWeight: "bold",
                  }}
                >
                  {result.Confidence}%
                </div>
              </div>
            </div>

            <div>
              <strong style={{ color: "#0070f3" }}>Description:</strong>
              <p style={{ margin: "8px 0 0 0", lineHeight: 1.6 }}>
                {result["Brief description"]}
              </p>
            </div>
          </div>

          <button
            onClick={reset}
            style={{
              padding: "10px 20px",
              backgroundColor: "#0070f3",
              color: "white",
              border: "none",
              borderRadius: 4,
              cursor: "pointer",
              fontWeight: "bold",
            }}
          >
            Identify Another Monument
          </button>
        </div>
      )}
    </main>
  );
}
          </pre>
        </div>
      )}
    </main>
  );
}
