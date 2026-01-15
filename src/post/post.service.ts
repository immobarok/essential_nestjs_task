import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma.service.js';
import { CreatePostDto } from './dto/create-post.dto.js';

@Injectable()
export class PostService {
  private readonly logger = new Logger(PostService.name);

  constructor(private prisma: PrismaService) {}
  async createPost(data: CreatePostDto, userId: number, imageUrls: string[]) {
    try {
      return await this.prisma.post.create({
        data: {
          title: data.title,
          content: data.content,
          authorId: userId,
          images: {
            create: imageUrls.map((url) => ({ url })),
          },
        },
        include: {
          images: true,
          author: { select: { id: true, email: true } },
        },
      });
    } catch (error) {
      this.logger.error('Failed to create post', error.stack);
      throw error;
    }
  }
}
