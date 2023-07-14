import { User } from '@prisma/client';
import { hash } from 'bcryptjs';

import { UserAlreadyExistsError } from './errors/user-already-exists-error';

import { IUsersRepository } from '@/repositories/users-repository';

interface RegisterUseCaseRequest {
	name: string;
	email: string;
	password: string;
}

interface RegisterUseCaseReply {
	user: User;
}

export class RegisterUseCase {
	constructor (
		private usersRepository: IUsersRepository
	) {}

	public async execute({ name, email, password }: RegisterUseCaseRequest): Promise<RegisterUseCaseReply> {
		const password_hash = await hash(password, 6);
	
		const userWithSameEmail = await this.usersRepository.findByEmail(email);
	
		if(userWithSameEmail) {
			throw new UserAlreadyExistsError();
		}
	
		const user = await this.usersRepository.create({
			name, 
			email, 
			password_hash
		});

		return {
			user
		};
	}
}