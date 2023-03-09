import { BlogTranslations } from 'src/blog/entities/blog-translations.entity';
import { Blog } from 'src/blog/entities/blog.entity';
import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
  UseFilters,
  ValidationPipe,
  Patch,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwtauth.guard';
import { GenericResponse } from 'src/GenericResponse/GenericResponse';
import { HttpExceptionFilter } from 'src/http-exception/http-exception.filter';
import { DeleteResult } from 'typeorm';
import { BlogService } from './blog.service';
import { CreateBlogDto } from './dto/create-blog.dto';
import { CreateBlogTranslationDto } from './dto/create-blogtranslation.dto';

@Controller('blog')
@UseGuards(JwtAuthGuard)
@UseFilters(HttpExceptionFilter)
export class BlogController {
  constructor(private readonly blogService: BlogService) {}

  @Post()
  create(
    @Body(ValidationPipe) createBlogDto: CreateBlogDto,
  ): Promise<GenericResponse<CreateBlogDto>> {
    return this.blogService.create(createBlogDto);
  }

  @Post('-translation')
  createtranslation(
    @Body(ValidationPipe) createBlogTranslationDto: CreateBlogTranslationDto,
  ): Promise<GenericResponse<CreateBlogTranslationDto>> {
    console.log(Body);
    return this.blogService.createtranslation(createBlogTranslationDto);
  }

  @Get()
  findAll(): Promise<GenericResponse<Blog[]>> {
    return this.blogService.findAll();
  }
  @Get('blog-translation')
  findAllTranslations(): Promise<GenericResponse<BlogTranslations[]>> {
    return this.blogService.findAllTranslations();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<GenericResponse<Blog>> {
    return this.blogService.findOneById(id);
  }
  @Get('blog-translation:id')
  findOneTranslation(
    @Param('id') id: string,
  ): Promise<GenericResponse<BlogTranslations>> {
    return this.blogService.findOneTranslation(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() UpdateBlogDto: CreateBlogDto,
  ): Promise<GenericResponse<Blog>> {
    return this.blogService.update(id, UpdateBlogDto);
  }

  @Delete('blog-translation:id')
  remove(@Param('id') id: string): Promise<GenericResponse<DeleteResult>> {
    return this.blogService.remove(id);
  }
}
