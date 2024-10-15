/*
  Warnings:

  - A unique constraint covering the columns `[cnpj]` on the table `tb_org` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "tb_org_cnpj_key" ON "tb_org"("cnpj");
