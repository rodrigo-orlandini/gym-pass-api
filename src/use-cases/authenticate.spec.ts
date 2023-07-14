import { hash } from 'bcryptjs';
import { describe, it, expect, beforeEach } from 'vitest';

import { AuthenticateUseCase } from './authenticate';

import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository';
import { IUsersRepository } from '@/repositories/users-repository';

import { InvalidCredentialsError } from './errors/invalid-credentials-error';

let usersRepository: IUsersRepository;
let sut: AuthenticateUseCase;

describe('Authenticate Use Case', () => {
	beforeEach(async () => {
		usersRepository = new InMemoryUsersRepository();
		sut = new AuthenticateUseCase(usersRepository);
	});

	it('should be able to authenticate an user', async () => {
		const password_hash = await hash('123456', 6);

		await usersRepository.create({
			name: 'John Doe',
			email: 'johndoe@example.com',
			password_hash
		});

		const { user } = await sut.execute({
			email: 'johndoe@example.com',
			password: '123456'
		});

		expect(user.id).toEqual(expect.any(String));
	});

	it('should not be able to authenticate with wrong email', async () => {
		expect(async () => {
			await sut.execute({
				email: 'johndoe@example.com',
				password: '123456'
			});
		}).rejects.toBeInstanceOf(InvalidCredentialsError);
	});

	it('should not be able to authenticate with wrong password', async () => {
		const password_hash = await hash('ABCDEF', 6);

		await usersRepository.create({
			name: 'John Doe',
			email: 'johndoe@example.com',
			password_hash
		});

		expect(async () => {
			await sut.execute({
				email: 'johndoe@example.com',
				password: '123456'
			});
		}).rejects.toBeInstanceOf(InvalidCredentialsError);
	});
});