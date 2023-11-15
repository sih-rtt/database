/*
  Warnings:

  - A unique constraint covering the columns `[busRef]` on the table `CombinedRoute` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "CombinedRoute_busRef_key" ON "CombinedRoute"("busRef");
