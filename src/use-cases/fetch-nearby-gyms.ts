import { Gym } from '@prisma/client';

import { IGymsRepository } from '@/repositories/gyms-repository';

interface FetchNearbyGymsUseCaseRequest {
	userLongitude: number;
	userLatitude: number;
}

interface FetchNearbyGymsUseCaseResponse {
	gyms: Gym[];
}

export class FetchNearbyGymsUseCase {
	constructor (
		private gymsRepository: IGymsRepository
	) {}

	public async execute({ userLatitude, userLongitude }: FetchNearbyGymsUseCaseRequest): Promise<FetchNearbyGymsUseCaseResponse> {
		const gyms = await this.gymsRepository.findManyNearby({
			latitude: userLatitude,
			longitude: userLongitude
		});

		return { 
			gyms
		};
	}
}