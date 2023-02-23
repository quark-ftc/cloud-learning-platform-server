/*
  Warnings:

  - The primary key for the `menu_to_role` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `role_to_user` table will be changed. If it partially fails, the table could be left without primary key constraint.

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
    MODIFY `menu_id` VARCHAR(191) NOT NULL,
    MODIFY `role_id` VARCHAR(191) NOT NULL,
    ADD PRIMARY KEY (`menu_id`, `role_id`);

-- AlterTable
ALTER TABLE `role_to_user` DROP PRIMARY KEY,
    MODIFY `role_id` VARCHAR(191) NOT NULL,
    MODIFY `user_id` VARCHAR(191) NOT NULL,
    ADD PRIMARY KEY (`user_id`, `role_id`);

-- AddForeignKey
ALTER TABLE `role_to_user` ADD CONSTRAINT `role_to_user_role_id_fkey` FOREIGN KEY (`role_id`) REFERENCES `role`(`role_name`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `role_to_user` ADD CONSTRAINT `role_to_user_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `user`(`username`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `menu_to_role` ADD CONSTRAINT `menu_to_role_menu_id_fkey` FOREIGN KEY (`menu_id`) REFERENCES `menu`(`title`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `menu_to_role` ADD CONSTRAINT `menu_to_role_role_id_fkey` FOREIGN KEY (`role_id`) REFERENCES `role`(`role_name`) ON DELETE RESTRICT ON UPDATE CASCADE;
