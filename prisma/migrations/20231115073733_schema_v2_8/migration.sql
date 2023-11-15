/*
  Warnings:

  - You are about to alter the column `polyline` on the `Session` table. The data in that column could be lost. The data in that column will be cast from `Unsupported("geometry")` to `Text`.
  - Added the required column `routeId` to the `Session` table without a default value. This is not possible if the table is not empty.
  - Added the required column `startLocationName` to the `Session` table without a default value. This is not possible if the table is not empty.
  - Made the column `polyline` on table `Session` required. This step will fail if there are existing NULL values in that column.

*/
-- DropIndex
DROP INDEX "session_idx";

-- AlterTable
ALTER TABLE "Session" ADD COLUMN     "endLocationName" TEXT,
ADD COLUMN     "routeId" TEXT NOT NULL,
ADD COLUMN     "startLocationName" TEXT NOT NULL,
ALTER COLUMN "polyline" SET NOT NULL,
ALTER COLUMN "polyline" SET DATA TYPE TEXT;

-- CreateIndex
CREATE INDEX "session_idx" ON "Session"("startLocation", "endLocation");

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_routeId_fkey" FOREIGN KEY ("routeId") REFERENCES "Route"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
