/*
  Warnings:

  - You are about to drop the column `promocinalPrice` on the `productVariants` table. All the data in the column will be lost.
  - Added the required column `promocionalPrice` to the `productVariants` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "productVariants" DROP COLUMN "promocinalPrice",
ADD COLUMN     "promocionalPrice" INTEGER NOT NULL;
