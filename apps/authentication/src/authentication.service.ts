import { Injectable, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthenticationService {
  private users: { id: number; email: string; password: string }[] = [];

  constructor(private readonly jwtService: JwtService) {}

  async register(body: any) {
    const { email, password } = body;
    const hashed = await bcrypt.hash(password, 10);
    const user = { id: Date.now(), email, password: hashed };
    this.users.push(user);
    return { message: 'User registered', user: { email: user.email } };
  }

  async login(body: any) {
    const { email, password } = body;
    const user = this.users.find((u) => u.email === email);
    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const token = this.jwtService.sign({ sub: user.id, email: user.email });
    return { access_token: token };
  }
}
