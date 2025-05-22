import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class AuthenticationService {
  private users: { id: number; email: string; password: string }[] = [];

  constructor(
    @InjectRepository(User) private readonly userRepo: Repository<User>,
  ) { }
  async register(email: string, password: string) {
    const existing = await this.userRepo.findOne({ where: { email } });
    if (existing) throw new Error('Email already registered');

    const hash = await bcrypt.hash(password, 10);
    const user = this.userRepo.create({ email, password: hash });
    await this.userRepo.save(user);

    return { message: 'User registered successfully' };
  }

  async login(email: string, password: string) {
    const user = await this.userRepo.findOne({ where: { email } });
    if (!user) throw new Error('Invalid credentials');

    const match = await bcrypt.compare(password, user.password);
    if (!match) throw new Error('Invalid credentials');

    const token = jwt.sign({ id: user.id, email: user.email }, "TOCHANGE", {
      expiresIn: '7d',
    });

    return { accessToken: token };
  }
}
