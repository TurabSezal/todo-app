import { Language } from './entities/language.entity';
import { HttpExceptionFilter } from './../http-exception/http-exception.filter';
import { JwtAuthGuard } from 'src/auth/jwtauth.guard';
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  UseGuards,
  UseFilters,
  ValidationPipe,
} from '@nestjs/common';
import { LanguageService } from './language.service';
import { CreateLanguageDto } from './dto/create-language.dto';
import { GenericResponse } from 'src/GenericResponse/GenericResponse';

@Controller('language')
@UseGuards(JwtAuthGuard)
@UseFilters(HttpExceptionFilter)
export class LanguageController {
  constructor(private readonly languageService: LanguageService) {}
  /**
   * @param CreateLanguageDto
   * @returns {Promise<GenericResponse<CreateLanguageDto>>}
   */
  @Post()
  create(
    @Body(ValidationPipe) createLanguageDto: CreateLanguageDto,
  ): Promise<GenericResponse<CreateLanguageDto>> {
    return this.languageService.create(createLanguageDto);
  }
  /**
   * @returns {Promise<GenericResponse<Language[]>>}
   */
  @Get()
  findAll(): Promise<GenericResponse<Language[]>> {
    return this.languageService.findAll();
  }
  /**
   * @param id
   * @returns {Promise<GenericResponse<Language>>}
   */
  @Get(':id')
  findOneById(@Param('id') id: string): Promise<GenericResponse<Language>> {
    return this.languageService.findOneById(id);
  }
  /**
   * @param code
   * @returns {Promise<GenericResponse<Language>>}
   */
  @Get(':code')
  findOneByCode(
    @Param('code') code: string,
  ): Promise<GenericResponse<Language>> {
    return this.languageService.findOneByCode(code);
  }
  /**
   * @param id
   * @param CreateLanguageDto
   * @returns {Promise<GenericResponse<Language>>}
   */
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateLanguageDto: CreateLanguageDto,
  ): Promise<GenericResponse<Language>> {
    return this.languageService.update(id, updateLanguageDto);
  }
}
