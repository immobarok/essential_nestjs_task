import { Module } from '@nestjs/common';
import { UsersService } from './user.service.js';
import { PrismaService } from '../prisma.service.js';
import { UsersController } from './user.controller.js';

@Module({
  controllers: [UsersController],
  providers: [UsersService, PrismaService],
  exports: [UsersService],
})
export class UsersModule {}
