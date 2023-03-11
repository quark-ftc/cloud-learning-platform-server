/*
  Warnings:

  - You are about to drop the `purchasedcourse` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `purchasedcourse` DROP FOREIGN KEY `PurchasedCourse_course_id_fkey`;

-- DropForeignKey
ALTER TABLE `purchasedcourse` DROP FOREIGN KEY `PurchasedCourse_username_fkey`;

-- DropTable
DROP TABLE `purchasedcourse`;

-- CreateTable
CREATE TABLE `purchase_course` (
    `purchased_course_id` VARCHAR(191) NOT NULL,
    `username` VARCHAR(191) NOT NULL,
    `course_id` VARCHAR(191) NOT NULL,
    `create_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `update_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `purchase_course_username_course_id_key`(`username`, `course_id`),
    PRIMARY KEY (`purchased_course_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `purchase_course` ADD CONSTRAINT `purchase_course_username_fkey` FOREIGN KEY (`username`) REFERENCES `user`(`username`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `purchase_course` ADD CONSTRAINT `purchase_course_course_id_fkey` FOREIGN KEY (`course_id`) REFERENCES `course`(`course_id`) ON DELETE RESTRICT ON UPDATE CASCADE;
