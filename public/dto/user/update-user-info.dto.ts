import { IsString } from 'class-validator';
export class UpdateUserInfoDto {
  @IsString()
  attribute: string;
  @IsString()
  value: string;
}
