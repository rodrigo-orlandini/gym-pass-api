import { hash } from 'bcryptjs';
import { describe, it, expect, beforeEach } from 'vitest';

import { GetUserProfileUseCase } from './get-user-profile';

import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository';
import { IUsersRepository } from '@/repositories/users-repository';

import { ResourceNotFoundError } from './errors/resource-not-found-error';

let usersRepository: IUsersRepository;
let sut: GetUserProfileUseCase;

describe('Get User Profile Use Case', () => {
	beforeEach(async () => {
		usersRepository = new InMemoryUsersRepository();
		sut = new GetUserProfileUseCase(usersRepository);
	});

	it('should be able to get user profile', async () => {
		const password_hash = await hash('123456', 6);

		const createdUser = await usersRepository.create({
			name: 'John Doe',
			email: 'johndoe@example.com',
			password_hash
		});

		const { user } = await sut.execute({
			userId: createdUser.id
		});

		expect(user.id).toEqual(expect.any(String));
		expect(user.name).toEqual('John Doe');
	});

	it('should not be able to get user profile with wrong id', async () => {
		expect(async () => {
			await sut.execute({
				userId: 'some-fake-id'
			});
		}).rejects.toBeInstanceOf(ResourceNotFoundError);
	});
});