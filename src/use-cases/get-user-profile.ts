import { User } from '@prisma/client';

import { IUsersRepository } from '@/repositories/users-repository';
import { ResourceNotFoundError } from './errors/resource-not-found-error';

interface GetUserProfileUseCaseRequest {
	userId: string;
}

interface GetUserProfileUseCaseResponse {
	user: User
}

export class GetUserProfileUseCase {
	constructor (
		private usersRepository: IUsersRepository
	) {}

	public async execute({ userId }: GetUserProfileUseCaseRequest): Promise<GetUserProfileUseCaseResponse> {
		const user = await this.usersRepository.findById(userId);

		if(!user) {
			throw new ResourceNotFoundError();
		}

		return { user };
	}
}