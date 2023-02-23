import { IsString, IsOptional } from 'class-validator';
export class RoleCreateDto {
  @IsString()
  name: string;

  @IsString()
  value: string;

  @IsString()
  @IsOptional()
  description: string;
}
