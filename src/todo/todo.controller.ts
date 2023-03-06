import { LocalAuthGuard } from './../auth/auth.guard';
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

@Controller('todo')
@UseFilters(HttpExceptionFilter)
@UseGuards(LocalAuthGuard)
export class TodoController {
  constructor(private readonly todoService: TodoService) {}
  /**
   * @param createTodoDto
   * @param userId
   * @returns CreateTodoDto
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
   * @returns Todo
   */
  @Get('/find-all-not/:userId')
  findAllTodoByUserNotCompleted(
    @Param('userId') userId: string,
  ): Promise<GenericResponse<Todo[]>> {
    return this.todoService.findAllTodoByNotCompleted(userId);
  }
  /**
   * @param userId
   * @returns Todo
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
   * @returns Todo
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
   * @returns boolean
   */
  @Delete(':id')
  remove(@Param('id') id: string): Promise<GenericResponse<DeleteResult>> {
    return this.todoService.remove(id);
  }
}
