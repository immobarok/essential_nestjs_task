import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { MinioService } from '../minio/minio.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';

@Injectable()
export class PostService {
  constructor(
    private prisma: PrismaService,
    private minioService: MinioService,
  ) {}

  async create(createPostDto: CreatePostDto, files?: Express.Multer.File[]) {
    // Upload images to MinIO if provided
    let imageData: { url: string; presignedUrl: string }[] = [];
    if (files && files.length > 0) {
      imageData = await this.minioService.uploadMultiple(files, 'posts');
    }

    // Create post with images
    const post = await this.prisma.post.create({
      data: {
        title: createPostDto.title,
        content: createPostDto.content,
        published: createPostDto.published ?? false,
        authorId: createPostDto.authorId,
        images: {
          create: imageData.map((img) => ({
            url: img.url,
            presignedUrl: img.presignedUrl,
          })),
        },
      },
      include: {
        images: true,
        author: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    return {
      success: true,
      message: 'Post created successfully',
      data: post,
    };
  }

  async findAll() {
    const posts = await this.prisma.post.findMany({
      include: {
        images: true,
        author: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return {
      success: true,
      data: posts,
    };
  }

  async findOne(id: number) {
    const post = await this.prisma.post.findUnique({
      where: { id },
      include: {
        images: true,
        author: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    if (!post) {
      throw new NotFoundException(`Post with ID ${id} not found`);
    }

    return {
      success: true,
      data: post,
    };
  }

  async update(
    id: number,
    updatePostDto: UpdatePostDto,
    files?: Express.Multer.File[],
  ) {
    const existingPost = await this.prisma.post.findUnique({
      where: { id },
      include: { images: true },
    });

    if (!existingPost) {
      throw new NotFoundException(`Post with ID ${id} not found`);
    }

    // Upload new images if provided
    let newImageData: { url: string; presignedUrl: string }[] = [];
    if (files && files.length > 0) {
      newImageData = await this.minioService.uploadMultiple(files, 'posts');
    }

    const post = await this.prisma.post.update({
      where: { id },
      data: {
        title: updatePostDto.title,
        content: updatePostDto.content,
        published: updatePostDto.published,
        ...(newImageData.length > 0 && {
          images: {
            create: newImageData.map((img) => ({
              url: img.url,
              presignedUrl: img.presignedUrl,
            })),
          },
        }),
      },
      include: {
        images: true,
        author: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    return {
      success: true,
      message: 'Post updated successfully',
      data: post,
    };
  }

  async remove(id: number) {
    const post = await this.prisma.post.findUnique({
      where: { id },
      include: { images: true },
    });

    if (!post) {
      throw new NotFoundException(`Post with ID ${id} not found`);
    }

    // Delete images from MinIO
    for (const image of post.images) {
      try {
        await this.minioService.delete(image.url);
      } catch (error) {
        console.error(`Failed to delete image: ${image.url}`, error);
      }
    }

    await this.prisma.post.delete({
      where: { id },
    });

    return {
      success: true,
      message: 'Post deleted successfully',
    };
  }
}
