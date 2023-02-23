/*
  Warnings:

  - You are about to drop the column `icon` on the `menu` table. All the data in the column will be lost.
  - You are about to drop the column `menuIcon` on the `menu` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `menu` DROP COLUMN `icon`,
    DROP COLUMN `menuIcon`,
    ADD COLUMN `menu_icon` VARCHAR(191) NULL;
