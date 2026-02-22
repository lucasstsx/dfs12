/*
  Warnings:

  - Changed the type of `categoria` on the `conhecimentos` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "categorias" AS ENUM ('musica', 'tecnologia', 'educacao', 'artes', 'idiomas', 'outros');

-- AlterTable
ALTER TABLE "conhecimentos" DROP COLUMN "categoria",
ADD COLUMN     "categoria" "categorias" NOT NULL;
