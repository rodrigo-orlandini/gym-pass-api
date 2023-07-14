import dayjs from 'dayjs';
import { CheckIn } from '@prisma/client';

import { ICheckInsRepository } from '@/repositories/check-ins-repository';

import { ResourceNotFoundError } from './errors/resource-not-found-error';
import { LateCheckInValidationError } from './errors/late-check-in-validation-error';

interface ValidateCheckInUseCaseRequest {
	checkInId: string;
}

interface ValidateCheckInUseCaseResponse {
	checkIn: CheckIn;
}

export class ValidateCheckInUseCase {
	constructor (
		private checkInsRepository: ICheckInsRepository
	) {}

	public async execute({ checkInId }: ValidateCheckInUseCaseRequest): Promise<ValidateCheckInUseCaseResponse> {
		const checkIn = await this.checkInsRepository.findById(checkInId);

		if(!checkIn) {
			throw new ResourceNotFoundError();
		}

		const differenceInMinutesFromCheckInCreation = dayjs(new Date()).diff(checkIn.created_at, 'minutes');

		if(differenceInMinutesFromCheckInCreation > 20) {
			throw new LateCheckInValidationError();
		}

		checkIn.validated_at = new Date();

		await this.checkInsRepository.save(checkIn);

		return { 
			checkIn
		};
	}
}