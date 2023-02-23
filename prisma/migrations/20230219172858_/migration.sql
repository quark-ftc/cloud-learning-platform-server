/*
  Warnings:

  - The primary key for the `menu_to_role` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `menu_id` on the `menu_to_role` table. All the data in the column will be lost.
  - You are about to drop the column `role_id` on the `menu_to_role` table. All the data in the column will be lost.
  - The primary key for the `role_to_user` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `role_id` on the `role_to_user` table. All the data in the column will be lost.
  - You are about to drop the column `user_id` on the `role_to_user` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[name]` on the table `menu` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[path]` on the table `menu` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `menu_name` to the `menu_to_role` table without a default value. This is not possible if the table is not empty.
  - Added the required column `role_name` to the `menu_to_role` table without a default value. This is not possible if the table is not empty.
  - Added the required column `role_name` to the `role_to_user` table without a default value. This is not possible if the table is not empty.
  - Added the required column `user_name` to the `role_to_user` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `menu_to_role` DROP FOREIGN KEY `menu_to_role_menu_id_fkey`;

-- DropForeignKey
ALTER TABLE `menu_to_role` DROP FOREIGN KEY `menu_to_role_role_id_fkey`;

-- DropForeignKey
ALTER TABLE `role_to_user` DROP FOREIGN KEY `role_to_user_role_id_fkey`;

-- DropForeignKey
ALTER TABLE `role_to_user` DROP FOREIGN KEY `role_to_user_user_id_fkey`;

-- AlterTable
ALTER TABLE `menu` MODIFY `update_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3);

-- AlterTable
ALTER TABLE `menu_to_role` DROP PRIMARY KEY,
    DROP COLUMN `menu_id`,
    DROP COLUMN `role_id`,
    ADD COLUMN `menu_name` VARCHAR(191) NOT NULL,
    ADD COLUMN `role_name` VARCHAR(191) NOT NULL,
    ADD PRIMARY KEY (`menu_name`, `role_name`);

-- AlterTable
ALTER TABLE `role_to_user` DROP PRIMARY KEY,
    DROP COLUMN `role_id`,
    DROP COLUMN `user_id`,
    ADD COLUMN `role_name` VARCHAR(191) NOT NULL,
    ADD COLUMN `user_name` VARCHAR(191) NOT NULL,
    ADD PRIMARY KEY (`role_name`, `user_name`);

-- AlterTable
ALTER TABLE `user` MODIFY `update_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3);

-- CreateIndex
CREATE UNIQUE INDEX `menu_name_key` ON `menu`(`name`);

-- CreateIndex
CREATE UNIQUE INDEX `menu_path_key` ON `menu`(`path`);

-- AddForeignKey
ALTER TABLE `role_to_user` ADD CONSTRAINT `role_to_user_role_name_fkey` FOREIGN KEY (`role_name`) REFERENCES `role`(`name`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `role_to_user` ADD CONSTRAINT `role_to_user_user_name_fkey` FOREIGN KEY (`user_name`) REFERENCES `user`(`username`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `menu_to_role` ADD CONSTRAINT `menu_to_role_menu_name_fkey` FOREIGN KEY (`menu_name`) REFERENCES `menu`(`name`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `menu_to_role` ADD CONSTRAINT `menu_to_role_role_name_fkey` FOREIGN KEY (`role_name`) REFERENCES `role`(`name`) ON DELETE RESTRICT ON UPDATE CASCADE;
