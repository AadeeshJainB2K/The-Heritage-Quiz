import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../../lib/auth";
import prisma from "../../../lib/prisma";
import { QUIZ_QUESTIONS } from "../../../lib/quiz-data";

export async function POST(req: Request) {
  try {
    const session = (await getServerSession(authOptions as any)) as any;
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const body = await req.json();
    const { answers } = body; // { questionId: number; selectedIndex: number }[]

    if (!Array.isArray(answers)) {
      return NextResponse.json({ error: "Invalid answers" }, { status: 400 });
    }

    let score = 0;
    const results = answers.map((ans: any) => {
      const question = QUIZ_QUESTIONS.find((q) => q.id === ans.questionId);
      const isCorrect =
        question && question.correctAnswerIndex === ans.selectedIndex;
      if (isCorrect) score++;
      return {
        questionId: ans.questionId,
        selectedIndex: ans.selectedIndex,
        correctIndex: question?.correctAnswerIndex,
        isCorrect,
      };
    });

    const userId = session.user.id;

    // Update total score
    let scoreRecord = await prisma.score.findFirst({ where: { userId } });
    if (!scoreRecord) {
      scoreRecord = await prisma.score.create({
        data: { userId, points: score },
      });
    } else {
      scoreRecord = await prisma.score.update({
        where: { id: scoreRecord.id },
        data: { points: scoreRecord.points + score },
      });
    }

    return NextResponse.json({
      score,
      total: answers.length,
      results,
      totalPoints: scoreRecord.points,
      message: `You got ${score}/${answers.length} correct!`,
    });
  } catch (err: any) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
