import { Controller, Post, Body, Inject, Get } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { RegisterDto } from 'apps/authentication/src/dto/register-dto';
import { LoginDto } from 'apps/authentication/src/dto/login-dto';
import { ApiTags } from '@nestjs/swagger';


@Controller('auth')
@ApiTags('api-gateway')
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
  @Post('refresh')
  refresh(@Body() dto: { userId: number; refreshToken: string }) {
    return this.authClient.send({ cmd: 'auth_refresh' }, dto);
  }
  @Post('logout')
  logout(@Body() dto: { userId: number }) {
    return this.authClient.send({ cmd: 'auth_logout' }, dto);
  }
  @Get('profile')
  getProfile(@Body() dto: { userId: number }) {
    return this.authClient.send({ cmd: 'auth_get_profile' }, dto);
  }
}
