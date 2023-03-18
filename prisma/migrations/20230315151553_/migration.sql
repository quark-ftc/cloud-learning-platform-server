/*
  Warnings:

  - You are about to drop the column `course_Description` on the `course` table. All the data in the column will be lost.
  - You are about to drop the column `course_categore` on the `course` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `class_to_student` DROP FOREIGN KEY `class_to_student_classId_fkey`;

-- DropForeignKey
ALTER TABLE `class_to_student` DROP FOREIGN KEY `class_to_student_studentId_fkey`;

-- DropForeignKey
ALTER TABLE `menu_to_role` DROP FOREIGN KEY `menu_to_role_role_name_fkey`;

-- DropForeignKey
ALTER TABLE `menu_to_role` DROP FOREIGN KEY `menu_to_role_title_fkey`;

-- DropForeignKey
ALTER TABLE `purchased_course` DROP FOREIGN KEY `purchased_course_course_id_fkey`;

-- DropForeignKey
ALTER TABLE `purchased_course` DROP FOREIGN KEY `purchased_course_username_fkey`;

-- DropForeignKey
ALTER TABLE `role_to_user` DROP FOREIGN KEY `role_to_user_role_name_fkey`;

-- DropForeignKey
ALTER TABLE `role_to_user` DROP FOREIGN KEY `role_to_user_username_fkey`;

-- DropForeignKey
ALTER TABLE `shopping_cart` DROP FOREIGN KEY `shopping_cart_course_id_fkey`;

-- DropForeignKey
ALTER TABLE `shopping_cart` DROP FOREIGN KEY `shopping_cart_username_fkey`;

-- DropForeignKey
ALTER TABLE `student` DROP FOREIGN KEY `student_username_fkey`;

-- DropForeignKey
ALTER TABLE `teacher` DROP FOREIGN KEY `teacher_username_fkey`;

-- AlterTable
ALTER TABLE `course` DROP COLUMN `course_Description`,
    DROP COLUMN `course_categore`,
    ADD COLUMN `course_category` VARCHAR(191) NULL,
    ADD COLUMN `course_description` VARCHAR(191) NULL;

-- AddForeignKey
ALTER TABLE `teacher` ADD CONSTRAINT `teacher_username_fkey` FOREIGN KEY (`username`) REFERENCES `user`(`username`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `student` ADD CONSTRAINT `student_username_fkey` FOREIGN KEY (`username`) REFERENCES `user`(`username`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `role_to_user` ADD CONSTRAINT `role_to_user_role_name_fkey` FOREIGN KEY (`role_name`) REFERENCES `role`(`role_name`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `role_to_user` ADD CONSTRAINT `role_to_user_username_fkey` FOREIGN KEY (`username`) REFERENCES `user`(`username`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `menu_to_role` ADD CONSTRAINT `menu_to_role_title_fkey` FOREIGN KEY (`title`) REFERENCES `menu`(`menu_title`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `menu_to_role` ADD CONSTRAINT `menu_to_role_role_name_fkey` FOREIGN KEY (`role_name`) REFERENCES `role`(`role_name`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `shopping_cart` ADD CONSTRAINT `shopping_cart_username_fkey` FOREIGN KEY (`username`) REFERENCES `user`(`username`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `shopping_cart` ADD CONSTRAINT `shopping_cart_course_id_fkey` FOREIGN KEY (`course_id`) REFERENCES `course`(`course_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `purchased_course` ADD CONSTRAINT `purchased_course_username_fkey` FOREIGN KEY (`username`) REFERENCES `user`(`username`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `purchased_course` ADD CONSTRAINT `purchased_course_course_id_fkey` FOREIGN KEY (`course_id`) REFERENCES `course`(`course_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `class_to_student` ADD CONSTRAINT `class_to_student_studentId_fkey` FOREIGN KEY (`studentId`) REFERENCES `student`(`student_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `class_to_student` ADD CONSTRAINT `class_to_student_classId_fkey` FOREIGN KEY (`classId`) REFERENCES `class`(`class_id`) ON DELETE CASCADE ON UPDATE CASCADE;
