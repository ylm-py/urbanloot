import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { AuthenticationService } from './authentication.service';

@Controller()
export class AuthenticationController {
  constructor(private readonly authService: AuthenticationService) {}

  @MessagePattern({ cmd: 'auth_register' })
  register(data: any) {
    return this.authService.register(data);
  }

  @MessagePattern({ cmd: 'auth_login' })
  login(data: any) {
    return this.authService.login(data);
  }
}
