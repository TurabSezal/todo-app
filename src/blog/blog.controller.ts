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
import { DeleteResult, UpdateResult } from 'typeorm';
import { BlogService } from './blog.service';
import { CreateBlogDto } from './dto/create-blog.dto';

@Controller('blog')
@UseGuards(JwtAuthGuard)
@UseFilters(HttpExceptionFilter)
export class BlogController {
  constructor(private readonly blogService: BlogService) {}

  /**
   * @param createBlogDto
   * @returns {Promise<GenericResponse<CreateBlogDto>>}
   */
  @Post()
  create(
    @Body(ValidationPipe) createBlogDto: CreateBlogDto,
  ): Promise<GenericResponse<CreateBlogDto>> {
    return this.blogService.create(createBlogDto);
  }
  /**
   * @returns {Promise<GenericResponse<Blog[]>>}
   */
  @Get()
  findAll(): Promise<GenericResponse<Blog[]>> {
    return this.blogService.findAll();
  }
  /**
   * @param id
   * @returns {Promise<GenericResponse<Blog>>}
   */
  @Get(':id')
  findOne(@Param('id') id: string): Promise<GenericResponse<Blog>> {
    return this.blogService.findOneById(id);
  }
  /**
   * @param id
   * @returns {Promise<GenericResponse<UpdateResult>>}
   */
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateBlogDto: CreateBlogDto,
  ): Promise<GenericResponse<UpdateResult>> {
    return this.blogService.updateBlog(id, updateBlogDto);
  }
  /**
   * @param id
   * @returns {Promise<GenericResponse<DeleteResult>>}
   */
  @Delete(':id')
  remove(@Param('id') id: string): Promise<GenericResponse<DeleteResult>> {
    return this.blogService.remove(id);
  }
}
