import { Inject, Injectable, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { RegisterDto } from './dto/register-dto';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class AuthenticationService {

  constructor(
    @InjectRepository(User) private readonly usersRepo: Repository<User>,
    private readonly jwtService: JwtService,
    @Inject('USERS_SERVICE') private readonly usersClient: ClientProxy,
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
      throw new RpcException({ statusCode: HttpStatus.UNAUTHORIZED, message: 'No refresh token stored' });

    const match = await bcrypt.compare(refreshToken, user.hashedRefreshToken);
    if (!match)
      throw new RpcException({ statusCode: HttpStatus.UNAUTHORIZED, message: 'Invalid refresh token' });

    return this.getTokensAndStoreRefresh(user);
  }

  async logout(userId: number) {
    const result = await this.usersRepo.update(userId, { hashedRefreshToken: null });
    if (result.affected === 0) {
      throw new RpcException({
        statusCode: HttpStatus.UNAUTHORIZED,
        message: 'User not found or already logged out',
      });
    }
    return { message: 'User logged out successfully' };
  }

  async register(dto: RegisterDto) {
    try{
      const existing = await this.usersRepo.findOneBy({ email: dto.email });
      if (existing)
        throw new RpcException({ statusCode: HttpStatus.CONFLICT, message: 'User already exists' });

      const hash = await bcrypt.hash(dto.password, 10);
      const user = this.usersRepo.create({ email: dto.email, password: hash });
      await this.usersRepo.save(user);
      // Create user profile in the users service
      await lastValueFrom(
        this.usersClient.send({ cmd: 'user_create_profile' }, {
          id: Number(user.id),
        }),
      );
      return this.getTokensAndStoreRefresh(user);
    } catch (error) {
      console.error('Registration error:', error);
      if (error instanceof RpcException) {
        throw error;
      }
      const message = error?.message ? `Registration failed: ${error.message}` : 'Registration failed';
      throw new RpcException({ statusCode: HttpStatus.BAD_GATEWAY, message });
    }
  }

  async login(email: string, password: string) {
    const user = await this.usersRepo.findOneBy({ email });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new RpcException({ statusCode: HttpStatus.UNAUTHORIZED, message: 'Invalid credentials' });
    }
    return this.getTokensAndStoreRefresh(user);
  }
  async getProfile(userId: number) {
    const user = await this.usersRepo.findOneBy({ id: userId });
    if (!user) throw new RpcException({ statusCode: HttpStatus.NOT_FOUND, message: 'User not found' });

    return { id: user.id, email: user.email };
  }
}
