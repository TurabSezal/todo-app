import { CreateBlogTranslationsDto } from './dto/create-blog-translations.dto';
import { BlogTranslations } from '../blog/entities/blog-translations.entity';
import { GenericResponse } from 'src/GenericResponse/GenericResponse';
import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository } from 'typeorm';
import { Cache } from 'cache-manager';

@Injectable()
export class BlogTranslationsService {
  constructor(
    @InjectRepository(BlogTranslations)
    private readonly blogTranslationsRepository: Repository<BlogTranslations>,
    @Inject(CACHE_MANAGER)
    private cacheManager: Cache,
  ) {}
  /**
   * @param createLanguageDto
   * @returns CreateLanguageDto
   */
  async create(
    createBlogTranslationsDto: CreateBlogTranslationsDto,
  ): Promise<GenericResponse<CreateBlogTranslationsDto>> {
    const response = await this.blogTranslationsRepository.save(
      createBlogTranslationsDto,
    );
    if (!response) {
      throw new GenericResponse(null, 'Something went wrong', 404);
    }

    return GenericResponse.created(createBlogTranslationsDto);
  }
  /**
   * @returns BlogTranslations[]
   */
  async findAll(): Promise<GenericResponse<BlogTranslations[]>> {
    const response = await this.blogTranslationsRepository.find();
    if (response.length === 0) {
      throw new GenericResponse(null, 'Blog not found', 404);
    }
    return GenericResponse.success(response);
  }
  /**
   * @param id
   * @returns BlogTranslations
   */
  async findOneById(id: string): Promise<GenericResponse<BlogTranslations>> {
    const response = await this.blogTranslationsRepository.findOneOrFail({
      where: { id: id },
    });
    if (!response) {
      throw new GenericResponse(null, 'Blog not found', 404);
    }
    return GenericResponse.success(response);
  }
  /**
   * @param id
   * @param updateBlogTranslationsDto
   * @returns BlogTranslations
   */
  async update(
    id: string,
    UpdateBlogTranslationsDto: CreateBlogTranslationsDto,
  ): Promise<GenericResponse<BlogTranslations>> {
    await this.blogTranslationsRepository.update(id, UpdateBlogTranslationsDto);
    const languageDto = await this.blogTranslationsRepository.findOne({
      where: { id: id },
    });
    if (!languageDto) {
      throw GenericResponse.notFound(null, 'Something went wrong');
    }
    return GenericResponse.success(languageDto);
  }

  /**
   * @param id
   * @returns DeleteResult
   */
  async remove(id: string): Promise<GenericResponse<DeleteResult>> {
    const response: DeleteResult =
      await this.blogTranslationsRepository.softDelete(id);
    const Userexist = await this.blogTranslationsRepository.exist({
      where: { id: id },
    });
    if (!Userexist) {
      throw new GenericResponse(response, 'User not found', 404);
    }
    if (response.affected === 1) {
      return GenericResponse.success(response);
    }
    throw new GenericResponse(response, 'Something went wrong', 500);
  }
}
