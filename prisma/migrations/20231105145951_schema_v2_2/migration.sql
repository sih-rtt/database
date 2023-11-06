/*
  Warnings:

  - The primary key for the `BusStopsInRoute` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- DropForeignKey
ALTER TABLE "BusStopsInRoute" DROP CONSTRAINT "BusStopsInRoute_busStopRefId_fkey";

-- DropForeignKey
ALTER TABLE "BusStopsInRoute" DROP CONSTRAINT "BusStopsInRoute_routeRefId_fkey";

-- AlterTable
ALTER TABLE "BusStop" ALTER COLUMN "refId" SET DATA TYPE BIGINT;

-- AlterTable
ALTER TABLE "BusStopsInRoute" DROP CONSTRAINT "BusStopsInRoute_pkey",
ALTER COLUMN "busStopRefId" SET DATA TYPE BIGINT,
ALTER COLUMN "routeRefId" SET DATA TYPE BIGINT,
ADD CONSTRAINT "BusStopsInRoute_pkey" PRIMARY KEY ("busStopRefId", "routeRefId");

-- AlterTable
ALTER TABLE "Route" ALTER COLUMN "refId" SET DATA TYPE BIGINT;

-- AddForeignKey
ALTER TABLE "BusStopsInRoute" ADD CONSTRAINT "BusStopsInRoute_busStopRefId_fkey" FOREIGN KEY ("busStopRefId") REFERENCES "BusStop"("refId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BusStopsInRoute" ADD CONSTRAINT "BusStopsInRoute_routeRefId_fkey" FOREIGN KEY ("routeRefId") REFERENCES "Route"("refId") ON DELETE RESTRICT ON UPDATE CASCADE;
