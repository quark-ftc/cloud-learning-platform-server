/*
  Warnings:

  - You are about to drop the column `role_description` on the `role` table. All the data in the column will be lost.
  - You are about to drop the column `role_name` on the `role` table. All the data in the column will be lost.
  - Added the required column `name` to the `role` table without a default value. This is not possible if the table is not empty.
  - Added the required column `value` to the `role` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `role` DROP COLUMN `role_description`,
    DROP COLUMN `role_name`,
    ADD COLUMN `description` VARCHAR(191) NULL,
    ADD COLUMN `name` VARCHAR(191) NOT NULL,
    ADD COLUMN `value` VARCHAR(191) NOT NULL;
