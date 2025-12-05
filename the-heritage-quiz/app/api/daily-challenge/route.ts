import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../../lib/auth";
import prisma from "../../../lib/prisma";
import { QUIZ_QUESTIONS } from "../../../lib/quiz-data";

// Helper to get today's date at midnight UTC
function getTodayDate(): Date {
  const now = new Date();
  return new Date(
    Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate())
  );
}

export async function GET(req: Request) {
  try {
    const session = (await getServerSession(authOptions as any)) as any;
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const userId = session.user.id as string;
    const today = getTodayDate();

    // Get today's challenge (deterministic based on date)
    const dayOfYear = Math.floor(
      (today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) /
        86400000
    );
    const challengeIndex = dayOfYear % QUIZ_QUESTIONS.length;
    const dailyQuestion = QUIZ_QUESTIONS[challengeIndex];

    // Check if user completed challenge today
    // For now, we'll store this in Score metadata or create a separate table
    // For MVP, we'll just track if they completed it

    return NextResponse.json({
      question: dailyQuestion,
      date: today.toISOString().split("T")[0],
      bonusPoints: 5, // bonus for completing daily challenge
    });
  } catch (err: any) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = (await getServerSession(authOptions as any)) as any;
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const body = await req.json();
    const { questionId, selectedIndex } = body;

    if (questionId === undefined || selectedIndex === undefined) {
      return NextResponse.json({ error: "Invalid answer" }, { status: 400 });
    }

    const question = QUIZ_QUESTIONS.find((q) => q.id === questionId);
    if (!question) {
      return NextResponse.json(
        { error: "Question not found" },
        { status: 404 }
      );
    }

    const isCorrect = question.correctAnswerIndex === selectedIndex;
    const bonusPoints = isCorrect ? 5 : 0;

    const userId = session.user.id;

    // Update score with bonus
    let scoreRecord = await prisma.score.findFirst({ where: { userId } });
    if (!scoreRecord) {
      scoreRecord = await prisma.score.create({
        data: { userId, points: bonusPoints },
      });
    } else {
      scoreRecord = await prisma.score.update({
        where: { id: scoreRecord.id },
        data: { points: scoreRecord.points + bonusPoints },
      });
    }

    return NextResponse.json({
      isCorrect,
      bonusPoints,
      totalPoints: scoreRecord.points,
      message: isCorrect
        ? "Correct! +5 bonus points!"
        : "Incorrect. Try again tomorrow!",
    });
  } catch (err: any) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
