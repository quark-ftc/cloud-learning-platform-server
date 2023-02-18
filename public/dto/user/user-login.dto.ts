import { IsString, IsOptional } from 'class-validator';

export class UserLoginDto {
  @IsString()
  username: string;
  @IsString()
  password: string;
  @IsOptional()
  role: string;
}
