/*
  Warnings:

  - The primary key for the `menu` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `menu_id` on the `menu` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Int`.
  - The primary key for the `role` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `role_id` on the `role` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Int`.
  - The primary key for the `user` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `user_id` on the `user` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Int`.
  - Added the required column `pid` to the `menu` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `menu` DROP PRIMARY KEY,
    ADD COLUMN `menuIcon` VARCHAR(191) NULL,
    ADD COLUMN `pid` INTEGER NOT NULL,
    MODIFY `menu_id` INTEGER NOT NULL AUTO_INCREMENT,
    ADD PRIMARY KEY (`menu_id`);

-- AlterTable
ALTER TABLE `role` DROP PRIMARY KEY,
    MODIFY `role_id` INTEGER NOT NULL AUTO_INCREMENT,
    ADD PRIMARY KEY (`role_id`);

-- AlterTable
ALTER TABLE `user` DROP PRIMARY KEY,
    MODIFY `user_id` INTEGER NOT NULL AUTO_INCREMENT,
    ADD PRIMARY KEY (`user_id`);

-- CreateTable
CREATE TABLE `Teacher` (
    `teacher_id` INTEGER NOT NULL AUTO_INCREMENT,

    PRIMARY KEY (`teacher_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Student` (
    `student_id` INTEGER NOT NULL AUTO_INCREMENT,

    PRIMARY KEY (`student_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Course` (
    `course_id` INTEGER NOT NULL AUTO_INCREMENT,
    `course_name` VARCHAR(191) NOT NULL,
    `course_Description` VARCHAR(191) NULL,
    `course_cover` VARCHAR(191) NOT NULL,
    `course_video` VARCHAR(191) NOT NULL,
    `course_price` VARCHAR(191) NOT NULL,
    `course_grade` VARCHAR(191) NOT NULL,
    `course_state` BOOLEAN NOT NULL DEFAULT true,

    UNIQUE INDEX `Course_course_name_key`(`course_name`),
    PRIMARY KEY (`course_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Teacher` ADD CONSTRAINT `Teacher_teacher_id_fkey` FOREIGN KEY (`teacher_id`) REFERENCES `role`(`role_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Student` ADD CONSTRAINT `Student_student_id_fkey` FOREIGN KEY (`student_id`) REFERENCES `role`(`role_id`) ON DELETE RESTRICT ON UPDATE CASCADE;
