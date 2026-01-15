import { Module } from '@nestjs/common';
import { PostController } from './post.controller.js';
import { PostService } from './post.service.js';
import { AuthModule } from '../auth/auth.module.js';
import { CommonModule } from '../common/common.module.js';
import { PrismaModule } from '../prisma/prisma.module.js';

@Module({
  imports: [AuthModule, CommonModule, PrismaModule],
  controllers: [PostController],
  providers: [PostService],
})
export class PostModule {}
