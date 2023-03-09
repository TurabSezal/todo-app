import { Language } from './entities/language.entity';
import { GenericResponse } from 'src/GenericResponse/GenericResponse';
import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import { CreateLanguageDto } from './dto/create-language.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cache } from 'cache-manager';

@Injectable()
export class LanguageService {
  constructor(
    @InjectRepository(Language)
    private readonly languageRepository: Repository<Language>,
    @Inject(CACHE_MANAGER)
    private cacheManager: Cache,
  ) {}
  /**
   * @param createLanguageDto
   * @returns CreateLanguageDto
   */
  async create(
    createLanguageDto: CreateLanguageDto,
  ): Promise<GenericResponse<CreateLanguageDto>> {
    const existingLanguage = await this.languageRepository
      .createQueryBuilder('language')
      .where('language.code = :code', { code: createLanguageDto.code })
      .getOne();

    if (existingLanguage) {
      throw new GenericResponse(null, 'Language already exists', 400);
    }

    const response = await this.languageRepository.save(createLanguageDto);
    if (!response) {
      throw new GenericResponse(null, 'Something went wrong', 404);
    }

    return GenericResponse.created(createLanguageDto);
  }
  /**
   * @returns Language[]
   */
  async findAll(): Promise<GenericResponse<Language[]>> {
    const response = await this.languageRepository.find();
    if (response.length === 0) {
      throw new GenericResponse(null, 'Languages not found', 404);
    }
    return GenericResponse.success(response);
  }
  /**
   * @param id
   * @returns Language
   */
  async findOneById(id: string): Promise<GenericResponse<Language>> {
    const response = await this.languageRepository.findOneOrFail({
      where: { id: id },
    });
    if (!response) {
      throw new GenericResponse(null, 'Language not found', 404);
    }
    return GenericResponse.success(response);
  }
  /**
   * @param id
   * @returns Language
   */
  async findOneByCode(code: string): Promise<GenericResponse<Language>> {
    const response = await this.languageRepository.findOneOrFail({
      where: { code: code },
    });
    if (!response) {
      throw new GenericResponse(null, 'Language not found', 404);
    }
    return GenericResponse.success(response);
  }
  /**
   * @param id
   * @param updateLanguageDto
   * @returns language
   */
  async update(
    id: string,
    updateLanguageDto: CreateLanguageDto,
  ): Promise<GenericResponse<Language>> {
    await this.languageRepository.update(id, updateLanguageDto);
    const languageDto = await this.languageRepository.findOne({
      where: { id: id },
    });
    if (!languageDto) {
      throw GenericResponse.notFound(null, 'Something went wrong');
    }
    return GenericResponse.success(languageDto);
  }
}
