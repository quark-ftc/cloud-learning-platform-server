/*
  Warnings:

  - You are about to drop the column `deadling` on the `homework` table. All the data in the column will be lost.
  - Added the required column `deadline` to the `homework` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `homework` DROP COLUMN `deadling`,
    ADD COLUMN `deadline` DATETIME(3) NOT NULL;
