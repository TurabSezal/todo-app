import { GenericResponse } from './../GenericResponse/GenericResponse';
import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import { Repository, DeleteResult } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Cache } from 'cache-manager';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @Inject(CACHE_MANAGER)
    private cacheManager: Cache,
  ) {}

  /**
   * @param createUserDto
   * @returns {Promise<GenericResponse<CreateUserDto>>}
   */
  async create(
    createUserDto: CreateUserDto,
  ): Promise<GenericResponse<CreateUserDto>> {
    const existingUser = await this.userRepository
      .createQueryBuilder('user')
      .where('user.email = :email', { email: createUserDto.email })
      .getOne();

    if (existingUser) {
      throw new GenericResponse(null, 'User already exists', 400);
    }

    const response = await this.userRepository.save(createUserDto);
    if (!response) {
      throw new GenericResponse(null, 'Something went wrong', 404);
    }

    return GenericResponse.created(createUserDto);
  }

  /**
   * @returns {Promise<GenericResponse<User[]>>}
   */
  async findAll(): Promise<GenericResponse<User[]>> {
    const response = await this.userRepository.find();
    if (response.length === 0) {
      throw new GenericResponse(null, 'Users not found', 404);
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
   * @returns {Promise<GenericResponse<User>>}
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
   * @returns {Promise<GenericResponse<DeleteResult>>}
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
