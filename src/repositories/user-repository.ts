import { PrismaClient, User } from '@prisma/client';

const prisma = new PrismaClient();
type UserWithoutPassword = Omit<User, 'password'>;

export class UserRepository {
  static async countUsers(): Promise<number> {
    return await prisma.user.count();
  }

  static async findUserById(id: string): Promise<User | null> {
    return prisma.user.findUnique({ where: { id }, include: { addresses: true } });
  }

  static async findUserByEmail(email: string): Promise<User | null> {
    return prisma.user.findUnique({ where: { email } });
  }

  static async findUsersWithPagination(limit: number, skip: number): Promise<UserWithoutPassword[]> {
    return prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        birthDate: true,
        createdAt: true,
        updatedAt: true,
        addresses: true,
      },
      orderBy: {
        name: 'asc',
      },
      take: limit,
      skip,
    });
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
