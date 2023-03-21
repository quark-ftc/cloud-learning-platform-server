/*
  Warnings:

  - A unique constraint covering the columns `[student_username,homework_belonged_class,homework_name]` on the table `student_to_homework` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `student_to_homework_student_username_homework_belonged_class_key` ON `student_to_homework`(`student_username`, `homework_belonged_class`, `homework_name`);
