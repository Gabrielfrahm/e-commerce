-- CreateTable
CREATE TABLE "carts" (
    "productVariantId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "carts_pkey" PRIMARY KEY ("productVariantId","userId")
);

-- AddForeignKey
ALTER TABLE "carts" ADD CONSTRAINT "carts_productVariantId_fkey" FOREIGN KEY ("productVariantId") REFERENCES "productVariants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "carts" ADD CONSTRAINT "carts_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
