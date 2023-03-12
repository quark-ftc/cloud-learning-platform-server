import { IsString, IsOptional } from 'class-validator';
export class RoleCreateDto {
  @IsString()
  roleName: string;

  @IsString()
  @IsOptional()
  description: string;
}
