import { Prisma, User } from '@prisma/client';
import { randomUUID } from 'crypto';

import { IUsersRepository } from '../users-repository';

export class InMemoryUsersRepository implements IUsersRepository {
	public users: User[] = [];

	public async findById(id: string): Promise<User | null> {
		const user = this.users.find(user => user.id === id);

		if(!user) {
			return null;
		}

		return user;
	}

	public async findByEmail(email: string): Promise<User | null> {
		const user = this.users.find(user => user.email === email);

		if(!user) {
			return null;
		}

		return user;
	}

	public async create(data: Prisma.UserCreateInput): Promise<User> {
		const user = {
			id: randomUUID(),
			name: data.name,
			email: data.email,
			password_hash: data.password_hash,
			created_at: new Date()
		};

		this.users.push(user);

		return user;
	}
}