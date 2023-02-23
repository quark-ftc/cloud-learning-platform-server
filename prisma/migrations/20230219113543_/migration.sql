/*
  Warnings:

  - You are about to drop the `menu_on_role` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `role_on_user` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `menu_on_role` DROP FOREIGN KEY `menu_on_role_menu_id_fkey`;

-- DropForeignKey
ALTER TABLE `menu_on_role` DROP FOREIGN KEY `menu_on_role_role_id_fkey`;

-- DropForeignKey
ALTER TABLE `role_on_user` DROP FOREIGN KEY `role_on_user_roleId_fkey`;

-- DropForeignKey
ALTER TABLE `role_on_user` DROP FOREIGN KEY `role_on_user_userId_fkey`;

-- DropTable
DROP TABLE `menu_on_role`;

-- DropTable
DROP TABLE `role_on_user`;

-- CreateTable
CREATE TABLE `role_To_user` (
    `roleId` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `createAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updateAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`roleId`, `userId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `menu_To_role` (
    `menu_id` VARCHAR(191) NOT NULL,
    `role_id` VARCHAR(191) NOT NULL,
    `createAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updateAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`menu_id`, `role_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `role_To_user` ADD CONSTRAINT `role_To_user_roleId_fkey` FOREIGN KEY (`roleId`) REFERENCES `role`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `role_To_user` ADD CONSTRAINT `role_To_user_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `menu_To_role` ADD CONSTRAINT `menu_To_role_menu_id_fkey` FOREIGN KEY (`menu_id`) REFERENCES `menu`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `menu_To_role` ADD CONSTRAINT `menu_To_role_role_id_fkey` FOREIGN KEY (`role_id`) REFERENCES `role`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
