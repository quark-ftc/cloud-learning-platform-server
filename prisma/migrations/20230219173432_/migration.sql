/*
  Warnings:

  - The primary key for the `role_to_user` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `role_name` on the `role_to_user` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[value]` on the table `role` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `role_value` to the `role_to_user` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `role_to_user` DROP FOREIGN KEY `role_to_user_role_name_fkey`;

-- AlterTable
ALTER TABLE `role_to_user` DROP PRIMARY KEY,
    DROP COLUMN `role_name`,
    ADD COLUMN `role_value` VARCHAR(191) NOT NULL,
    ADD PRIMARY KEY (`role_value`, `user_name`);

-- CreateIndex
CREATE UNIQUE INDEX `role_value_key` ON `role`(`value`);

-- AddForeignKey
ALTER TABLE `role_to_user` ADD CONSTRAINT `role_to_user_role_value_fkey` FOREIGN KEY (`role_value`) REFERENCES `role`(`value`) ON DELETE RESTRICT ON UPDATE CASCADE;
