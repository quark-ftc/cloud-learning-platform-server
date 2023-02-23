/*
  Warnings:

  - The primary key for the `menu_privilege` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `menu_description` on the `menu_privilege` table. All the data in the column will be lost.
  - You are about to drop the column `menu_id` on the `menu_privilege` table. All the data in the column will be lost.
  - You are about to drop the column `menu_name` on the `menu_privilege` table. All the data in the column will be lost.
  - You are about to drop the column `menu_path` on the `menu_privilege` table. All the data in the column will be lost.
  - The primary key for the `role` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `role_id` on the `role` table. All the data in the column will be lost.
  - The primary key for the `user` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `user_id` on the `user` table. All the data in the column will be lost.
  - You are about to drop the `_menuprivilegetorole` table. If the table is not empty, all the data it contains will be lost.
  - The required column `id` was added to the `menu_privilege` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - Added the required column `name` to the `menu_privilege` table without a default value. This is not possible if the table is not empty.
  - Added the required column `path` to the `menu_privilege` table without a default value. This is not possible if the table is not empty.
  - The required column `id` was added to the `role` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - The required column `id` was added to the `user` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.

*/
-- DropForeignKey
ALTER TABLE `_menuprivilegetorole` DROP FOREIGN KEY `_MenuPrivilegeToRole_A_fkey`;

-- DropForeignKey
ALTER TABLE `_menuprivilegetorole` DROP FOREIGN KEY `_MenuPrivilegeToRole_B_fkey`;

-- DropForeignKey
ALTER TABLE `_roletouser` DROP FOREIGN KEY `_RoleToUser_A_fkey`;

-- DropForeignKey
ALTER TABLE `_roletouser` DROP FOREIGN KEY `_RoleToUser_B_fkey`;

-- AlterTable
ALTER TABLE `menu_privilege` DROP PRIMARY KEY,
    DROP COLUMN `menu_description`,
    DROP COLUMN `menu_id`,
    DROP COLUMN `menu_name`,
    DROP COLUMN `menu_path`,
    ADD COLUMN `description` VARCHAR(191) NULL,
    ADD COLUMN `id` VARCHAR(191) NOT NULL,
    ADD COLUMN `name` VARCHAR(191) NOT NULL,
    ADD COLUMN `path` VARCHAR(191) NOT NULL,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `role` DROP PRIMARY KEY,
    DROP COLUMN `role_id`,
    ADD COLUMN `id` VARCHAR(191) NOT NULL,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `user` DROP PRIMARY KEY,
    DROP COLUMN `user_id`,
    ADD COLUMN `id` VARCHAR(191) NOT NULL,
    ADD PRIMARY KEY (`id`);

-- DropTable
DROP TABLE `_menuprivilegetorole`;

-- CreateTable
CREATE TABLE `RoleOnUser` (
    `roleId` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `createAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updateAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`roleId`, `userId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `MenuOnRole` (
    `menu_id` VARCHAR(191) NOT NULL,
    `role_id` VARCHAR(191) NOT NULL,
    `createAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updateAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`menu_id`, `role_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `RoleOnUser` ADD CONSTRAINT `RoleOnUser_roleId_fkey` FOREIGN KEY (`roleId`) REFERENCES `role`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `RoleOnUser` ADD CONSTRAINT `RoleOnUser_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `MenuOnRole` ADD CONSTRAINT `MenuOnRole_menu_id_fkey` FOREIGN KEY (`menu_id`) REFERENCES `menu_privilege`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `MenuOnRole` ADD CONSTRAINT `MenuOnRole_role_id_fkey` FOREIGN KEY (`role_id`) REFERENCES `role`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_RoleToUser` ADD CONSTRAINT `_RoleToUser_A_fkey` FOREIGN KEY (`A`) REFERENCES `role`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_RoleToUser` ADD CONSTRAINT `_RoleToUser_B_fkey` FOREIGN KEY (`B`) REFERENCES `user`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
