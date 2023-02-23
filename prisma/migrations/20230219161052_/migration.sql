/*
  Warnings:

  - The primary key for the `role_to_user` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `roleId` on the `role_to_user` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `role_to_user` table. All the data in the column will be lost.
  - Added the required column `role_id` to the `role_to_user` table without a default value. This is not possible if the table is not empty.
  - Added the required column `user_id` to the `role_to_user` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `role_to_user` DROP FOREIGN KEY `role_to_user_roleId_fkey`;

-- DropForeignKey
ALTER TABLE `role_to_user` DROP FOREIGN KEY `role_to_user_userId_fkey`;

-- DropIndex
DROP INDEX `role_user_id_fkey` ON `role`;

-- AlterTable
ALTER TABLE `role_to_user` DROP PRIMARY KEY,
    DROP COLUMN `roleId`,
    DROP COLUMN `userId`,
    ADD COLUMN `role_id` VARCHAR(191) NOT NULL,
    ADD COLUMN `user_id` VARCHAR(191) NOT NULL,
    ADD PRIMARY KEY (`role_id`, `user_id`);

-- AddForeignKey
ALTER TABLE `role_to_user` ADD CONSTRAINT `role_to_user_role_id_fkey` FOREIGN KEY (`role_id`) REFERENCES `role`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `role_to_user` ADD CONSTRAINT `role_to_user_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
