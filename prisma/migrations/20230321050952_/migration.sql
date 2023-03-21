/*
  Warnings:

  - You are about to drop the column `description` on the `homework` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `homework` table. All the data in the column will be lost.
  - You are about to drop the column `topic` on the `homework` table. All the data in the column will be lost.
  - You are about to drop the column `evaluation` on the `student_to_homework` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[homework_name,belonged_class]` on the table `homework` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `deadling` to the `homework` table without a default value. This is not possible if the table is not empty.
  - Added the required column `descriptionImage` to the `homework` table without a default value. This is not possible if the table is not empty.
  - Added the required column `descriptionText` to the `homework` table without a default value. This is not possible if the table is not empty.
  - Added the required column `homework_name` to the `homework` table without a default value. This is not possible if the table is not empty.
  - Added the required column `ai_evaluation` to the `student_to_homework` table without a default value. This is not possible if the table is not empty.
  - Added the required column `homeworkbelongedClass` to the `student_to_homework` table without a default value. This is not possible if the table is not empty.
  - Added the required column `teacher_comment` to the `student_to_homework` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `student_to_homework` DROP FOREIGN KEY `student_to_homework_homework_name_fkey`;

-- DropIndex
DROP INDEX `homework_name_key` ON `homework`;

-- AlterTable
ALTER TABLE `homework` DROP COLUMN `description`,
    DROP COLUMN `name`,
    DROP COLUMN `topic`,
    ADD COLUMN `deadling` DATETIME(3) NOT NULL,
    ADD COLUMN `descriptionImage` VARCHAR(191) NOT NULL,
    ADD COLUMN `descriptionText` VARCHAR(191) NOT NULL,
    ADD COLUMN `homework_name` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `student_to_homework` DROP COLUMN `evaluation`,
    ADD COLUMN `ai_evaluation` JSON NOT NULL,
    ADD COLUMN `homeworkbelongedClass` VARCHAR(191) NOT NULL,
    ADD COLUMN `teacher_comment` VARCHAR(191) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `homework_homework_name_belonged_class_key` ON `homework`(`homework_name`, `belonged_class`);

-- AddForeignKey
ALTER TABLE `student_to_homework` ADD CONSTRAINT `student_to_homework_homework_name_homeworkbelongedClass_fkey` FOREIGN KEY (`homework_name`, `homeworkbelongedClass`) REFERENCES `homework`(`homework_name`, `belonged_class`) ON DELETE RESTRICT ON UPDATE CASCADE;
