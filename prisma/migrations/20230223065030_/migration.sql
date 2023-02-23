/*
  Warnings:

  - The primary key for the `role_to_user` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `user_name` on the `role_to_user` table. All the data in the column will be lost.
  - Added the required column `username` to the `role_to_user` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `role_to_user` DROP FOREIGN KEY `role_to_user_user_name_fkey`;

-- AlterTable
ALTER TABLE `role_to_user` DROP PRIMARY KEY,
    DROP COLUMN `user_name`,
    ADD COLUMN `username` VARCHAR(191) NOT NULL,
    ADD PRIMARY KEY (`username`, `role_name`);

-- AddForeignKey
ALTER TABLE `role_to_user` ADD CONSTRAINT `role_to_user_username_fkey` FOREIGN KEY (`username`) REFERENCES `user`(`username`) ON DELETE RESTRICT ON UPDATE CASCADE;
