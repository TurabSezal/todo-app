import { IsDate, IsString } from 'class-validator';

export class CreateBlogTranslationsDto {
  @IsString()
  language_id: string;

  @IsString()
  blog_id: string;

  @IsString()
  title: string;

  @IsString()
  content: string;

  @IsDate()
  timestamp: Date;
}
