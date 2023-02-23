/*
  Warnings:

  - The primary key for the `menu` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `menu` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `menu` table. All the data in the column will be lost.
  - The primary key for the `menu_to_role` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `role_label` on the `menu_to_role` table. All the data in the column will be lost.
  - The primary key for the `role` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `role` table. All the data in the column will be lost.
  - You are about to drop the column `label` on the `role` table. All the data in the column will be lost.
  - You are about to drop the column `value` on the `role` table. All the data in the column will be lost.
  - The primary key for the `role_to_user` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `role_label` on the `role_to_user` table. All the data in the column will be lost.
  - The primary key for the `user` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `user` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[menu_name]` on the table `menu` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[role_name]` on the table `role` will be added. If there are existing duplicate values, this will fail.
  - The required column `menu_id` was added to the `menu` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - Added the required column `menu_name` to the `menu` table without a default value. This is not possible if the table is not empty.
  - Added the required column `role_Value` to the `menu_to_role` table without a default value. This is not possible if the table is not empty.
  - The required column `role_id` was added to the `role` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - Added the required column `role_name` to the `role` table without a default value. This is not possible if the table is not empty.
  - Added the required column `role_name` to the `role_to_user` table without a default value. This is not possible if the table is not empty.
  - The required column `user_id` was added to the `user` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.

*/
-- DropForeignKey
ALTER TABLE `menu_to_role` DROP FOREIGN KEY `menu_to_role_menu_name_fkey`;

-- DropForeignKey
ALTER TABLE `menu_to_role` DROP FOREIGN KEY `menu_to_role_role_label_fkey`;

-- DropForeignKey
ALTER TABLE `role_to_user` DROP FOREIGN KEY `role_to_user_role_label_fkey`;

-- DropIndex
DROP INDEX `menu_name_key` ON `menu`;

-- DropIndex
DROP INDEX `role_label_key` ON `role`;

-- DropIndex
DROP INDEX `role_value_key` ON `role`;

-- AlterTable
ALTER TABLE `menu` DROP PRIMARY KEY,
    DROP COLUMN `id`,
    DROP COLUMN `name`,
    ADD COLUMN `menu_id` VARCHAR(191) NOT NULL,
    ADD COLUMN `menu_name` VARCHAR(191) NOT NULL,
    ADD PRIMARY KEY (`menu_id`);

-- AlterTable
ALTER TABLE `menu_to_role` DROP PRIMARY KEY,
    DROP COLUMN `role_label`,
    ADD COLUMN `role_Value` VARCHAR(191) NOT NULL,
    ADD PRIMARY KEY (`menu_name`, `role_Value`);

-- AlterTable
ALTER TABLE `role` DROP PRIMARY KEY,
    DROP COLUMN `id`,
    DROP COLUMN `label`,
    DROP COLUMN `value`,
    ADD COLUMN `role_id` VARCHAR(191) NOT NULL,
    ADD COLUMN `role_name` VARCHAR(191) NOT NULL,
    ADD PRIMARY KEY (`role_id`);

-- AlterTable
ALTER TABLE `role_to_user` DROP PRIMARY KEY,
    DROP COLUMN `role_label`,
    ADD COLUMN `role_name` VARCHAR(191) NOT NULL,
    ADD PRIMARY KEY (`role_name`, `user_name`);

-- AlterTable
ALTER TABLE `user` DROP PRIMARY KEY,
    DROP COLUMN `id`,
    ADD COLUMN `user_id` VARCHAR(191) NOT NULL,
    ADD PRIMARY KEY (`user_id`);

-- CreateIndex
CREATE UNIQUE INDEX `menu_menu_name_key` ON `menu`(`menu_name`);

-- CreateIndex
CREATE UNIQUE INDEX `role_role_name_key` ON `role`(`role_name`);

-- AddForeignKey
ALTER TABLE `role_to_user` ADD CONSTRAINT `role_to_user_role_name_fkey` FOREIGN KEY (`role_name`) REFERENCES `role`(`role_name`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `menu_to_role` ADD CONSTRAINT `menu_to_role_menu_name_fkey` FOREIGN KEY (`menu_name`) REFERENCES `menu`(`menu_name`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `menu_to_role` ADD CONSTRAINT `menu_to_role_role_Value_fkey` FOREIGN KEY (`role_Value`) REFERENCES `role`(`role_name`) ON DELETE RESTRICT ON UPDATE CASCADE;
