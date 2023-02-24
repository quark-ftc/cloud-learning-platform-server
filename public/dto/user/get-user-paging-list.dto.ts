import { IsString } from 'class-validator';
export class GetUserPagingListDto {
  @IsString()
  page: string;
  @IsString()
  size: string;
}
