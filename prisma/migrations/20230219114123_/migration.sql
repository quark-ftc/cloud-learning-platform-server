-- DropForeignKey
ALTER TABLE `menu_to_role` DROP FOREIGN KEY `menu_To_role_menu_id_fkey`;

-- DropForeignKey
ALTER TABLE `menu_to_role` DROP FOREIGN KEY `menu_To_role_role_id_fkey`;

-- DropForeignKey
ALTER TABLE `role_to_user` DROP FOREIGN KEY `role_To_user_roleId_fkey`;

-- DropForeignKey
ALTER TABLE `role_to_user` DROP FOREIGN KEY `role_To_user_userId_fkey`;

-- AddForeignKey
ALTER TABLE `role_to_user` ADD CONSTRAINT `role_to_user_roleId_fkey` FOREIGN KEY (`roleId`) REFERENCES `role`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `role_to_user` ADD CONSTRAINT `role_to_user_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `menu_to_role` ADD CONSTRAINT `menu_to_role_menu_id_fkey` FOREIGN KEY (`menu_id`) REFERENCES `menu`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `menu_to_role` ADD CONSTRAINT `menu_to_role_role_id_fkey` FOREIGN KEY (`role_id`) REFERENCES `role`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
