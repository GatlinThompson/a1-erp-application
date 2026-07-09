/*
  Warnings:

  - Added the required column `partId` to the `ProductPart` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "ProductHardware_productId_key";

-- AlterTable
ALTER TABLE "ProductPart" ADD COLUMN     "partId" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "ProductHardwareKit" (
    "id" SERIAL NOT NULL,
    "productId" INTEGER NOT NULL,
    "quantity" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "ProductHardwareKit_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ProductPart" ADD CONSTRAINT "ProductPart_partId_fkey" FOREIGN KEY ("partId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductHardwareKit" ADD CONSTRAINT "ProductHardwareKit_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
