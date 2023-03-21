-- CreateTable
CREATE TABLE `homeword` (
    `homework_id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `topic` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NOT NULL,
    `create_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `update_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `posted_teacher` VARCHAR(191) NOT NULL,
    `belonged_class` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `homeword_name_key`(`name`),
    PRIMARY KEY (`homework_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `StudentToHomeWork` (
    `id` VARCHAR(191) NOT NULL,
    `student_username` VARCHAR(191) NOT NULL,
    `homeworkName` VARCHAR(191) NOT NULL,
    `homeworkImage` VARCHAR(191) NOT NULL,
    `evaluation` JSON NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `homeword` ADD CONSTRAINT `homeword_posted_teacher_fkey` FOREIGN KEY (`posted_teacher`) REFERENCES `teacher`(`username`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `homeword` ADD CONSTRAINT `homeword_belonged_class_fkey` FOREIGN KEY (`belonged_class`) REFERENCES `class`(`className`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `StudentToHomeWork` ADD CONSTRAINT `StudentToHomeWork_student_username_fkey` FOREIGN KEY (`student_username`) REFERENCES `student`(`username`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `StudentToHomeWork` ADD CONSTRAINT `StudentToHomeWork_homeworkName_fkey` FOREIGN KEY (`homeworkName`) REFERENCES `homeword`(`name`) ON DELETE RESTRICT ON UPDATE CASCADE;
