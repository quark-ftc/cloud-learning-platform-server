/*
  Warnings:

  - You are about to drop the column `homeworkbelongedClass` on the `student_to_homework` table. All the data in the column will be lost.
  - Added the required column `homework_belonged_class` to the `student_to_homework` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `student_to_homework` DROP FOREIGN KEY `student_to_homework_homework_name_homeworkbelongedClass_fkey`;

-- AlterTable
ALTER TABLE `student_to_homework` DROP COLUMN `homeworkbelongedClass`,
    ADD COLUMN `homework_belonged_class` VARCHAR(191) NOT NULL;

-- AddForeignKey
ALTER TABLE `student_to_homework` ADD CONSTRAINT `student_to_homework_homework_name_homework_belonged_class_fkey` FOREIGN KEY (`homework_name`, `homework_belonged_class`) REFERENCES `homework`(`homework_name`, `belonged_class`) ON DELETE RESTRICT ON UPDATE CASCADE;
