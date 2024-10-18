/*
  Warnings:

  - You are about to drop the `tb_adoption_requirements` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `adoption_requirements` to the `tb_pet` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "tb_adoption_requirements" DROP CONSTRAINT "tb_adoption_requirements_pet_id_fkey";

-- AlterTable
ALTER TABLE "tb_pet" ADD COLUMN     "adoption_requirements" TEXT NOT NULL;

-- DropTable
DROP TABLE "tb_adoption_requirements";
