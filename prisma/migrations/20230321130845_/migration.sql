-- AlterTable
ALTER TABLE `student_to_homework` MODIFY `ai_evaluation` JSON NULL,
    MODIFY `teacher_comment` VARCHAR(191) NULL;
