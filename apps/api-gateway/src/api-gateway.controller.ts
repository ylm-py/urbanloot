import { Controller, Post, Body, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { RegisterDto } from 'apps/authentication/src/dto/register-dto';
import { LoginDto } from 'apps/authentication/src/dto/login-dto';

@Controller('auth')
export class ApiGatewayController {
  constructor(@Inject('AUTH_SERVICE') private readonly authClient: ClientProxy) {}

  @Post('register')
  register(@Body() dto: RegisterDto) {
    return this.authClient.send({ cmd: 'auth_register' }, dto);
  }

  @Post('login')
  login(@Body() dto: LoginDto) {
    return this.authClient.send({ cmd: 'auth_login' }, dto);
  }
}
