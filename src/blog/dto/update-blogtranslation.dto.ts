/* eslint-disable prettier/prettier */
import { PartialType } from '@nestjs/mapped-types';
import { CreateBlogTranslationDto } from './create-blogtranslation.dto';

export class UpdateBlogTranslationDto extends PartialType(
  CreateBlogTranslationDto,
) {}
