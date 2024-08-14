import { PrismaClient, User } from '@prisma/client';

const prisma = new PrismaClient();
type UserWithoutPassword = Omit<User, 'password'>;

export class UserRepository {
  static async findUserById(id: string): Promise<User | null> {
    return prisma.user.findUnique({ where: { id } });
  }

  static async findUserByEmail(email: string): Promise<User | null> {
    return prisma.user.findUnique({ where: { email } });
  }

  static async findUsers(limit: number): Promise<UserWithoutPassword[]> {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        birthDate: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: {
        name: 'asc',
      },
      take: limit,
    });

    return users;
  }

  static async createUser(data: { name: string; email: string; password: string; birthDate: string }): Promise<User> {
    return prisma.user.create({ data });
  }

  static async updateUser(id: string, data: { name?: string; email?: string; birthDate?: string }): Promise<User> {
    return prisma.user.update({
      where: { id },
      data,
    });
  }
}
