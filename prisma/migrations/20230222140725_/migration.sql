/*
  Warnings:

  - You are about to drop the column `menu_name` on the `menu` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[title]` on the table `menu` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `title` to the `menu` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX `menu_menu_name_key` ON `menu`;

-- AlterTable
ALTER TABLE `menu` DROP COLUMN `menu_name`,
    ADD COLUMN `title` VARCHAR(191) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `menu_title_key` ON `menu`(`title`);
