/*
  Warnings:

  - You are about to drop the column `location` on the `ProductHardware` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "location" TEXT DEFAULT 'A1';

-- AlterTable
ALTER TABLE "ProductHardware" DROP COLUMN "location";
