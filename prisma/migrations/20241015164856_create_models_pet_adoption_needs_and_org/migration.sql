-- CreateEnum
CREATE TYPE "Size" AS ENUM ('SMALL', 'MEDIUM', 'LARGE');

-- CreateEnum
CREATE TYPE "EnergyLevel" AS ENUM ('LOW', 'MEDIUM', 'HIGH');

-- CreateTable
CREATE TABLE "tb_pet" (
    "id" TEXT NOT NULL,
    "org_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "about" TEXT NOT NULL,
    "age" INTEGER NOT NULL,
    "size" "Size" NOT NULL,
    "energy_level" "EnergyLevel" NOT NULL,
    "breed" TEXT NOT NULL,

    CONSTRAINT "tb_pet_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tb_adoption_needs" (
    "id" TEXT NOT NULL,
    "pet_id" TEXT NOT NULL,
    "needs" TEXT NOT NULL,

    CONSTRAINT "tb_adoption_needs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tb_org" (
    "id" TEXT NOT NULL,
    "cnpj" TEXT NOT NULL,
    "responsable_name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "whatsapp" TEXT NOT NULL,
    "cep" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "street" TEXT NOT NULL,
    "neighborhood" TEXT NOT NULL,
    "number" TEXT NOT NULL,

    CONSTRAINT "tb_org_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "tb_pet" ADD CONSTRAINT "tb_pet_org_id_fkey" FOREIGN KEY ("org_id") REFERENCES "tb_org"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tb_adoption_needs" ADD CONSTRAINT "tb_adoption_needs_pet_id_fkey" FOREIGN KEY ("pet_id") REFERENCES "tb_pet"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
