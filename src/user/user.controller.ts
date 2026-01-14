import { Controller, Get, Param } from '@nestjs/common';
import { UserService } from './user.service.js';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}
  @Get('users')
  getUsers() {
    return this.userService.getAllUsers();
  }
  @Get('user/:id')
  getUserById(@Param('id') id: Number) {
    return this.userService.getUserById(Number(id));
  }
}
