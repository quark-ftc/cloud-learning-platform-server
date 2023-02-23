/*
  Warnings:

  - You are about to drop the column `title` on the `menu` table. All the data in the column will be lost.
  - The primary key for the `role` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `student` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `teacher` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `user` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - A unique constraint covering the columns `[menu_title]` on the table `menu` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[username]` on the table `Student` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[username]` on the table `Teacher` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `menu_title` to the `menu` table without a default value. This is not possible if the table is not empty.
  - Added the required column `username` to the `Student` table without a default value. This is not possible if the table is not empty.
  - Added the required column `username` to the `Teacher` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `menu_to_role` DROP FOREIGN KEY `menu_to_role_title_fkey`;

-- DropForeignKey
ALTER TABLE `student` DROP FOREIGN KEY `Student_student_id_fkey`;

-- DropForeignKey
ALTER TABLE `teacher` DROP FOREIGN KEY `Teacher_teacher_id_fkey`;

-- DropIndex
DROP INDEX `menu_title_key` ON `menu`;

-- AlterTable
ALTER TABLE `menu` DROP COLUMN `title`,
    ADD COLUMN `menu_title` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `role` DROP PRIMARY KEY,
    MODIFY `role_id` VARCHAR(191) NOT NULL,
    ADD PRIMARY KEY (`role_id`);

-- AlterTable
ALTER TABLE `student` DROP PRIMARY KEY,
    ADD COLUMN `username` VARCHAR(191) NOT NULL,
    MODIFY `student_id` VARCHAR(191) NOT NULL,
    ADD PRIMARY KEY (`student_id`);

-- AlterTable
ALTER TABLE `teacher` DROP PRIMARY KEY,
    ADD COLUMN `username` VARCHAR(191) NOT NULL,
    MODIFY `teacher_id` VARCHAR(191) NOT NULL,
    ADD PRIMARY KEY (`teacher_id`);

-- AlterTable
ALTER TABLE `user` DROP PRIMARY KEY,
    ADD COLUMN `age` VARCHAR(191) NULL,
    ADD COLUMN `avatar` VARCHAR(191) NULL,
    ADD COLUMN `email` VARCHAR(191) NULL,
    ADD COLUMN `nickname` VARCHAR(191) NULL,
    ADD COLUMN `school` VARCHAR(191) NULL,
    MODIFY `user_id` VARCHAR(191) NOT NULL,
    ADD PRIMARY KEY (`user_id`);

-- CreateIndex
CREATE UNIQUE INDEX `menu_menu_title_key` ON `menu`(`menu_title`);

-- CreateIndex
CREATE UNIQUE INDEX `Student_username_key` ON `Student`(`username`);

-- CreateIndex
CREATE UNIQUE INDEX `Teacher_username_key` ON `Teacher`(`username`);

-- AddForeignKey
ALTER TABLE `Teacher` ADD CONSTRAINT `Teacher_username_fkey` FOREIGN KEY (`username`) REFERENCES `user`(`username`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Student` ADD CONSTRAINT `Student_username_fkey` FOREIGN KEY (`username`) REFERENCES `user`(`username`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `menu_to_role` ADD CONSTRAINT `menu_to_role_title_fkey` FOREIGN KEY (`title`) REFERENCES `menu`(`menu_title`) ON DELETE RESTRICT ON UPDATE CASCADE;
