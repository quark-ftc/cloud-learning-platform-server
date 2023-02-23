/*
  Warnings:

  - The primary key for the `menu_to_role` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `menu_name` on the `menu_to_role` table. All the data in the column will be lost.
  - You are about to drop the column `role_Value` on the `menu_to_role` table. All the data in the column will be lost.
  - Added the required column `menu_id` to the `menu_to_role` table without a default value. This is not possible if the table is not empty.
  - Added the required column `role_id` to the `menu_to_role` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `menu_to_role` DROP FOREIGN KEY `menu_to_role_menu_name_fkey`;

-- DropForeignKey
ALTER TABLE `menu_to_role` DROP FOREIGN KEY `menu_to_role_role_Value_fkey`;

-- AlterTable
ALTER TABLE `menu_to_role` DROP PRIMARY KEY,
    DROP COLUMN `menu_name`,
    DROP COLUMN `role_Value`,
    ADD COLUMN `menu_id` INTEGER NOT NULL,
    ADD COLUMN `role_id` INTEGER NOT NULL,
    ADD PRIMARY KEY (`menu_id`, `role_id`);

-- AddForeignKey
ALTER TABLE `menu_to_role` ADD CONSTRAINT `menu_to_role_menu_id_fkey` FOREIGN KEY (`menu_id`) REFERENCES `menu`(`menu_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `menu_to_role` ADD CONSTRAINT `menu_to_role_role_id_fkey` FOREIGN KEY (`role_id`) REFERENCES `role`(`role_id`) ON DELETE RESTRICT ON UPDATE CASCADE;
