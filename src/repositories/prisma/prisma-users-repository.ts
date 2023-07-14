import { Prisma, User } from '@prisma/client';

import { IUsersRepository } from '../users-repository';

import { prisma } from '@/lib/prisma';

export class PrismaUsersRepository implements IUsersRepository {
	public async findById(id: string): Promise<User | null> {
		const user = await prisma.user.findUnique({
			where: { id }
		});

		return user;
	}
	
	public async findByEmail(email: string): Promise<User | null> {
		const user = await prisma.user.findUnique({
			where: { email }
		});

		return user;
	}

	public async create(userData: Prisma.UserCreateInput): Promise<User> {
		const user = await prisma.user.create({ data: userData });

		return user;		
	}
}