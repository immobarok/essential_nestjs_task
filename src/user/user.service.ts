import { Injectable, ConflictException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma.service.js';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  // Find a user by email for the Authentication process
  async findOne(email: string) {
    return this.prisma.user.findUnique({
      where: { email },
    });
  }

  // Find a user by ID to show profile or related posts
  async findById(id: number) {
    return this.prisma.user.findUnique({
      where: { id },
      include: { posts: true }, // Includes all posts written by this user
    });
  }

  // Create a new user with a hashed password
  async create(data: any) {
    // Check if user already exists
    const existing = await this.prisma.user.findUnique({
      where: { email: data.email },
    });

    if (existing) {
      throw new ConflictException('Email already exists');
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);

    return this.prisma.user.create({
      data: {
        email: data.email,
        name: data.name,
        password: hashedPassword,
      },
    });
  }
}
