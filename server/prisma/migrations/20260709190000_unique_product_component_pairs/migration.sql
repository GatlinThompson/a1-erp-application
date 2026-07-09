-- CreateIndex
CREATE UNIQUE INDEX "ProductHardware_productId_hardwareId_key" ON "ProductHardware"("productId", "hardwareId");

-- CreateIndex
CREATE UNIQUE INDEX "ProductPart_productId_partId_key" ON "ProductPart"("productId", "partId");

-- CreateIndex
CREATE UNIQUE INDEX "ProductHardwareKit_productId_kitId_key" ON "ProductHardwareKit"("productId", "kitId");
