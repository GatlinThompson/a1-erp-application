-- CreateTable
CREATE TABLE "ProductProcess" (
    "id" SERIAL NOT NULL,
    "productId" INTEGER NOT NULL,
    "processId" INTEGER NOT NULL,
    "sequence" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "ProductProcess_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Process" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,

    CONSTRAINT "Process_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ProductProcess_productId_processId_key" ON "ProductProcess"("productId", "processId");

-- AddForeignKey
ALTER TABLE "ProductProcess" ADD CONSTRAINT "ProductProcess_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductProcess" ADD CONSTRAINT "ProductProcess_processId_fkey" FOREIGN KEY ("processId") REFERENCES "Process"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
