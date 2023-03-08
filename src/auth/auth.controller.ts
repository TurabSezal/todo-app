/* eslint-disable prettier/prettier */
import { UserService } from './../user/user.service';
import { GenericResponse } from './../GenericResponse/GenericResponse';
import {
  Body,
  CACHE_MANAGER,
  Inject,
  Controller,
  Post,
  Request,
  ValidationPipe,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { Cache } from 'cache-manager';
import { CreateUserDto } from 'src/user/dto/create-user.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly UserService: UserService,
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
  ) {}
  /**
   * @param CreateUserDto
   * @returns User
   */

  @Post('register')
  async create(
    @Body(ValidationPipe) createUserDto: CreateUserDto,
  ): Promise<GenericResponse<CreateUserDto>> {
    return await this.UserService.create(createUserDto);
  }
  /**
   * @param email
   * @param password
   * @returns token
   */
  @Post('login')
  async login(
    @Body() user: { email: string; password: string },
  ): Promise<GenericResponse<{ token }>> {
    const { email } = user;
    const token = await this.authService.login(user);
    await this.cacheManager.set(email, token.access_token, 1000000);

    return GenericResponse.success({ token });
  }
  /**
   * @param email
   * @returns string message
   */
  @Post('logout')
  async logout(@Request() req: any): Promise<GenericResponse<string>> {
    const token = req.headers.authorization.split(' ')[1];
    const decodedJwt = await this.authService.decodejwt(token);
    await this.cacheManager.set('user-blacklist-' + token, true);
    await this.cacheManager.del(decodedJwt.email);
    return GenericResponse.success('Logout success');
  }
}
