/*
  Warnings:

  - The primary key for the `menu_to_role` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `role_name` on the `menu_to_role` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `role` table. All the data in the column will be lost.
  - The primary key for the `role_to_user` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `role_value` on the `role_to_user` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[label]` on the table `role` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `role_label` to the `menu_to_role` table without a default value. This is not possible if the table is not empty.
  - Added the required column `label` to the `role` table without a default value. This is not possible if the table is not empty.
  - Added the required column `role_label` to the `role_to_user` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `menu_to_role` DROP FOREIGN KEY `menu_to_role_role_name_fkey`;

-- DropForeignKey
ALTER TABLE `role_to_user` DROP FOREIGN KEY `role_to_user_role_value_fkey`;

-- DropIndex
DROP INDEX `role_name_key` ON `role`;

-- AlterTable
ALTER TABLE `menu_to_role` DROP PRIMARY KEY,
    DROP COLUMN `role_name`,
    ADD COLUMN `role_label` VARCHAR(191) NOT NULL,
    ADD PRIMARY KEY (`menu_name`, `role_label`);

-- AlterTable
ALTER TABLE `role` DROP COLUMN `name`,
    ADD COLUMN `label` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `role_to_user` DROP PRIMARY KEY,
    DROP COLUMN `role_value`,
    ADD COLUMN `role_label` VARCHAR(191) NOT NULL,
    ADD PRIMARY KEY (`role_label`, `user_name`);

-- CreateIndex
CREATE UNIQUE INDEX `role_label_key` ON `role`(`label`);

-- AddForeignKey
ALTER TABLE `role_to_user` ADD CONSTRAINT `role_to_user_role_label_fkey` FOREIGN KEY (`role_label`) REFERENCES `role`(`label`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `menu_to_role` ADD CONSTRAINT `menu_to_role_role_label_fkey` FOREIGN KEY (`role_label`) REFERENCES `role`(`label`) ON DELETE RESTRICT ON UPDATE CASCADE;
