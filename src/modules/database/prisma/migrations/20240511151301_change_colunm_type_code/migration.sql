/*
  Warnings:

  - A unique constraint covering the columns `[code]` on the table `userCode` will be added. If there are existing duplicate values, this will fail.
  - Changed the type of `code` on the `userCode` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "userCode" DROP COLUMN "code",
ADD COLUMN     "code" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "userCode_code_key" ON "userCode"("code");
