/*
  Warnings:

  - The primary key for the `menu_to_role` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `menu_id` on the `menu_to_role` table. All the data in the column will be lost.
  - You are about to drop the column `role_id` on the `menu_to_role` table. All the data in the column will be lost.
  - The primary key for the `role_to_user` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `role_id` on the `role_to_user` table. All the data in the column will be lost.
  - You are about to drop the column `user_id` on the `role_to_user` table. All the data in the column will be lost.
  - Added the required column `role_name` to the `menu_to_role` table without a default value. This is not possible if the table is not empty.
  - Added the required column `title` to the `menu_to_role` table without a default value. This is not possible if the table is not empty.
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
ALTER TABLE `menu_to_role` DROP PRIMARY KEY,
    DROP COLUMN `menu_id`,
    DROP COLUMN `role_id`,
    ADD COLUMN `role_name` VARCHAR(191) NOT NULL,
    ADD COLUMN `title` VARCHAR(191) NOT NULL,
    ADD PRIMARY KEY (`title`, `role_name`);

-- AlterTable
ALTER TABLE `role_to_user` DROP PRIMARY KEY,
    DROP COLUMN `role_id`,
    DROP COLUMN `user_id`,
    ADD COLUMN `role_name` VARCHAR(191) NOT NULL,
    ADD COLUMN `user_name` VARCHAR(191) NOT NULL,
    ADD PRIMARY KEY (`user_name`, `role_name`);

-- AddForeignKey
ALTER TABLE `role_to_user` ADD CONSTRAINT `role_to_user_role_name_fkey` FOREIGN KEY (`role_name`) REFERENCES `role`(`role_name`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `role_to_user` ADD CONSTRAINT `role_to_user_user_name_fkey` FOREIGN KEY (`user_name`) REFERENCES `user`(`username`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `menu_to_role` ADD CONSTRAINT `menu_to_role_title_fkey` FOREIGN KEY (`title`) REFERENCES `menu`(`title`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `menu_to_role` ADD CONSTRAINT `menu_to_role_role_name_fkey` FOREIGN KEY (`role_name`) REFERENCES `role`(`role_name`) ON DELETE RESTRICT ON UPDATE CASCADE;
