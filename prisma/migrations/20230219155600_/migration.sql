/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `role` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `role` ADD COLUMN `user_id` VARCHAR(191) NULL;

-- CreateIndex
CREATE UNIQUE INDEX `role_name_key` ON `role`(`name`);

-- AddForeignKey
ALTER TABLE `role` ADD CONSTRAINT `role_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
