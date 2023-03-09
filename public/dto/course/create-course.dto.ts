import { IsString, IsOptional } from 'class-validator';
export class CreateCourseDto {
  @IsString()
  courseName: string;
  @IsOptional()
  courseDescription: string;
  @IsString()
  coursePrice: string;
  @IsString()
  courseGrade: string;
  @IsString()
  courseState: string;
}
