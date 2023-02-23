/*
  Warnings:

  - You are about to drop the `menu_privilege` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `menuonrole` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `roleonuser` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `menuonrole` DROP FOREIGN KEY `MenuOnRole_menu_id_fkey`;

-- DropForeignKey
ALTER TABLE `menuonrole` DROP FOREIGN KEY `MenuOnRole_role_id_fkey`;

-- DropForeignKey
ALTER TABLE `roleonuser` DROP FOREIGN KEY `RoleOnUser_roleId_fkey`;

-- DropForeignKey
ALTER TABLE `roleonuser` DROP FOREIGN KEY `RoleOnUser_userId_fkey`;

-- DropTable
DROP TABLE `menu_privilege`;

-- DropTable
DROP TABLE `menuonrole`;

-- DropTable
DROP TABLE `roleonuser`;

-- CreateTable
CREATE TABLE `menu` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `path` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NULL,
    `create_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `update_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `role_on_user` (
    `roleId` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `createAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updateAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`roleId`, `userId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `menu_on_role` (
    `menu_id` VARCHAR(191) NOT NULL,
    `role_id` VARCHAR(191) NOT NULL,
    `createAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updateAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`menu_id`, `role_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `role_on_user` ADD CONSTRAINT `role_on_user_roleId_fkey` FOREIGN KEY (`roleId`) REFERENCES `role`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `role_on_user` ADD CONSTRAINT `role_on_user_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `menu_on_role` ADD CONSTRAINT `menu_on_role_menu_id_fkey` FOREIGN KEY (`menu_id`) REFERENCES `menu`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `menu_on_role` ADD CONSTRAINT `menu_on_role_role_id_fkey` FOREIGN KEY (`role_id`) REFERENCES `role`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
