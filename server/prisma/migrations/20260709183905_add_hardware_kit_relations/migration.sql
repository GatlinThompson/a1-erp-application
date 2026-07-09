/*
  Warnings:

  - Added the required column `hardwareId` to the `ProductHardware` table without a default value. This is not possible if the table is not empty.
  - Added the required column `kitId` to the `ProductHardwareKit` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ProductHardware" ADD COLUMN     "hardwareId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "ProductHardwareKit" ADD COLUMN     "kitId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "ProductHardware" ADD CONSTRAINT "ProductHardware_hardwareId_fkey" FOREIGN KEY ("hardwareId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductHardwareKit" ADD CONSTRAINT "ProductHardwareKit_kitId_fkey" FOREIGN KEY ("kitId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
