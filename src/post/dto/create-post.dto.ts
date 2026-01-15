import {
  IsNotEmpty,
  IsString,
  IsOptional,
  IsBoolean,
  MinLength,
  MaxLength,
} from 'class-validator';
import { Transform } from 'class-transformer';

export class CreatePostDto {
  @IsNotEmpty({ message: 'Title is required' })
  @IsString()
  @MinLength(5, { message: 'Title must be at least 5 characters long' })
  @MaxLength(150, { message: 'Title is too long' })
  title: string;

  @IsOptional()
  @IsString()
  @MaxLength(5000, { message: 'Content is too long' })
  content?: string;

  @IsOptional()
  @Transform(({ value }) => value === 'true' || value === true)
  @IsBoolean()
  published?: boolean;
}
