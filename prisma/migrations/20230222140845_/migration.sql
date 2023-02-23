-- DropForeignKey
ALTER TABLE `menu` DROP FOREIGN KEY `menu_pid_fkey`;

-- AlterTable
ALTER TABLE `menu` MODIFY `pid` INTEGER NULL DEFAULT 0;

-- AddForeignKey
ALTER TABLE `menu` ADD CONSTRAINT `menu_pid_fkey` FOREIGN KEY (`pid`) REFERENCES `menu`(`menu_id`) ON DELETE SET NULL ON UPDATE CASCADE;
