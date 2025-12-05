import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../../lib/auth";
import prisma from "../../../lib/prisma";
import { FACTS } from "../../../lib/facts";

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const userId = session.user.id;

    // Get all viewed facts for this user
    const viewedFacts = await prisma.viewedFact.findMany({
      where: { userId },
    });
    const viewedIds = new Set(viewedFacts.map((vf) => vf.factId));

    // Get unviewed facts
    const unviewedFacts = FACTS.filter((f) => !viewedIds.has(f.id));

    // If all viewed, reset and pick from all
    const factsToChooseFrom = unviewedFacts.length > 0 ? unviewedFacts : FACTS;

    // Pick a random fact
    const randomFact =
      factsToChooseFrom[Math.floor(Math.random() * factsToChooseFrom.length)];

    // Mark as viewed
    await prisma.viewedFact.upsert({
      where: { userId_factId: { userId, factId: randomFact.id } },
      update: { viewedAt: new Date() },
      create: { userId, factId: randomFact.id, viewedAt: new Date() },
    });

    return NextResponse.json({ fact: randomFact, viewedCount: viewedIds.size });
  } catch (err: any) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
