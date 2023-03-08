/* eslint-disable prettier/prettier */
import { GenericResponse } from './../GenericResponse/GenericResponse';
import { Body, CACHE_MANAGER, Inject, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Cache } from 'cache-manager';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
  ) {}
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
    await this.cacheManager.set(
      email,
      token.access_token,
      this.authService.ttl,
    );

    return GenericResponse.success({ token });
  }
  /**
   * @param email
   * @returns string message
   */
  @Post('logout')
  async logout(
    @Body() user: { email: string },
  ): Promise<GenericResponse<string>> {
    const { email } = user;
    await this.cacheManager.del(email);
    return GenericResponse.success('Logout succes');
  }
}
