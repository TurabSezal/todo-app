import { GenericResponse } from './../GenericResponse/GenericResponse';
import { Inject, Injectable } from '@nestjs/common';
import { Repository, DeleteResult } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';
import { Cache } from 'cache-manager';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class UserService {
  constructor(
    private readonly userRepository: Repository<User>,
    @Inject('CACHE_MANAGER') private cacheManager: Cache,
  ) {}

  /**
   * @param createUserDto
   * @returns CreateUserDto
   */
  async create(
    createUserDto: CreateUserDto,
  ): Promise<GenericResponse<CreateUserDto>> {
    const response = await this.userRepository.save(createUserDto);
    if (!response) {
      throw new GenericResponse(null, 'Something went wrong', 404);
    }

    return GenericResponse.created(createUserDto);
  }

  /**
   * @returns User[]
   */
  async findAll(): Promise<GenericResponse<User[]>> {
    const response = await this.userRepository.find();
    if (response.length === 0) {
      throw new GenericResponse(null, 'Users not found', 404);
    }

    return GenericResponse.success(response);
  }

  /**
   * @param id
   * @returns User
   */
  async findOne(id: string): Promise<GenericResponse<User>> {
    const cacheKey = `user_${id}`;

    let response = await this.cacheManager.get<User>(cacheKey);
    if (!response) {
      response = await this.userRepository.findOneOrFail({ where: { id } });
      await this.cacheManager.set(cacheKey, response, 60);
    }

    return GenericResponse.success(response);
  }

  async findOneByMail(id: string): Promise<GenericResponse<User>> {
    const response = await this.userRepository.findOneOrFail({
      where: { id: id },
    });
    if (!response) {
      throw new GenericResponse(null, 'User not found', 404);
    }
    return GenericResponse.success(response);
  }

  /**
   * @param id
   * @param updateUserDto
   * @returns User
   */
  async update(
    id: string,
    updateUserDto: CreateUserDto,
  ): Promise<GenericResponse<User>> {
    await this.userRepository.update(id, updateUserDto);
    const userDto = await this.userRepository.findOne({ where: { id: id } });
    if (!userDto) {
      throw GenericResponse.notFound(null, 'Something went wrong');
    }
    return GenericResponse.success(userDto);
  }

  /**
   * @param id
   * @returns DeleteResult
   */
  async remove(id: string): Promise<GenericResponse<DeleteResult>> {
    const response: DeleteResult = await this.userRepository.softDelete(id);
    const Userexist = await this.userRepository.exist({ where: { id: id } });
    if (!Userexist) {
      throw new GenericResponse(response, 'User not found', 404);
    }
    if (response.affected === 1) {
      return GenericResponse.success(response);
    }
    throw new GenericResponse(response, 'Something went wrong', 500);
  }
}
