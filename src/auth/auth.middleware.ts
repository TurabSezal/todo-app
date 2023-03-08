/* eslint-disable prettier/prettier */
import { NestMiddleware } from '@nestjs/common';
import { CACHE_MANAGER, Inject, Injectable, Request } from '@nestjs/common';
import { Cache } from 'cache-manager';
@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(@Inject(CACHE_MANAGER) private readonly cacheManager: Cache) {}
  async use(payload: any, @Request() req: any, next: () => void) {
    if (req.baseUrl === './auth/login') {
      next();
      return;
    }
    if (req.baseUrl === './auth/register') {
      next();
      return;
    }
    const token = req.headers.authorization.split(' ')[1];
    const user = await this.cacheManager.get(payload.email);
    if (!user) {
      return null;
    }
    const blacklist = await this.cacheManager.get('user-blacklist-' + token);
    if (blacklist) {
      return null;
    }
    return { id: payload.sub, email: payload.email };
  }
}
