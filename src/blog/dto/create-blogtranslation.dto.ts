/* eslint-disable prettier/prettier */

import { IsString, IsUUID } from 'class-validator';

export class CreateBlogTranslationDto {
  @IsUUID()
  public blog_id: string;

  @IsUUID()
  public Language_id: string;

  @IsString()
  title: string;

  @IsString()
  content: string;
}
