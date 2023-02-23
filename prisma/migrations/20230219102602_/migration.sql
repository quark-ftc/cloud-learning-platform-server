/*
  Warnings:

  - The primary key for the `menu_privilege` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `menuId` on the `menu_privilege` table. All the data in the column will be lost.
  - The required column `menu_id` was added to the `menu_privilege` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.

*/
-- DropForeignKey
ALTER TABLE `_menuprivilegetorole` DROP FOREIGN KEY `_MenuPrivilegeToRole_A_fkey`;

-- AlterTable
ALTER TABLE `menu_privilege` DROP PRIMARY KEY,
    DROP COLUMN `menuId`,
    ADD COLUMN `menu_id` VARCHAR(191) NOT NULL,
    ADD PRIMARY KEY (`menu_id`);

-- AddForeignKey
ALTER TABLE `_MenuPrivilegeToRole` ADD CONSTRAINT `_MenuPrivilegeToRole_A_fkey` FOREIGN KEY (`A`) REFERENCES `menu_privilege`(`menu_id`) ON DELETE CASCADE ON UPDATE CASCADE;
