/*
  Warnings:

  - You are about to alter the column `polyline` on the `Session` table. The data in that column could be lost. The data in that column will be cast from `Text` to `Unsupported("geometry(LINESTRING, 4326)")`.

*/
-- AlterTable
ALTER TABLE "Session" ALTER COLUMN "polyline" DROP NOT NULL,
ALTER COLUMN "polyline" SET DATA TYPE geometry(LINESTRING, 4326);
