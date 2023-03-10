import { IsBoolean, IsOptional } from 'class-validator';
import { CreateBlogTranslationDto } from './create-blogtranslation.dto';

export class CreateBlogDto {
  @IsBoolean()
  status: boolean;

  @IsOptional()
  translations: CreateBlogTranslationDto[];
}
