import { IsBoolean } from 'class-validator';

export class CreateBlogDto {
  @IsBoolean()
  status: boolean;
}
