-- CreateExtension
CREATE EXTENSION IF NOT EXISTS "postgis" WITH VERSION "3.4.0";

-- CreateTable
CREATE TABLE "Conductor" (
    "id" TEXT NOT NULL,
    "conductorId" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "gender" TEXT NOT NULL,
    "phoneNumber" VARCHAR(10) NOT NULL,
    "address" JSON,

    CONSTRAINT "Conductor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Session" (
    "id" SERIAL NOT NULL,
    "busId" TEXT NOT NULL,
    "conductorId" TEXT NOT NULL,
    "startTime" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "endTime" TIMESTAMP(3),
    "polyline" geometry(LINESTRING, 4326),
    "status" TEXT NOT NULL DEFAULT 'ongoing',
    "startLocation" geometry(POINT, 4326) NOT NULL,
    "endLocation" geometry(POINT, 4326),

    CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Bus" (
    "id" TEXT NOT NULL,
    "regNo" TEXT NOT NULL,
    "busNo" TEXT NOT NULL,
    "routeId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "info" JSON NOT NULL,

    CONSTRAINT "Bus_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BusStop" (
    "id" TEXT NOT NULL,
    "location" geometry(POINT, 4326) NOT NULL,
    "name" VARCHAR(30) NOT NULL,

    CONSTRAINT "BusStop_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Ticket" (
    "id" TEXT NOT NULL,
    "sessionId" INTEGER,
    "from" TEXT NOT NULL,
    "to" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "verifiedAt" TIMESTAMP(3),
    "userId" TEXT NOT NULL,

    CONSTRAINT "Ticket_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "fullName" VARCHAR(100) NOT NULL,
    "gender" TEXT,
    "phoneNumber" VARCHAR(10),
    "address" JSON,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Route" (
    "id" TEXT NOT NULL,
    "routes" JSON NOT NULL,

    CONSTRAINT "Route_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_BusToBusStop" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Conductor_conductorId_key" ON "Conductor"("conductorId");

-- CreateIndex
CREATE INDEX "session_idx" ON "Session"("polyline", "startLocation", "endLocation");

-- CreateIndex
CREATE UNIQUE INDEX "Bus_regNo_key" ON "Bus"("regNo");

-- CreateIndex
CREATE INDEX "location_idx" ON "BusStop"("location");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_phoneNumber_key" ON "User"("phoneNumber");

-- CreateIndex
CREATE INDEX "User_id_idx" ON "User"("id");

-- CreateIndex
CREATE UNIQUE INDEX "_BusToBusStop_AB_unique" ON "_BusToBusStop"("A", "B");

-- CreateIndex
CREATE INDEX "_BusToBusStop_B_index" ON "_BusToBusStop"("B");

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_busId_fkey" FOREIGN KEY ("busId") REFERENCES "Bus"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_conductorId_fkey" FOREIGN KEY ("conductorId") REFERENCES "Conductor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Bus" ADD CONSTRAINT "Bus_routeId_fkey" FOREIGN KEY ("routeId") REFERENCES "Route"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Ticket" ADD CONSTRAINT "Ticket_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "Session"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Ticket" ADD CONSTRAINT "Ticket_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_BusToBusStop" ADD CONSTRAINT "_BusToBusStop_A_fkey" FOREIGN KEY ("A") REFERENCES "Bus"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_BusToBusStop" ADD CONSTRAINT "_BusToBusStop_B_fkey" FOREIGN KEY ("B") REFERENCES "BusStop"("id") ON DELETE CASCADE ON UPDATE CASCADE;
