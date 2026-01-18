-- CreateTable
CREATE TABLE "Enrollment" (
    "id" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "offices" JSONB NOT NULL,
    "currentQueue" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Enrollment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Queue" (
    "id" TEXT NOT NULL,
    "officeId" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "queueNumber" INTEGER NOT NULL,
    "groupType" TEXT NOT NULL DEFAULT 'individual',
    "groupSize" INTEGER NOT NULL DEFAULT 1,
    "sectionName" TEXT,
    "status" TEXT NOT NULL DEFAULT 'waiting',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Queue_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "QueueCounter" (
    "id" TEXT NOT NULL,
    "officeId" TEXT NOT NULL,
    "counter" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "QueueCounter_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OfficeSetting" (
    "id" TEXT NOT NULL,
    "officeId" TEXT NOT NULL,
    "processingMode" TEXT NOT NULL DEFAULT 'individual',
    "avgProcessingTime" INTEGER NOT NULL DEFAULT 5,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "OfficeSetting_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Enrollment_studentId_key" ON "Enrollment"("studentId");

-- CreateIndex
CREATE INDEX "Enrollment_studentId_idx" ON "Enrollment"("studentId");

-- CreateIndex
CREATE INDEX "Queue_officeId_status_idx" ON "Queue"("officeId", "status");

-- CreateIndex
CREATE INDEX "Queue_studentId_idx" ON "Queue"("studentId");

-- CreateIndex
CREATE UNIQUE INDEX "QueueCounter_officeId_key" ON "QueueCounter"("officeId");

-- CreateIndex
CREATE INDEX "QueueCounter_officeId_idx" ON "QueueCounter"("officeId");

-- CreateIndex
CREATE UNIQUE INDEX "OfficeSetting_officeId_key" ON "OfficeSetting"("officeId");

-- CreateIndex
CREATE INDEX "OfficeSetting_officeId_idx" ON "OfficeSetting"("officeId");
