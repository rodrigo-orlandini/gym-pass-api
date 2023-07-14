import { compare } from 'bcryptjs';
import { describe, it, expect, beforeEach } from 'vitest';

import { RegisterUseCase } from './register';
import { UserAlreadyExistsError } from './errors/user-already-exists-error';

import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository';
import { IUsersRepository } from '@/repositories/users-repository';

let usersRepository: IUsersRepository;
let sut: RegisterUseCase;

describe('Register Use Case', () => {
	beforeEach(async () => {
		usersRepository = new InMemoryUsersRepository();
		sut = new RegisterUseCase(usersRepository);
	});

	it('should be able to register user', async () => {
		const { user } = await sut.execute({
			name: 'John Doe',
			email: 'johndoe@example.com',
			password: '123456'
		});

		expect(user.id).toEqual(expect.any(String));
	});

	it('should hash user password upon registration', async () => {
		const { user } = await sut.execute({
			name: 'John Doe',
			email: 'johndoe@example.com',
			password: '123456'
		});

		const isPasswordCorrectlyHashed = await compare('123456', user.password_hash);

		expect(isPasswordCorrectlyHashed).toBeTruthy();
	});

	it('should not be able to register user with same email twice', async () => {
		const email = 'johndoe@example.com';

		await sut.execute({
			name: 'John Doe',
			email,
			password: '123456'
		});

		expect(async () => {
			await sut.execute({
				name: 'John Doe',
				email,
				password: '123456'
			});
		}).rejects.toBeInstanceOf(UserAlreadyExistsError);
	});
});