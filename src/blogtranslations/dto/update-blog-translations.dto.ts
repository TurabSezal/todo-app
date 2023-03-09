import { PartialType } from '@nestjs/mapped-types';
import { CreateBlogTranslationsDto } from './create-blog-translations.dto';

export class UpdateBlogTranslationsDto extends PartialType(
  CreateBlogTranslationsDto,
) {}
