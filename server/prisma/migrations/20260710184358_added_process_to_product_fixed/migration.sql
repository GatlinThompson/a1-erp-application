/*
  Warnings:

  - You are about to drop the column `description` on the `Process` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `Process` table. All the data in the column will be lost.
  - You are about to drop the column `sequence` on the `ProductProcess` table. All the data in the column will be lost.
  - Added the required column `process_name` to the `Process` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Process" DROP COLUMN "description",
DROP COLUMN "name",
ADD COLUMN     "process_name" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "ProductProcess" DROP COLUMN "sequence",
ADD COLUMN     "process_sequence" INTEGER NOT NULL DEFAULT 1;
