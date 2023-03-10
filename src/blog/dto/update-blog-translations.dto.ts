import { CreateBlogTranslationDto } from './create-blogtranslation.dto';
import { PartialType } from '@nestjs/mapped-types';

export class UpdateBlogTranslationsDto extends PartialType(
  CreateBlogTranslationDto,
) {}
