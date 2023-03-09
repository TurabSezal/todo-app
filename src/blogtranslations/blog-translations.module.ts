import { BlogTranslations } from '../blog/entities/blog-translations.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { BlogTranslationsService } from './blog-translations.service';
import { BlogTranslationsController } from './blog-translations.controller';

@Module({
  imports: [TypeOrmModule.forFeature([BlogTranslations])],
  controllers: [BlogTranslationsController],
  providers: [BlogTranslationsService],
  exports: [BlogTranslationsService],
})
export class BlogTranslationsModule {}
