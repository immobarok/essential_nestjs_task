import { Module } from '@nestjs/common';
import { UsersService } from './user.service.js';
import { UsersController } from './user.controller.js';
import { PrismaModule } from '../prisma/prisma.module.js';

@Module({
  imports: [PrismaModule],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
