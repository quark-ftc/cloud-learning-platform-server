-- AddForeignKey
ALTER TABLE `menu` ADD CONSTRAINT `menu_pid_fkey` FOREIGN KEY (`pid`) REFERENCES `menu`(`menu_id`) ON DELETE RESTRICT ON UPDATE CASCADE;
