/*
  Warnings:

  - Added the required column `busRef` to the `CombinedRoute` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "CombinedRoute" ADD COLUMN     "busRef" TEXT NOT NULL;
