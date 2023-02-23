/*
  Warnings:

  - The primary key for the `role_to_user` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `role_name` on the `role_to_user` table. All the data in the column will be lost.
  - You are about to drop the column `user_name` on the `role_to_user` table. All the data in the column will be lost.
  - Added the required column `role_id` to the `role_to_user` table without a default value. This is not possible if the table is not empty.
  - Added the required column `user_id` to the `role_to_user` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `role_to_user` DROP FOREIGN KEY `role_to_user_role_name_fkey`;

-- DropForeignKey
ALTER TABLE `role_to_user` DROP FOREIGN KEY `role_to_user_user_name_fkey`;

-- AlterTable
ALTER TABLE `role_to_user` DROP PRIMARY KEY,
    DROP COLUMN `role_name`,
    DROP COLUMN `user_name`,
    ADD COLUMN `role_id` INTEGER NOT NULL,
    ADD COLUMN `user_id` INTEGER NOT NULL,
    ADD PRIMARY KEY (`role_id`, `user_id`);

-- AddForeignKey
ALTER TABLE `role_to_user` ADD CONSTRAINT `role_to_user_role_id_fkey` FOREIGN KEY (`role_id`) REFERENCES `role`(`role_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `role_to_user` ADD CONSTRAINT `role_to_user_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `user`(`user_id`) ON DELETE RESTRICT ON UPDATE CASCADE;
