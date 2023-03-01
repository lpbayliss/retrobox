-- CreateTable
CREATE TABLE "ProjectViews" (
    "viewedAt" TIMESTAMP(3) NOT NULL,
    "userId" TEXT NOT NULL,
    "projectId" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "ProjectViews_userId_projectId_key" ON "ProjectViews"("userId", "projectId");

-- AddForeignKey
ALTER TABLE "ProjectViews" ADD CONSTRAINT "ProjectViews_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProjectViews" ADD CONSTRAINT "ProjectViews_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
