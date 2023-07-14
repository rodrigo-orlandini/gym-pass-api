import { CheckIn } from '@prisma/client';

import { ICheckInsRepository } from '@/repositories/check-ins-repository';

interface FetchUserCheckInsHistoryUseCaseRequest {
	userId: string;
	page: number;
}

interface FetchUserCheckInsHistoryUseCaseResponse {
	checkIns: CheckIn[];
}

export class FetchUserCheckInsHistoryUseCase {
	constructor (
		private checkInsRepository: ICheckInsRepository
	) {}

	public async execute({ userId, page }: FetchUserCheckInsHistoryUseCaseRequest): Promise<FetchUserCheckInsHistoryUseCaseResponse> {
		const userCheckIns = await this.checkInsRepository.findManyByUserId(userId, page);

		return { checkIns: userCheckIns };
	}
}