import { IsString } from 'class-validator';
export class AddCourseToShoppingCartDto {
  @IsString()
  courseId: string;
  @IsString()
  address: string;
}
