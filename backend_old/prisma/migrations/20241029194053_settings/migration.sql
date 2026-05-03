/*
  Warnings:

  - You are about to drop the column `inputSettings` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "inputSettings",
ADD COLUMN     "settings" TEXT;
