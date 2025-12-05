-- CreateTable
CREATE TABLE "ViewedFact" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "factId" INTEGER NOT NULL,
    "viewedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ViewedFact_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ViewedFact_userId_factId_key" ON "ViewedFact"("userId", "factId");

-- AddForeignKey
ALTER TABLE "ViewedFact" ADD CONSTRAINT "ViewedFact_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
