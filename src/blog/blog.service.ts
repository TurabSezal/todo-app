import { BlogTranslations } from 'src/blog/entities/blog-translations.entity';
import { CreateBlogTranslationDto } from './dto/create-blogtranslation.dto';
import { Blog } from 'src/blog/entities/blog.entity';
import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateBlogDto } from './dto/create-blog.dto';
import { DeleteResult, Repository } from 'typeorm';
import { GenericResponse } from 'src/GenericResponse/GenericResponse';
import { Cache } from 'cache-manager';

@Injectable()
export class BlogService {
  constructor(
    @InjectRepository(Blog)
    private readonly blogRepository: Repository<Blog>,
    @Inject(CACHE_MANAGER)
    private cacheManager: Cache,
    @InjectRepository(BlogTranslations)
    private readonly blogTranslationRepository: Repository<BlogTranslations>,
    @Inject(CACHE_MANAGER)
    private cacheManagertr: Cache,
  ) {}
  /**
   * @param CreateBlogDto
   * @returns CreateBlogDto
   */
  async create(createBlogDto: CreateBlogDto) {
    const response = await this.blogRepository.save(createBlogDto);
    if (!response) {
      throw new GenericResponse(null, 'Something went wrong', 404);
    }

    return GenericResponse.created(createBlogDto);
  }

  async createtranslation(CreateBlogTranslationDto: CreateBlogTranslationDto) {
    const response = await this.blogRepository.save(CreateBlogTranslationDto);
    console.log(CreateBlogTranslationDto);

    if (!response) {
      throw new GenericResponse(null, 'Something went wrong', 404);
    }

    return GenericResponse.created(CreateBlogTranslationDto);
  }
  /**
   * @returns Blog[]
   */
  async findAll(): Promise<GenericResponse<Blog[]>> {
    const response = await this.blogRepository.find();
    if (response.length === 0) {
      throw new GenericResponse(null, 'Blog not found', 404);
    }
    return GenericResponse.success(response);
  }
  /**
   * @returns Blog[]
   */
  async findAllTranslations(): Promise<GenericResponse<BlogTranslations[]>> {
    const response = await this.blogTranslationRepository.find();
    if (response.length === 0) {
      throw new GenericResponse(null, 'Blog not found', 404);
    }
    return GenericResponse.success(response);
  }
  /**
   * @param id
   * @returns Blog
   */

  async findOneById(id: string): Promise<GenericResponse<Blog>> {
    const response = await this.blogRepository.findOneOrFail({
      where: { id: id },
    });
    if (!response) {
      throw new GenericResponse(null, 'Blog not found', 404);
    }
    return GenericResponse.success(response);
  }
  /**
   * @param id
   * @returns Blog
   */

  async findOneTranslation(
    id: string,
  ): Promise<GenericResponse<BlogTranslations>> {
    const response = await this.blogTranslationRepository.findOneOrFail({
      where: { id: id },
    });
    if (!response) {
      throw new GenericResponse(null, 'Blog not found', 404);
    }
    return GenericResponse.success(response);
  }
  /**
   * @param id
   * @param CreateBlogDto
   * @returns blog
   */
  async update(
    id: string,
    updateBlogDto: CreateBlogDto,
  ): Promise<GenericResponse<Blog>> {
    await this.blogRepository.update(id, updateBlogDto);
    const blogDto = await this.blogRepository.findOne({
      where: { id: id },
    });
    if (!blogDto) {
      throw GenericResponse.notFound(null, 'Something went wrong');
    }
    return GenericResponse.success(blogDto);
  }
  /**
   * @param id
   * @param CreateBlogDto
   * @returns blog
   */
  async updateTranslation(
    id: string,
    updateBlogTranslationDto: CreateBlogTranslationDto,
  ): Promise<GenericResponse<BlogTranslations>> {
    await this.blogRepository.update(id, updateBlogTranslationDto);
    const blogTranslationDto = await this.blogTranslationRepository.findOne({
      where: { id: id },
    });
    if (!blogTranslationDto) {
      throw GenericResponse.notFound(null, 'Something went wrong');
    }
    return GenericResponse.success(blogTranslationDto);
  }

  /**
   * @param id
   * @returns DeleteResult
   */
  async remove(id: string): Promise<GenericResponse<DeleteResult>> {
    const response: DeleteResult = await this.blogRepository.softDelete(id);
    const Blogexist = await this.blogRepository.exist({ where: { id: id } });
    if (!Blogexist) {
      throw new GenericResponse(response, 'Blog not found', 404);
    }
    if (response.affected === 1) {
      return GenericResponse.success(response);
    }
    throw new GenericResponse(response, 'Something went wrong', 500);
  }
}
