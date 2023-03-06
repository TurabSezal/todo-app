import { GenericResponse } from './../GenericResponse/GenericResponse';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { Repository, DeleteResult } from 'typeorm';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { Todo } from './entities/todo.entity';

@Injectable()
export class TodoService {
  constructor(
    @InjectRepository(Todo)
    private readonly todorepository: Repository<Todo>,
    @InjectRepository(User)
    private readonly userrepository: Repository<User>,
  ) {}
  /**
   * @param createTodoDto
   * @param userId
   * @returns CreateTodoDto
   */
  async create(
    createTodoDto: CreateTodoDto,
    userId: string,
  ): Promise<GenericResponse<CreateTodoDto>> {
    createTodoDto['userId'] = userId;
    const response = await this.todorepository.save(createTodoDto);
    if (!response) {
      throw new GenericResponse(null, 'Something went wrong', 404);
    }
    return GenericResponse.success(response);
  }
  /**
   * @param userId
   * @returns Todo
   */
  async findAllTodoByCompleted(
    userId: string,
  ): Promise<GenericResponse<Todo[]>> {
    const response = await this.todorepository.find({
      relations: ['user'],
      where: { user: { id: userId }, completed: true },
    });
    if (response.length === 0) {
      throw new GenericResponse(null, 'Users not found', 404);
    }

    return GenericResponse.success(response);
  }
  /**
   * @param userId
   * @returns Todo
   */
  async findAllTodoByNotCompleted(
    userId: string,
  ): Promise<GenericResponse<Todo[]>> {
    const response = await this.todorepository.find({
      relations: ['user'],
      where: { user: { id: userId }, completed: false },
    });
    if (response.length === 0) {
      throw new GenericResponse(null, 'Users not found', 404);
    }
    return GenericResponse.success(response);
  }

  /**
   * @param id
   * @returns {GenericResponse<Todo[]>}
   */
  async findOne(id: string): Promise<GenericResponse<Todo>> {
    const todo = await this.todorepository.findOne({ where: { id: id } });
    if (!todo) {
      throw new GenericResponse(null, 'User not found', 404);
    }

    return GenericResponse.success(todo);
  }
  /**
   * @param id
   * @param UpdateTodoDto
   * @returns Todo
   */
  async update(
    id: string,
    updateTodoDto: UpdateTodoDto,
  ): Promise<GenericResponse<Todo>> {
    await this.todorepository.update(id, updateTodoDto);
    const todoDto = await this.todorepository.findOne({
      where: { id: id },
    });
    if (!todoDto) {
      throw new GenericResponse(null, 'Something went wrong', 404);
    }
    return GenericResponse.success(todoDto);
  }
  /**
   * @param id
   * @returns boolean
   */
  async remove(id: string): Promise<GenericResponse<DeleteResult>> {
    const deleteResult = await this.todorepository.softDelete(id);
    const userexist = await this.todorepository.exist({ where: { id: id } });
    if (!userexist) {
      throw new GenericResponse(null, 'User not found', 404);
    }
    if (deleteResult.affected == 0) {
      throw new GenericResponse(null, 'Something went wrong', 500);
    }
    return GenericResponse.success(deleteResult);
  }
}
