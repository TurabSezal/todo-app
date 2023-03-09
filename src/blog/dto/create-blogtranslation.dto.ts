/* eslint-disable prettier/prettier */
import { BlogTranslations } from 'src/blog/entities/blog-translations.entity';
import { IsObject } from 'class-validator';

export class CreateBlogTranslationDto {
  @IsObject()
  public BlogTranslations: BlogTranslations;
}
