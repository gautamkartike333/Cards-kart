/*
  Warnings:

  - You are about to drop the `Player` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "GameSession" DROP CONSTRAINT "GameSession_winnerId_fkey";

-- DropForeignKey
ALTER TABLE "_PlayersPlayed" DROP CONSTRAINT "_PlayersPlayed_B_fkey";

-- DropTable
DROP TABLE "Player";

-- CreateTable
CREATE TABLE "User" (
    "User_id" SERIAL NOT NULL,
    "username" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("User_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- AddForeignKey
ALTER TABLE "GameSession" ADD CONSTRAINT "GameSession_winnerId_fkey" FOREIGN KEY ("winnerId") REFERENCES "User"("User_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PlayersPlayed" ADD CONSTRAINT "_PlayersPlayed_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("User_id") ON DELETE CASCADE ON UPDATE CASCADE;
