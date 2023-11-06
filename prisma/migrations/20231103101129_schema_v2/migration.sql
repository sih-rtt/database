/*
  Warnings:

  - You are about to drop the column `routes` on the `Route` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[refId]` on the table `BusStop` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[refId]` on the table `Route` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `refId` to the `BusStop` table without a default value. This is not possible if the table is not empty.
  - Added the required column `from` to the `Route` table without a default value. This is not possible if the table is not empty.
  - Added the required column `refId` to the `Route` table without a default value. This is not possible if the table is not empty.
  - Added the required column `to` to the `Route` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Bus" DROP CONSTRAINT "Bus_routeId_fkey";

-- AlterTable
ALTER TABLE "BusStop" ADD COLUMN     "refId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Route" DROP COLUMN "routes",
ADD COLUMN     "from" TEXT NOT NULL,
ADD COLUMN     "refId" INTEGER NOT NULL,
ADD COLUMN     "to" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "CombinedRoute" (
    "id" TEXT NOT NULL,
    "routeIdA" TEXT NOT NULL,
    "routeIdB" TEXT,

    CONSTRAINT "CombinedRoute_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BusStopsInRoute" (
    "busStopRefId" INTEGER NOT NULL,
    "routeRefId" INTEGER NOT NULL,

    CONSTRAINT "BusStopsInRoute_pkey" PRIMARY KEY ("busStopRefId","routeRefId")
);

-- CreateIndex
CREATE INDEX "CombinedRoute_id_idx" ON "CombinedRoute"("id");

-- CreateIndex
CREATE UNIQUE INDEX "BusStop_refId_key" ON "BusStop"("refId");

-- CreateIndex
CREATE INDEX "BusStop_id_idx" ON "BusStop"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Route_refId_key" ON "Route"("refId");

-- CreateIndex
CREATE INDEX "Route_id_idx" ON "Route"("id");

-- AddForeignKey
ALTER TABLE "Bus" ADD CONSTRAINT "Bus_routeId_fkey" FOREIGN KEY ("routeId") REFERENCES "CombinedRoute"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CombinedRoute" ADD CONSTRAINT "CombinedRoute_routeIdA_fkey" FOREIGN KEY ("routeIdA") REFERENCES "Route"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CombinedRoute" ADD CONSTRAINT "CombinedRoute_routeIdB_fkey" FOREIGN KEY ("routeIdB") REFERENCES "Route"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BusStopsInRoute" ADD CONSTRAINT "BusStopsInRoute_busStopRefId_fkey" FOREIGN KEY ("busStopRefId") REFERENCES "BusStop"("refId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BusStopsInRoute" ADD CONSTRAINT "BusStopsInRoute_routeRefId_fkey" FOREIGN KEY ("routeRefId") REFERENCES "Route"("refId") ON DELETE RESTRICT ON UPDATE CASCADE;
