-- CreateTable
CREATE TABLE "PeerHelpRequest" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "context" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'open',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PeerHelpRequest_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "PeerHelpRequest_status_idx" ON "PeerHelpRequest"("status");

-- CreateIndex
CREATE INDEX "PeerHelpRequest_type_idx" ON "PeerHelpRequest"("type");

-- CreateIndex
CREATE INDEX "PeerHelpRequest_createdAt_idx" ON "PeerHelpRequest"("createdAt");

-- AddForeignKey
ALTER TABLE "PeerHelpRequest" ADD CONSTRAINT "PeerHelpRequest_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
