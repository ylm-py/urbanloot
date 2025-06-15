import { Controller } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiTags } from '@nestjs/swagger';
import { MessagePattern } from '@nestjs/microservices';


@ApiTags('users')
@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @MessagePattern({ cmd: 'user_create_profile' })
  createProfile(dto: CreateUserDto) {
    console.log('Called !')
    return this.userService.createProfile(dto);
  }
}