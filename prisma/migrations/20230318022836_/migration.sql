/*
  Warnings:

  - The primary key for the `class_to_student` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `classId` on the `class_to_student` table. All the data in the column will be lost.
  - You are about to drop the column `studentId` on the `class_to_student` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[student_username]` on the table `class_to_student` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[class_name]` on the table `class_to_student` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `class_name` to the `class_to_student` table without a default value. This is not possible if the table is not empty.
  - Added the required column `student_username` to the `class_to_student` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `class_to_student` DROP FOREIGN KEY `class_to_student_classId_fkey`;

-- DropForeignKey
ALTER TABLE `class_to_student` DROP FOREIGN KEY `class_to_student_studentId_fkey`;

-- AlterTable
ALTER TABLE `class_to_student` DROP PRIMARY KEY,
    DROP COLUMN `classId`,
    DROP COLUMN `studentId`,
    ADD COLUMN `class_name` VARCHAR(191) NOT NULL,
    ADD COLUMN `student_username` VARCHAR(191) NOT NULL,
    ADD PRIMARY KEY (`student_username`, `class_name`);

-- CreateIndex
CREATE UNIQUE INDEX `class_to_student_student_username_key` ON `class_to_student`(`student_username`);

-- CreateIndex
CREATE UNIQUE INDEX `class_to_student_class_name_key` ON `class_to_student`(`class_name`);

-- AddForeignKey
ALTER TABLE `class_to_student` ADD CONSTRAINT `class_to_student_student_username_fkey` FOREIGN KEY (`student_username`) REFERENCES `student`(`username`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `class_to_student` ADD CONSTRAINT `class_to_student_class_name_fkey` FOREIGN KEY (`class_name`) REFERENCES `class`(`className`) ON DELETE CASCADE ON UPDATE CASCADE;
