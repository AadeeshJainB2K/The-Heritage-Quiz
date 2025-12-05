import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../../lib/auth";
import prisma from "../../../lib/prisma";
import { MATCHER_ITEMS } from "../../../lib/matcher-data";

export async function POST(req: Request) {
  try {
    const session = (await getServerSession(authOptions as any)) as any;
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const body = await req.json();
    const matches = body?.matches as { itemId: string; state: string }[];

    if (!Array.isArray(matches)) {
      return NextResponse.json({ error: "Invalid matches" }, { status: 400 });
    }

    let score = 0;
    const results = matches.map((match) => {
      const item = MATCHER_ITEMS.find((i) => i.id === match.itemId);
      const isCorrect = item && item.correctState === match.state;
      if (isCorrect) score++;
      return {
        itemId: match.itemId,
        selectedState: match.state,
        correctState: item?.correctState,
        isCorrect,
      };
    });

    const userId = session.user.id;

    // Get or create score record
    let scoreRecord = await prisma.score.findFirst({
      where: { userId },
    });

    if (!scoreRecord) {
      scoreRecord = await prisma.score.create({
        data: { userId, points: score },
      });
    } else {
      // Add to existing score
      scoreRecord = await prisma.score.update({
        where: { id: scoreRecord.id },
        data: { points: scoreRecord.points + score },
      });
    }

    // Record this play as a MatcherSession for history
    try {
      await prisma.matcherSession.create({
        data: {
          userId,
          score,
          total: matches.length,
          details: { results },
        },
      });
    } catch (e) {
      // non-fatal: if history recording fails, continue
      console.error("Failed to record matcher session:", e);
    }

    return NextResponse.json({
      score,
      totalPoints: scoreRecord.points,
      results,
      message: `You got ${score}/${matches.length} correct!`,
    });
  } catch (err: any) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    const session = (await getServerSession(authOptions as any)) as any;
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const userId = session.user.id;
    const scoreRecord = await prisma.score.findFirst({
      where: { userId },
    });

    return NextResponse.json({
      points: scoreRecord?.points || 0,
    });
  } catch (err: any) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
