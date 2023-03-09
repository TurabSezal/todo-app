/* eslint-disable prettier/prettier */
import * as jwt from 'jsonwebtoken';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}
  async refresh(refreshToken: string) {
    const secret = 'your-secret-key';
    const decoded = jwt.verify(refreshToken, secret) as { email: string };
    const email = decoded.email;
    const user = await this.userService.findOneByMail(email);
    if (!user) {
      throw new UnauthorizedException('Invalid token');
    }

    const payload = { email: decoded.email };
    const accessToken = jwt.sign(payload, secret, { expiresIn: '100m' });
    return accessToken;
  }
  /**
   * @param email
   * @param password
   * @returns result
   */

  async validateUser(email: string, password: string): Promise<any> {
    const response = await this.userService.findOneByMail(email);
    const user = response.data;
    if (user && user.password === password) {
      const { password, ...result } = user;
      return result;
    }

    return null;
  }
  /**
   * @param email
   * @param password
   * @returns token
   */
  async login(user: any) {
    const payload = { email: user.email, sub: user.id };
    const token = this.jwtService.sign(payload);

    return { access_token: token };
  }
  /**
   * @param token
   * @returns token
   */
  async decodejwt(token: string) {
    return this.jwtService.verify(token);
  }
}
