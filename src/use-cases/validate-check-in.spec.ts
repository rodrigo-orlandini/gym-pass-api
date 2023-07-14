import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';

import { ValidateCheckInUseCase } from './validate-check-in';

import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-check-ins-repository';

import { ResourceNotFoundError } from './errors/resource-not-found-error';
import { LateCheckInValidationError } from './errors/late-check-in-validation-error';

let checkInsRepository: InMemoryCheckInsRepository;
let sut: ValidateCheckInUseCase;

describe('Validate Check In Use Case', () => {
	beforeEach(async () => {
		checkInsRepository = new InMemoryCheckInsRepository();
		sut = new ValidateCheckInUseCase(checkInsRepository);

		vi.useFakeTimers();
	});

	afterEach(() => {
		vi.useRealTimers();
	});

	it('should be able to validate a check-in', async () => {
		const createdCheckIn = await checkInsRepository.create({
			user_id: 'user-1',
			gym_id: 'gym-1'
		});
		
		const { checkIn } = await sut.execute({
			checkInId: createdCheckIn.id
		});

		expect(checkIn.validated_at).toEqual(expect.any(Date));
		expect(checkInsRepository.checkIns[0].validated_at).toEqual(expect.any(Date));
	});

	it('should not be able to validate an inexistent check-in', async () => {
		expect(async () => {
			await sut.execute({
				checkInId: 'fake-check-in-id'
			});	
		}).rejects.toBeInstanceOf(ResourceNotFoundError);
	});

	it('should not be able to validate the check-in after 20 minutes of its creation', async () => {
		vi.setSystemTime(new Date(2023, 6, 5, 23, 20));

		const createdCheckIn = await checkInsRepository.create({
			user_id: 'user-1',
			gym_id: 'gym-1'
		});

		const twentyOneMinutesInMilliSeconds = 1000 * 60 * 21;
		
		vi.advanceTimersByTime(twentyOneMinutesInMilliSeconds);

		expect(async () => {
			await sut.execute({
				checkInId: createdCheckIn.id
			});
		}).rejects.toBeInstanceOf(LateCheckInValidationError);
	});
});