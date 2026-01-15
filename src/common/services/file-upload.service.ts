import { Injectable, InternalServerErrorException } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import sharp from 'sharp';

@Injectable()
export class FileUploadService {
  private readonly rootFolder = path.resolve(process.cwd(), 'uploads');

  async uploadToLocalBucket(
    files: Array<Express.Multer.File>,
    bucket: string,
  ): Promise<string[]> {
    const bucketPath = path.join(this.rootFolder, bucket);
    if (!fs.existsSync(bucketPath)) {
      fs.mkdirSync(bucketPath, { recursive: true });
    }
    try {
      const uploadPromises = files.map(async (file) => {
        const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
        const fileName = `${uniqueSuffix}.webp`;
        const filePath = path.join(bucketPath, fileName);
        await sharp(file.buffer)
          .resize(1200, null, {
            withoutEnlargement: true,
            fit: 'inside',
          })
          .webp({ quality: 80 })
          .toFile(filePath);
        return `/public/${bucket}/${fileName}`;
      });
      const uploadedUrls = await Promise.all(uploadPromises);
      return uploadedUrls;
    } catch (error) {
      console.error('Sharp Processing/File Upload Error:', error);
      throw new InternalServerErrorException(
        'Could not process and save files',
      );
    }
  }
}
