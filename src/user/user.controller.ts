import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';

import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('/register')
  async createUser(@Body() body: CreateUserDto) {
    const { password, email } = body;
    const existUser = await this.userService.findByEmail(email);
    if (existUser) {
      return existUser;
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    return this.userService.create({ ...body, password: hashedPassword });
  }

  @Post('/auth')
  loginUser(@Body() body: CreateUserDto) {
    const { email } = body;
    return this.userService.findByEmail(email);
  }

  @Get()
  findAll() {
    return this.userService.findAll();
  }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.userService.findOne(+id);
  // }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(+id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(+id);
  }
}
