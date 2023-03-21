/*
  Warnings:

  - Added the required column `homeworkType` to the `homework` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `homework` ADD COLUMN `homeworkType` VARCHAR(191) NOT NULL,
    MODIFY `descriptionImage` VARCHAR(191) NULL;
