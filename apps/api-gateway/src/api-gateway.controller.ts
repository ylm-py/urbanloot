import { Controller, Post, Body, Inject, Get, UseGuards, Req, OnModuleInit, Ip } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { RegisterDto } from 'apps/authentication/src/dto/register-dto';
import { LoginDto } from 'apps/authentication/src/dto/login-dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from './guards/jwt-auth.guard';



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
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  logout(@Req() req: any) {
    const userId = req.user.sub;
    return this.authClient.send({ cmd: 'auth_logout' }, { userId });
  }
  @Get('profile')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  getProfile(@Req() req: any) {
    const userId = req.user.sub;
    return this.authClient.send({ cmd: 'auth_get_profile' }, { userId });
  }
}
