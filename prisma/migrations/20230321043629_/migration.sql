/*
  Warnings:

  - You are about to drop the `homeword` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `homeword` DROP FOREIGN KEY `homeword_belonged_class_fkey`;

-- DropForeignKey
ALTER TABLE `homeword` DROP FOREIGN KEY `homeword_posted_teacher_fkey`;

-- DropForeignKey
ALTER TABLE `student_to_homework` DROP FOREIGN KEY `student_to_homework_homework_name_fkey`;

-- DropTable
DROP TABLE `homeword`;

-- CreateTable
CREATE TABLE `homework` (
    `homework_id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `topic` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NOT NULL,
    `create_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `update_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `posted_teacher` VARCHAR(191) NOT NULL,
    `belonged_class` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `homework_name_key`(`name`),
    PRIMARY KEY (`homework_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `homework` ADD CONSTRAINT `homework_posted_teacher_fkey` FOREIGN KEY (`posted_teacher`) REFERENCES `teacher`(`username`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `homework` ADD CONSTRAINT `homework_belonged_class_fkey` FOREIGN KEY (`belonged_class`) REFERENCES `class`(`className`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `student_to_homework` ADD CONSTRAINT `student_to_homework_homework_name_fkey` FOREIGN KEY (`homework_name`) REFERENCES `homework`(`name`) ON DELETE RESTRICT ON UPDATE CASCADE;
