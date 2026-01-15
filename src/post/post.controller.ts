import {
  Controller,
  Post,
  Body,
  UploadedFiles,
  UseInterceptors,
  UseGuards,
  Req,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { PostService } from './post.service.js';
import { CreatePostDto } from './dto/create-post.dto.js';
import { FileUploadService } from '../common/services/file-upload.service.js';
import { JwtAuthGuard } from '../auth/jwt-auth.guard.js';


@Controller('posts')
export class PostController {
  constructor(
    private readonly postService: PostService,
    private readonly fileUploadService: FileUploadService,
  ) {}

  @Post("create")
  @UseGuards(JwtAuthGuard) // Shudhu login kora user access pabe
  @UseInterceptors(FilesInterceptor('images', 10)) // Max 10 images, field name 'images'
  async create(
    @UploadedFiles() files: Array<Express.Multer.File>,
    @Body() createPostDto: CreatePostDto,
    @Req() req: any,
  ) {
    // 1. JWT Token theke User ID neya
    const userId = req.user.id;

    // 2. Image upload logic (Check if files exist)
    let imageUrls: string[] = [];
    if (files && files.length > 0) {
      // FileUploadService er maddhome file gulo bucket e pathano
      imageUrls = await this.fileUploadService.uploadToLocalBucket(
        files,
        'posts',
      );
    }

    // 3. Service call kore Database record create kora
    return await this.postService.createPost(
      createPostDto,
      userId,
      imageUrls,
    );
  }
}
