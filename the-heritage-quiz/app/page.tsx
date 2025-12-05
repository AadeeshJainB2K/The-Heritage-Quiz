"use client";

import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <main style={{ padding: 24, maxWidth: 1000, margin: "0 auto" }}>
      <h1>The Heritage Quiz</h1>
      <p style={{ fontSize: 18, marginBottom: 24 }}>
        Explore Indian monuments, foods, dances and earn points while you learn.
      </p>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
          gap: 20,
          marginBottom: 30,
        }}
      >
        {/* Monument Identification */}
        <Link href="/monument" style={{ textDecoration: "none" }}>
          <div
            style={{
              padding: 24,
              border: "2px solid #0070f3",
              borderRadius: 8,
              backgroundColor: "#f0f4ff",
              cursor: "pointer",
              transition: "all 0.2s",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLDivElement).style.boxShadow =
                "0 4px 12px rgba(0,112,243,0.3)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLDivElement).style.boxShadow = "none";
            }}
          >
            <h2 style={{ margin: "0 0 12px 0", color: "#0070f3" }}>
              📸 Monument Identification
            </h2>
            <p style={{ margin: 0, color: "#666" }}>
              Take or upload a photo of a monument and let AI identify it for
              you. See it on Google Maps!
            </p>
          </div>
        </Link>

        {/* State Matcher */}
        <Link href="/matcher" style={{ textDecoration: "none" }}>
          <div
            style={{
              padding: 24,
              border: "2px solid #28a745",
              borderRadius: 8,
              backgroundColor: "#f0fff0",
              cursor: "pointer",
              transition: "all 0.2s",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLDivElement).style.boxShadow =
                "0 4px 12px rgba(40,167,69,0.3)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLDivElement).style.boxShadow = "none";
            }}
          >
            <h2 style={{ margin: "0 0 12px 0", color: "#28a745" }}>
              🎮 State Matcher
            </h2>
            <p style={{ margin: 0, color: "#666" }}>
              Match Indian foods and dance forms to their states. Build your
              score!
            </p>
          </div>
        </Link>

        {/* Facts */}
        <Link href="/facts" style={{ textDecoration: "none" }}>
          <div
            style={{
              padding: 24,
              border: "2px solid #ffc107",
              borderRadius: 8,
              backgroundColor: "#fffbf0",
              cursor: "pointer",
              transition: "all 0.2s",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLDivElement).style.boxShadow =
                "0 4px 12px rgba(255,193,7,0.3)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLDivElement).style.boxShadow = "none";
            }}
          >
            <h2 style={{ margin: "0 0 12px 0", color: "#ffc107" }}>
              💡 Random Facts
            </h2>
            <p style={{ margin: 0, color: "#666" }}>
              Discover interesting facts about Indian states, cultures and
              landmarks.
            </p>
          </div>
        </Link>

        {/* Quiz Mode */}
        <Link href="/quiz" style={{ textDecoration: "none" }}>
          <div
            style={{
              padding: 24,
              border: "2px solid #9c27b0",
              borderRadius: 8,
              backgroundColor: "#f3e5f5",
              cursor: "pointer",
              transition: "all 0.2s",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLDivElement).style.boxShadow =
                "0 4px 12px rgba(156,39,176,0.3)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLDivElement).style.boxShadow = "none";
            }}
          >
            <h2 style={{ margin: "0 0 12px 0", color: "#9c27b0" }}>
              📝 Heritage Quiz
            </h2>
            <p style={{ margin: 0, color: "#666" }}>
              Test your knowledge with our comprehensive quiz about Indian
              heritage, monuments, and culture.
            </p>
          </div>
        </Link>

        {/* Daily Challenge */}
        <Link href="/daily-challenge" style={{ textDecoration: "none" }}>
          <div
            style={{
              padding: 24,
              border: "2px solid #ff9800",
              borderRadius: 8,
              backgroundColor: "#fff3e0",
              cursor: "pointer",
              transition: "all 0.2s",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLDivElement).style.boxShadow =
                "0 4px 12px rgba(255,152,0,0.3)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLDivElement).style.boxShadow = "none";
            }}
          >
            <h2 style={{ margin: "0 0 12px 0", color: "#ff9800" }}>
              🔥 Daily Challenge
            </h2>
            <p style={{ margin: 0, color: "#666" }}>
              Answer today's question for bonus points! A new challenge awaits
              every day.
            </p>
          </div>
        </Link>

        {/* Leaderboard */}
        <Link href="/leaderboard" style={{ textDecoration: "none" }}>
          <div
            style={{
              padding: 24,
              border: "2px solid #e91e63",
              borderRadius: 8,
              backgroundColor: "#fce4ec",
              cursor: "pointer",
              transition: "all 0.2s",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLDivElement).style.boxShadow =
                "0 4px 12px rgba(233,30,99,0.3)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLDivElement).style.boxShadow = "none";
            }}
          >
            <h2 style={{ margin: "0 0 12px 0", color: "#e91e63" }}>
              🏆 Leaderboard
            </h2>
            <p style={{ margin: 0, color: "#666" }}>
              See how you rank against other players. Compete and climb the
              leaderboard!
            </p>
          </div>
        </Link>
      </div>

      <div
        style={{
          marginTop: 40,
          padding: 20,
          backgroundColor: "#f5f5f5",
          borderRadius: 8,
        }}
      >
        <h3>How to Get Started</h3>
        <ol style={{ margin: "12px 0", paddingLeft: 20 }}>
          <li>Sign in with your Google account to track your progress</li>
          <li>
            Visit any of the features above to earn points and learn about India
          </li>
          <li>Complete the Daily Challenge for bonus points</li>
          <li>Take the Heritage Quiz to test your knowledge</li>
          <li>Your scores will be saved and displayed on the Leaderboard</li>
          <li>View monuments on Google Maps to virtually explore them</li>
        </ol>
      </div>
    </main>
  );
}
