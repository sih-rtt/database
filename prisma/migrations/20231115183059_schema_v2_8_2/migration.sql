-- AlterTable
ALTER TABLE "Route" ADD COLUMN     "fromLocation" geometry(POINT, 4326),
ADD COLUMN     "toLocation" geometry(POINT, 4326);
