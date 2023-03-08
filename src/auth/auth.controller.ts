/* eslint-disable prettier/prettier */
import { Body, CACHE_MANAGER, Inject, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Cache } from 'cache-manager';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
  ) {}

  @Post('login')
  async login(@Body() user: { email: string; password: string }) {
    const { email } = user;
    const token = await this.authService.login(user);
    await this.cacheManager.set(
      email,
      token.access_token,
      this.authService.ttl,
    );
    return token;
  }

  @Post('logout')
  async logout(@Body() user: { email: string }) {
    const { email } = user;
    await this.cacheManager.del(email);
    return { message: 'Logout successful' };
  }
}
