/*
  Warnings:

  - You are about to drop the `purchase_course` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `purchase_course` DROP FOREIGN KEY `purchase_course_course_id_fkey`;

-- DropForeignKey
ALTER TABLE `purchase_course` DROP FOREIGN KEY `purchase_course_username_fkey`;

-- DropTable
DROP TABLE `purchase_course`;

-- CreateTable
CREATE TABLE `purchased_course` (
    `purchased_course_id` VARCHAR(191) NOT NULL,
    `username` VARCHAR(191) NOT NULL,
    `course_id` VARCHAR(191) NOT NULL,
    `create_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `update_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `purchased_course_username_course_id_key`(`username`, `course_id`),
    PRIMARY KEY (`purchased_course_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `purchased_course` ADD CONSTRAINT `purchased_course_username_fkey` FOREIGN KEY (`username`) REFERENCES `user`(`username`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `purchased_course` ADD CONSTRAINT `purchased_course_course_id_fkey` FOREIGN KEY (`course_id`) REFERENCES `course`(`course_id`) ON DELETE RESTRICT ON UPDATE CASCADE;
