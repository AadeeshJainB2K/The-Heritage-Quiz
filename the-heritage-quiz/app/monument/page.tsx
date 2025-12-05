"use client";

import React, { useState } from "react";
import { MONUMENTS, getMapsLink } from "../../lib/monument-locations";

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
      if (data.error) setError(data.error);
      else setResult(data.monument);
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

  // Try to find the monument in our database for Google Maps link
  const identifiedMonument = result
    ? MONUMENTS.find((m) =>
        m.name
          .toLowerCase()
          .includes((result["Monument name"] || "").toLowerCase())
      )
    : null;

  return (
    <main style={{ padding: 20, maxWidth: 800, margin: "0 auto" }}>
      <h1>Monument Identification</h1>
      <p>
        Upload or take a photo of an Indian monument to identify it using AI.
      </p>

      {/* UPLOAD AREA */}
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
                  borderRadius: 8,
                  border: "2px solid #ddd",
                }}
              />

              <button
                onClick={identify}
                disabled={loading}
                style={{
                  marginTop: 16,
                  padding: "12px 24px",
                  backgroundColor: "#28a745",
                  color: "white",
                  border: "none",
                  borderRadius: 4,
                  cursor: loading ? "not-allowed" : "pointer",
                  fontWeight: "bold",
                }}
              >
                {loading ? "Identifying..." : "Identify"}
              </button>
            </div>
          )}
        </>
      )}

      {/* ERROR */}
      {error && (
        <div style={{ marginTop: 20, color: "red" }}>
          <p>{error}</p>
          <button onClick={reset}>Try Again</button>
        </div>
      )}

      {result && (
        <div className="mt-6 p-6 bg-blue-50 border-2 border-blue-500 rounded-xl shadow">
          {/* 1. MONUMENT NAME */}
          <h2 className="text-2xl font-bold text-blue-600">
            {result["Monument name"] || "Monument Identified"}
          </h2>

          {/* 2. CONFIDENCE */}
          <div className="mt-4">
            <p className="font-semibold text-blue-600">Confidence:</p>

            <div className="w-full bg-gray-300 rounded h-5 mt-1 overflow-hidden">
              <div
                className="bg-green-600 h-full text-white text-xs flex items-center justify-center font-bold"
                style={{ width: `${result["Confidence"] || 0}%` }}
              >
                {result["Confidence"] || 0}%
              </div>
            </div>
          </div>

          {/* 3. LOCATION / STATE */}
          <p className="mt-4 text-lg">
            <span className="font-semibold text-blue-600">
              Location / State:
            </span>{" "}
            {result["Location/State in India"] || "Unknown"}
          </p>

          {/* 4. DESCRIPTION */}
          <div className="mt-4">
            <p className="font-semibold text-blue-600">Description:</p>
            <p className="mt-1 leading-relaxed">
              {result["Brief description"] || "No description available"}
            </p>
          </div>

          {/* 5. GOOGLE MAPS LINK */}
          {identifiedMonument && (
            <div
              style={{
                marginTop: 16,
                padding: 12,
                backgroundColor: "#fff",
                border: "1px solid #ccc",
                borderRadius: 6,
              }}
            >
              <p
                style={{
                  margin: "0 0 8px 0",
                  fontWeight: "bold",
                  color: "#0070f3",
                }}
              >
                🗺️ Virtually Visit This Monument
              </p>
              <a
                href={getMapsLink(identifiedMonument)}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: "inline-block",
                  padding: "8px 16px",
                  background: "#FF6B6B",
                  color: "#fff",
                  borderRadius: 4,
                  textDecoration: "none",
                  fontWeight: "bold",
                }}
              >
                View on Google Maps →
              </a>
              <p style={{ margin: "8px 0 0 0", fontSize: 12, color: "#666" }}>
                {identifiedMonument.location}, {identifiedMonument.state}
              </p>
            </div>
          )}

          <button
            onClick={reset}
            className="mt-6 px-5 py-2 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700"
          >
            Identify Another Monument
          </button>

          <details className="mt-4">
            <summary className="cursor-pointer text-blue-700">
              Raw response
            </summary>
            <pre className="bg-white p-3 mt-2 rounded border text-sm">
              {JSON.stringify(result, null, 2)}
            </pre>
          </details>
        </div>
      )}
    </main>
  );
}
