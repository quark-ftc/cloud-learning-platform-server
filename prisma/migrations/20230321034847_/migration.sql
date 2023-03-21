/*
  Warnings:

  - You are about to drop the `studenttohomework` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `studenttohomework` DROP FOREIGN KEY `StudentToHomeWork_homeworkName_fkey`;

-- DropForeignKey
ALTER TABLE `studenttohomework` DROP FOREIGN KEY `StudentToHomeWork_student_username_fkey`;

-- DropTable
DROP TABLE `studenttohomework`;

-- CreateTable
CREATE TABLE `student_to_homework` (
    `id` VARCHAR(191) NOT NULL,
    `student_username` VARCHAR(191) NOT NULL,
    `homework_name` VARCHAR(191) NOT NULL,
    `homework_image` VARCHAR(191) NOT NULL,
    `evaluation` JSON NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `student_to_homework` ADD CONSTRAINT `student_to_homework_student_username_fkey` FOREIGN KEY (`student_username`) REFERENCES `student`(`username`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `student_to_homework` ADD CONSTRAINT `student_to_homework_homework_name_fkey` FOREIGN KEY (`homework_name`) REFERENCES `homeword`(`name`) ON DELETE RESTRICT ON UPDATE CASCADE;
