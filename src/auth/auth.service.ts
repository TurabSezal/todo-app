/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { Cache } from 'cache-manager';

@Injectable()
export class AuthService {
  ttl = 100000;
  private blacklist: string[] = [];

  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly cacheManager: Cache,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    const response = await this.userService.findOneByMail(email);
    const user = response.data;
    if (user && user.password === password) {
      const { password, ...result } = user;
      if (user && user.email === email) {
        return result;
      }
    }

    return null;
  }

  async login(user: any) {
    const payload = { email: user.email, sub: user.id };
    const token = this.jwtService.sign(payload);

    await this.cacheManager.set(token, true);
    return { access_token: token };
  }

  async logout(token: string): Promise<boolean> {
    this.blacklist.push(token);
    await this.cacheManager.del(token);
    return true;
  }

  async isTokenBlacklisted(token: string): Promise<boolean> {
    if (this.blacklist.includes(token)) {
      return true;
    }
    const cachedToken = await this.cacheManager.get(token);
    return !!cachedToken;
  }
}
