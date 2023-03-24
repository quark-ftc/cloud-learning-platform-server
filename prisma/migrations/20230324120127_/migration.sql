-- DropForeignKey
ALTER TABLE `student_to_homework` DROP FOREIGN KEY `student_to_homework_student_username_fkey`;

-- AddForeignKey
ALTER TABLE `student_to_homework` ADD CONSTRAINT `student_to_homework_student_username_fkey` FOREIGN KEY (`student_username`) REFERENCES `student`(`username`) ON DELETE CASCADE ON UPDATE CASCADE;
