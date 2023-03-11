/*
  Warnings:

  - You are about to drop the `shoppingcart` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `shoppingcart` DROP FOREIGN KEY `shoppingCart_course_id_fkey`;

-- DropForeignKey
ALTER TABLE `shoppingcart` DROP FOREIGN KEY `shoppingCart_username_fkey`;

-- DropTable
DROP TABLE `shoppingcart`;

-- CreateTable
CREATE TABLE `shopping_cart` (
    `order_id` VARCHAR(191) NOT NULL,
    `username` VARCHAR(191) NOT NULL,
    `course_id` VARCHAR(191) NOT NULL,
    `address` VARCHAR(191) NOT NULL,
    `create_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `update_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `shopping_cart_username_course_id_key`(`username`, `course_id`),
    PRIMARY KEY (`order_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `shopping_cart` ADD CONSTRAINT `shopping_cart_username_fkey` FOREIGN KEY (`username`) REFERENCES `user`(`username`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `shopping_cart` ADD CONSTRAINT `shopping_cart_course_id_fkey` FOREIGN KEY (`course_id`) REFERENCES `course`(`course_id`) ON DELETE RESTRICT ON UPDATE CASCADE;
