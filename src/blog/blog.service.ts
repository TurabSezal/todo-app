import { BlogTranslations } from './entities/blog-translations.entity';
import { Blog } from './entities/blog.entity';
import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateBlogDto } from './dto/create-blog.dto';
import { DeleteResult, Repository, UpdateResult } from 'typeorm';
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
   * @returns {Promise<GenericResponse<CreateBlogDto>>}
   */
  async create(
    createBlogDto: CreateBlogDto,
  ): Promise<GenericResponse<CreateBlogDto>> {
    const response = await this.blogRepository.save(createBlogDto);
    if (!response) {
      throw new GenericResponse(null, 'Something went wrong', 404);
    }
    if (response.translations.length > 0) {
      for (let i = 0; i < response.translations.length; i++) {
        const blogTranslation = {
          ...response.translations[i],
          blog_id: response.id,
        };
        console.log(blogTranslation);

        const translationsResponse = await this.blogTranslationRepository.save(
          blogTranslation,
        );
        response.translations.find(
          (blogTranslation) =>
            blogTranslation.Language_id === translationsResponse.Language_id,
        ).blog_id = response.id;
      }
      return GenericResponse.created(response);
    }
  }

  /**
   * @returns {Promise<GenericResponse<Blog[]>>}
   */
  async findAll(): Promise<GenericResponse<Blog[]>> {
    const response = await this.blogRepository.find();
    if (!response) {
      throw GenericResponse.notFound('Blogs not found');
    }

    await Promise.all(
      response.map(async (blog) => {
        const blogTranslations = await this.blogTranslationRepository.find({
          where: { blog_id: blog.id },
        });
        blog.blogTranslations = blogTranslations;
      }),
    );

    return GenericResponse.success<Blog[]>(response, 'Blogs found');
  }
  /**
   * @param id
   * @returns {Promise<GenericResponse<Blog>>}
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
   * @param CreateBlogDto
   * @returns {Promise<GenericResponse<UpdateResult>>}
   */
  async updateBlog(
    id: string,
    updateBlogDto: CreateBlogDto,
  ): Promise<GenericResponse<UpdateResult>> {
    try {
      const response = await this.blogRepository.update({ id }, {});
      await this.blogTranslationRepository.delete({ blog_id: id });
      if (updateBlogDto.translations.length > 0) {
        for (let i = 0; i < updateBlogDto.translations.length; i++) {
          const translation = updateBlogDto.translations[i];
          await this.blogTranslationRepository.save({
            ...translation,
            blog_id: id,
          });
        }
      }
      return GenericResponse.success(response, 'succes');
    } catch (error) {
      throw GenericResponse.notFound(null, 'Something went wrong');
    }
  }

  /**
   * @param id
   * @returns {Promise<GenericResponse<DeleteResult>>}
   */
  async remove(id: string): Promise<GenericResponse<DeleteResult>> {
    const blogexist = await this.blogRepository.exist({
      where: { id: id },
    });

    if (!blogexist) {
      throw new GenericResponse(null, 'Blog not found', 404);
    }

    const response: DeleteResult = await this.blogRepository.softDelete(id);
    if (response.affected === 1) {
      const blog = await this.blogTranslationRepository.find({
        where: { blog_id: id },
      });
      if (blog.length > 0) {
        await this.blogTranslationRepository.softRemove(blog);
      }
      return GenericResponse.success(response);
    }
    throw new GenericResponse(response, 'Something went wrong', 500);
  }
  /**
   * @param id
   * @returns {Promise<GenericResponse<DeleteResult>>}
   */
  async removelanguage(id: string): Promise<GenericResponse<DeleteResult>> {
    const languageexist = await this.blogTranslationRepository.exist({
      where: { id: id },
    });
    if (!languageexist) {
      throw new GenericResponse(null, 'Blog not found', 404);
    }
    const response: DeleteResult =
      await this.blogTranslationRepository.softDelete(id);
    if (response.affected === 1) {
      return GenericResponse.success(response);
    }
    throw new GenericResponse(response, 'Something went wrong', 500);
  }
}
