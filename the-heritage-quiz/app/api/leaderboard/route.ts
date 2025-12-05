import { NextResponse } from "next/server";
import prisma from "../../../lib/prisma";

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const limitParam = Number(url.searchParams.get("limit") ?? 20);
    const limit = Math.max(
      1,
      Math.min(100, isNaN(limitParam) ? 20 : limitParam)
    );

    const topUsers = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        image: true,
        email: true,
        scores: {
          select: {
            points: true,
          },
        },
      },
      orderBy: {
        scores: {
          _count: "desc",
        },
      },
      take: limit,
    });

    // Calculate leaderboard with rank
    const leaderboard = topUsers.map((user, index) => {
      const totalPoints = user.scores.reduce((sum, s) => sum + s.points, 0);
      return {
        rank: index + 1,
        userId: user.id,
        name: user.name || "Anonymous",
        image: user.image,
        email: user.email,
        totalPoints,
      };
    });

    return NextResponse.json({ leaderboard });
  } catch (err: any) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
