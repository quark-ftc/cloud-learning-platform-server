/*
  Warnings:

  - The primary key for the `role` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - Added the required column `role_description` to the `role` table without a default value. This is not possible if the table is not empty.
  - Added the required column `update_at` to the `role` table without a default value. This is not possible if the table is not empty.
  - Added the required column `update_at` to the `user` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `role` DROP PRIMARY KEY,
    ADD COLUMN `create_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `role_description` VARCHAR(191) NOT NULL,
    ADD COLUMN `update_at` DATETIME(3) NOT NULL,
    MODIFY `role_id` VARCHAR(191) NOT NULL,
    ADD PRIMARY KEY (`role_id`);

-- AlterTable
ALTER TABLE `user` ADD COLUMN `create_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `update_at` DATETIME(3) NOT NULL,
    MODIFY `role` VARCHAR(191) NULL DEFAULT 'unregistered';

-- CreateTable
CREATE TABLE `menu_privilege` (
    `menuId` VARCHAR(191) NOT NULL,
    `menu_name` VARCHAR(191) NOT NULL,
    `menu_path` VARCHAR(191) NOT NULL,
    `menu_description` VARCHAR(191) NOT NULL,
    `create_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `update_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`menuId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_MenuPrivilegeToRole` (
    `A` VARCHAR(191) NOT NULL,
    `B` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `_MenuPrivilegeToRole_AB_unique`(`A`, `B`),
    INDEX `_MenuPrivilegeToRole_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `user` ADD CONSTRAINT `user_role_fkey` FOREIGN KEY (`role`) REFERENCES `role`(`role_id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_MenuPrivilegeToRole` ADD CONSTRAINT `_MenuPrivilegeToRole_A_fkey` FOREIGN KEY (`A`) REFERENCES `menu_privilege`(`menuId`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_MenuPrivilegeToRole` ADD CONSTRAINT `_MenuPrivilegeToRole_B_fkey` FOREIGN KEY (`B`) REFERENCES `role`(`role_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- RenameIndex
ALTER TABLE `user` RENAME INDEX `User_username_key` TO `user_username_key`;
