import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { AuthenticationService } from './authentication.service';
import { RegisterDto } from './dto/register-dto';
import { LoginDto } from './dto/login-dto';
import { ApiTags } from '@nestjs/swagger';


@ApiTags('authentication')
@Controller()
export class AuthenticationController {
  constructor(private readonly authService: AuthenticationService) {}

  @MessagePattern({ cmd: 'auth_register' })
  register(dto: RegisterDto) {
    return this.authService.register(dto);
  }

  @MessagePattern({ cmd: 'auth_login' })
  login(dto: LoginDto) {
    return this.authService.login(dto.email, dto.password);
  }
  @MessagePattern({ cmd: 'auth_refresh' })
  refresh(dto: { userId: number; refreshToken: string }) {
    return this.authService.refreshTokens(dto.userId, dto.refreshToken);
  }
  @MessagePattern({ cmd: 'auth_logout' })
  logout(dto: { userId: number }) {
    return this.authService.logout(dto.userId);
  }
  @MessagePattern({ cmd: 'auth_get_profile' })
  getProfile(dto: { userId: number }) {
    return this.authService.getProfile(dto.userId);
  }
}
