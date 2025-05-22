import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';
import { UnauthorizedException } from '@nestjs/common';

@Injectable()
export class AuthenticationService {

  constructor(
    @InjectRepository(User) private readonly usersRepo: Repository<User>,
    private readonly jwtService: JwtService,
  ) { }
  async getTokensAndStoreRefresh(user: User) {
    const payload = { sub: user.id, email: user.email };
    const accessToken = await this.jwtService.signAsync(payload);
    const refreshToken = await this.jwtService.signAsync(payload, {
      expiresIn: '7d',
    });

    user.hashedRefreshToken = await bcrypt.hash(refreshToken, 10);
    await this.usersRepo.save(user);

    return {
      access_token: accessToken,
      refresh_token: refreshToken,
      user: { id: user.id, email: user.email },
    };
  }
  async refreshTokens(userId: number, refreshToken: string) {
    const user = await this.usersRepo.findOneBy({ id: userId });
    if (!user || !user.hashedRefreshToken)
      throw new UnauthorizedException('No refresh token stored');

    const match = await bcrypt.compare(refreshToken, user.hashedRefreshToken);
    if (!match) throw new UnauthorizedException('Invalid refresh token');

    return this.getTokensAndStoreRefresh(user);
  }

  async logout(userId: number) {
    await this.usersRepo.update(userId, { hashedRefreshToken: undefined });
  }

  async register(email: string, password: string) {
    const existing = await this.usersRepo.findOneBy({ email });
    if (existing) throw new UnauthorizedException('User already exists');

    const hash = await bcrypt.hash(password, 10);
    const user = this.usersRepo.create({ email, password: hash });
    await this.usersRepo.save(user);

    return this.getTokensAndStoreRefresh(user);
  }

  async login(email: string, password: string) {
    const user = await this.usersRepo.findOneBy({ email });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new UnauthorizedException('Invalid credentials');
    }
    return this.getTokensAndStoreRefresh(user);
  }
  async getProfile(userId: number) {
    const user = await this.usersRepo.findOneBy({ id: userId });
    if (!user) throw new UnauthorizedException('User not found');

    return { id: user.id, email: user.email };
  }
}
