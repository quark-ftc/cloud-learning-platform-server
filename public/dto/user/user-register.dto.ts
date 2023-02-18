import { IsOptional, IsString } from 'class-validator';
export class UserRegisterDto {
  @IsString()
  username: string;
  @IsString()
  password: string;
  @IsOptional()
  role: string;
}
