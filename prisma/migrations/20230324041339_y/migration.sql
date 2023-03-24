-- DropForeignKey
ALTER TABLE `student_to_homework` DROP FOREIGN KEY `student_to_homework_homework_name_homework_belonged_class_fkey`;

-- AddForeignKey
ALTER TABLE `student_to_homework` ADD CONSTRAINT `student_to_homework_homework_name_homework_belonged_class_fkey` FOREIGN KEY (`homework_name`, `homework_belonged_class`) REFERENCES `homework`(`homework_name`, `belonged_class`) ON DELETE CASCADE ON UPDATE CASCADE;
