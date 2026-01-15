import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../user/user.service.js';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.usersService.findOne(email);
    if (user && user.password) {
      const isMatch = await bcrypt.compare(pass, user.password);

      if (isMatch) {
        const { password, ...result } = user;
        return result;
      }
    }
    return null;
  }
  async login(user: any) {
    const payload = { email: user.email, sub: user.id };
    return {
      success: true,
      message: 'Login successful',
      data: {
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          avatar: user.displayImage,
          isVerified: user.isVerified,
        },
        token: this.jwtService.sign(payload),
        auth: {
          type: 'Bearer',
          expiresIn: '1h',
        },
      },
    };
  }

  async register(userData: any) {
    const user = await this.usersService.create(userData);
    const { password, ...userWithoutPass } = user;
    const token = await this.login(userWithoutPass);
    return {
      user: userWithoutPass,
      ...token,
    };
  }
}
