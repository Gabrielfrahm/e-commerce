/*
  Warnings:

  - Added the required column `token` to the `userToken` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "userToken" ADD COLUMN     "token" TEXT NOT NULL;
