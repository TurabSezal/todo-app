import { DeleteResult } from 'typeorm';
import { BlogTranslations } from '../blog/entities/blog-translations.entity';
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  UseFilters,
  ValidationPipe,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwtauth.guard';
import { HttpExceptionFilter } from 'src/http-exception/http-exception.filter';
import { BlogTranslationsService } from './blog-translations.service';
import { CreateBlogTranslationsDto } from './dto/create-blog-translations.dto';
import { GenericResponse } from 'src/GenericResponse/GenericResponse';

@Controller('blog-translations')
@UseGuards(JwtAuthGuard)
@UseFilters(HttpExceptionFilter)
export class BlogTranslationsController {
  constructor(
    private readonly blogTranslationsService: BlogTranslationsService,
  ) {}

  @Post()
  create(
    @Body(ValidationPipe) createBlogDto: CreateBlogTranslationsDto,
  ): Promise<GenericResponse<CreateBlogTranslationsDto>> {
    return this.blogTranslationsService.create(createBlogDto);
  }

  @Get()
  findAll(): Promise<GenericResponse<BlogTranslations[]>> {
    return this.blogTranslationsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<GenericResponse<BlogTranslations>> {
    return this.blogTranslationsService.findOneById(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateBlogTranslationsDto: CreateBlogTranslationsDto,
  ): Promise<GenericResponse<BlogTranslations>> {
    return this.blogTranslationsService.update(id, updateBlogTranslationsDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<GenericResponse<DeleteResult>> {
    return this.blogTranslationsService.remove(id);
  }
}
