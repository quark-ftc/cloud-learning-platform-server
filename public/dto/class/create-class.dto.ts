import { IsOptional, IsString } from 'class-validator';
export class CreateClassDto {
  @IsString()
  className: string;
  @IsOptional()
  classDescription: string;
}
