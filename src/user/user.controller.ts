import { JwtAuthGuard } from './../auth/jwtauth.guard';
import { HttpExceptionFilter } from './../http-exception/http-exception.filter';
import { DeleteResult } from 'typeorm';
import { GenericResponse } from './../GenericResponse/GenericResponse';
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ValidationPipe,
  UseFilters,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';

@Controller('user')
@UseGuards(JwtAuthGuard)
@UseFilters(HttpExceptionFilter)
export class UserController {
  constructor(private readonly userService: UserService) {}
  /**
   * @param CreateUserDto
   * @returns User
   */

  @Post()
  create(
    @Body(ValidationPipe) createUserDto: CreateUserDto,
  ): Promise<GenericResponse<CreateUserDto>> {
    return this.userService.create(createUserDto);
  }
  /**
   * @returns User
   */

  @Get()
  findAll(): Promise<GenericResponse<User[]>> {
    return this.userService.findAll();
  }
  /**
   * @param email
   * @returns User
   */

  @Get(':id')
  findOne(id: string): Promise<GenericResponse<User>> {
    return this.userService.findOneByMail(id);
  }
  /**
   * @param id
   * @param updateUserDto
   * @returns User
   */
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateUserDto: CreateUserDto,
  ): Promise<GenericResponse<User>> {
    return this.userService.update(id, updateUserDto);
  }
  /**
   * @param id
   * @returns boolean
   */
  @Delete(':id')
  remove(@Param('id') id: string): Promise<GenericResponse<DeleteResult>> {
    return this.userService.remove(id);
  }
}
