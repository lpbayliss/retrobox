-- CreateTable
CREATE TABLE "BoxViews" (
    "viewedAt" TIMESTAMP(3) NOT NULL,
    "userId" TEXT NOT NULL,
    "boxId" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "BoxViews_userId_boxId_key" ON "BoxViews"("userId", "boxId");

-- AddForeignKey
ALTER TABLE "BoxViews" ADD CONSTRAINT "BoxViews_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BoxViews" ADD CONSTRAINT "BoxViews_boxId_fkey" FOREIGN KEY ("boxId") REFERENCES "Box"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
