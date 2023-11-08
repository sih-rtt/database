/*
  Warnings:

  - The `routeIdB` column on the `CombinedRoute` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Changed the type of `routeIdA` on the `CombinedRoute` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- DropForeignKey
ALTER TABLE "CombinedRoute" DROP CONSTRAINT "CombinedRoute_routeIdA_fkey";

-- DropForeignKey
ALTER TABLE "CombinedRoute" DROP CONSTRAINT "CombinedRoute_routeIdB_fkey";

-- AlterTable
ALTER TABLE "CombinedRoute" DROP COLUMN "routeIdA",
ADD COLUMN     "routeIdA" BIGINT NOT NULL,
DROP COLUMN "routeIdB",
ADD COLUMN     "routeIdB" BIGINT;

-- AddForeignKey
ALTER TABLE "CombinedRoute" ADD CONSTRAINT "CombinedRoute_routeIdA_fkey" FOREIGN KEY ("routeIdA") REFERENCES "Route"("refId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CombinedRoute" ADD CONSTRAINT "CombinedRoute_routeIdB_fkey" FOREIGN KEY ("routeIdB") REFERENCES "Route"("refId") ON DELETE SET NULL ON UPDATE CASCADE;
