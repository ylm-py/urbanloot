import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserProfile } from './entities/user-profile.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserProfile)
    private readonly userRepository: Repository<UserProfile>,
  ) {}

  async createProfile(createUserDto: CreateUserDto): Promise<UserProfile> {
    const userData = { ...createUserDto, id: createUserDto.id };
    const user = this.userRepository.create(userData);
    return this.userRepository.save(user);
  }

  async updateProfile(UpdateUserDto: UpdateUserDto): Promise<UserProfile> {
    const user = await this.userRepository.findOneBy({ id: UpdateUserDto.id });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    Object.assign(user, UpdateUserDto);
    return this.userRepository.save(user);
  }
}
