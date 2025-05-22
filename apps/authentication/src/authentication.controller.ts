import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { AuthenticationService } from './authentication.service';
import { RegisterDto } from './dto/register-dto';
import { LoginDto } from './dto/login-dto';

@Controller()
export class AuthenticationController {
  constructor(private readonly authService: AuthenticationService) {}

  @MessagePattern({ cmd: 'auth_register' })
  register(dto: RegisterDto) {
    return this.authService.register(dto.email, dto.password);
  }

  @MessagePattern({ cmd: 'auth_login' })
  login(dto: LoginDto) {
    return this.authService.login(dto.email, dto.password);
  }
}
