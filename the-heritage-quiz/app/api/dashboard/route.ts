import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../../lib/auth";
import prisma from "../../../lib/prisma";

export async function GET(req: Request) {
  try {
    const session = (await getServerSession(authOptions as any)) as any;
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const userId = session.user.id as string;

    const scoreRecord = await prisma.score.findFirst({ where: { userId } });
    const factsCount = await prisma.viewedFact.count({ where: { userId } });
    const lastViewed = await prisma.viewedFact.findMany({
      where: { userId },
      orderBy: { viewedAt: "desc" },
      take: 5,
      select: { factId: true, viewedAt: true },
    });

    // Support pagination for sessions (limit & offset)
    const url = new URL(req.url);
    const limitParam = Number(url.searchParams.get("limit") ?? 10);
    const offsetParam = Number(url.searchParams.get("offset") ?? 0);
    const limit = Math.max(1, Math.min(50, isNaN(limitParam) ? 5 : limitParam));
    const offset = Math.max(0, isNaN(offsetParam) ? 0 : offsetParam);

    const sessions = await prisma.matcherSession.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      skip: offset,
      take: limit,
      select: { score: true, total: true, createdAt: true },
    });

    const sessionsCount = await prisma.matcherSession.count({
      where: { userId },
    });

    return NextResponse.json({
      points: scoreRecord?.points || 0,
      factsViewed: factsCount,
      lastViewed,
      sessions,
      sessionsCount,
    });
  } catch (err: any) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
