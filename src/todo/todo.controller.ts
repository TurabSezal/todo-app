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
import { TodoService } from './todo.service';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { Todo } from './entities/todo.entity';
import { CreateTodoDto } from './dto/create-todo.dto';
import { JwtAuthGuard } from 'src/auth/jwtauth.guard';

@Controller('todo')
@UseGuards(JwtAuthGuard)
@UseFilters(HttpExceptionFilter)
export class TodoController {
  constructor(private readonly todoService: TodoService) {}
  /**
   * @param createTodoDto
   * @param userId
   * @returns {Promise<GenericResponse<CreateTodoDto>>}
   */
  @Post(':userId')
  create(
    @Body(ValidationPipe) createTodoDto: CreateTodoDto,
    @Param('userId') userId: string,
  ): Promise<GenericResponse<CreateTodoDto>> {
    return this.todoService.create(createTodoDto, userId);
  }
  /**
   * @param userId
   * @returns {Promise<GenericResponse<Todo[]>>}
   */
  @Get('/find-all-not/:userId')
  findAllTodoByUserNotCompleted(
    @Param('userId') userId: string,
  ): Promise<GenericResponse<Todo[]>> {
    return this.todoService.findAllTodoByNotCompleted(userId);
  }
  /**
   * @param userId
   * @returns {Promise<GenericResponse<Todo[]>>}
   */
  @Get('find-all/:userId')
  findAllTodoByUserCompleted(
    @Param('userId') userId: string,
  ): Promise<GenericResponse<Todo[]>> {
    return this.todoService.findAllTodoByCompleted(userId);
  }
  /**
   * @param userId
   * @returns {<GenericResponse<Todo[]>>}
   */
  @Get(':id')
  findOne(@Param('userId') id: string): Promise<GenericResponse<Todo>> {
    return this.todoService.findOne(id);
  }
  /**
   * @param userId
   * @returns {Promise<GenericResponse<Todo>>}
   */
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateTodoDto: UpdateTodoDto,
  ): Promise<GenericResponse<Todo>> {
    return this.todoService.update(id, updateTodoDto);
  }
  /**
   * @param id
   * @returns {Promise<GenericResponse<DeleteResult>>}
   */
  @Delete(':id')
  remove(@Param('id') id: string): Promise<GenericResponse<DeleteResult>> {
    return this.todoService.remove(id);
  }
}
