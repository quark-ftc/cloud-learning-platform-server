/*
  Warnings:

  - You are about to drop the column `createAt` on the `menu_to_role` table. All the data in the column will be lost.
  - You are about to drop the column `updateAt` on the `menu_to_role` table. All the data in the column will be lost.
  - You are about to drop the column `createAt` on the `role_to_user` table. All the data in the column will be lost.
  - You are about to drop the column `updateAt` on the `role_to_user` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `role` DROP FOREIGN KEY `role_user_id_fkey`;

-- AlterTable
ALTER TABLE `menu_to_role` DROP COLUMN `createAt`,
    DROP COLUMN `updateAt`,
    ADD COLUMN `create_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `update_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3);

-- AlterTable
ALTER TABLE `role_to_user` DROP COLUMN `createAt`,
    DROP COLUMN `updateAt`,
    ADD COLUMN `create_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `update_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3);
