/*
  Warnings:

  - You are about to drop the column `classDescription` on the `class` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `class` DROP COLUMN `classDescription`,
    ADD COLUMN `class_description` VARCHAR(191) NULL;
